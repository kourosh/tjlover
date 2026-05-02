var models = require('../models/index');

models.sequelize.sync().then(function() {
  return models.Product.findOrCreate({ where: { name: 'Crispy Rice Bars' }, defaults: {
    description: 'Toasted-rice & marshmallow treats. Trader Joe\'s Crispy Rice Bars are pre-cut and individually wrapped—portable and perfect for lunches, snack bags, and on-the-go treats.',
    picurl: 'https://www.traderjoes.com/content/dam/trjo/context-images/83604-crispy-rice-bars-pdp.jpg',
    amazonurl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }});
}).then(function(result) {
  console.log('Product created or already exists:', result[0].name);
  process.exit(0);
}).catch(function(err) {
  console.error('Error inserting product:', err);
  process.exit(1);
});
