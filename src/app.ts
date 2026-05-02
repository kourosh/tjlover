import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import AppDataSource from './data-source';
import { Product } from './entities/Product';
import { Rating } from './entities/Rating';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

// connect to DB
AppDataSource.initialize().then(() => {
  console.log('DataSource initialized');
}).catch((err) => {
  console.error('DataSource initialize error:', err);
});

// Home route — pick three random products
app.get('/', async (req, res) => {
  const productRepo = AppDataSource.getRepository(Product);
  const items = await productRepo.find();

  const picks: (Product | null)[] = [];
  if (!items || items.length === 0) {
    picks.push(null, null, null);
  } else if (items.length <= 3) {
    // Use available items and pad with nulls if fewer than 3
    for (let i = 0; i < items.length; i++) picks.push(items[i]);
    while (picks.length < 3) picks.push(null);
  } else {
    // Fisher-Yates shuffle to pick three distinct random items
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    picks.push(arr[0], arr[1], arr[2]);
  }

  res.render('index.ejs', {
    Product1: picks[0] || {},
    Product2: picks[1] || {},
    Product3: picks[2] || {},
    isAuthenticated: false
  });
});

// Product page
app.get('/product/:id', async (req, res) => {
  const productRepo = AppDataSource.getRepository(Product);
  const ratingRepo = AppDataSource.getRepository(Rating);
  const id = parseInt(req.params.id, 10);
  const item = await productRepo.findOneBy({ id });
  if (!item) return res.status(404).send('Not found');

  const ratings = await ratingRepo.find({ where: { product: { id } }, relations: ['user'] });
  const avg = ratings.length ? ratings.reduce((s, r) => s + r.stars, 0) / ratings.length : 0;

  res.render('product.ejs', {
    product: item.name,
    description: item.description,
    picurl: item.picurl,
    amazonurl: item.amazonurl,
    isAuthenticated: false,
    averageRating: avg,
    productId: item.id
  });
});

// Save rating — expects `user_id` (temporary) and `stars` in body
app.post('/rating', async (req, res) => {
  const userId = req.body.user_id ? parseInt(req.body.user_id, 10) : null;
  const productId = parseInt(req.body.product_id, 10);
  const stars = parseFloat(req.body.stars);

  if (!productId || isNaN(stars)) return res.status(400).json({ error: 'invalid' });

  const ratingRepo = AppDataSource.getRepository(Rating);
  // upsert by user + product if user provided
  if (userId) {
    const existing = await ratingRepo.findOne({ where: { user: { id: userId }, product: { id: productId } }, relations: ['user','product'] });
    if (existing) {
      existing.stars = stars;
      await ratingRepo.save(existing);
    } else {
      const r = new Rating();
      r.stars = stars;
      r.user = { id: userId } as any;
      r.product = { id: productId } as any;
      await ratingRepo.save(r);
    }
  } else {
    const r = new Rating();
    r.stars = stars;
    r.product = { id: productId } as any;
    await ratingRepo.save(r);
  }

  // return updated average
  const ratings = await ratingRepo.find({ where: { product: { id: productId } } });
  const avg = ratings.length ? ratings.reduce((s, r) => s + r.stars, 0) / ratings.length : 0;
  res.json({ success: true, average: avg });
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, () => console.log('App (TypeScript) listening on', port));
