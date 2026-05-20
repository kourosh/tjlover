var models = require('../models/index');

models.sequelize.sync().then(function() {
  return models.Product.findOrCreate({ where: { name: 'Mandarin Orange Chicken' }, defaults: {
    description: 'A Trader Joe\'s fan favorite. Lightly battered, boneless chicken pieces tossed in a sweet and savory mandarin orange sauce. Ready in minutes from frozen.',
    picurl: 'https://www.traderjoes.com/content/dam/trjo/context-images/66563-Mandarin-Orange-Chicken-pdp.jpg/jcr:content/renditions/webp-1280.webp',
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
