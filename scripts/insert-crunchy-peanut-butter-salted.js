var models = require('../models/index');

models.sequelize.sync().then(function() {
  return models.Product.findOrCreate({ where: { name: 'Crunchy Peanut Butter Salted' }, defaults: {
    description: "This Peanut Butter is made with just two ingredients: peanuts and salt. Dry-roasted peanuts are made into a delicious crunchy, salted peanut butter. Store upside down before opening to simplify stirring.",
    picurl: 'https://www.traderjoes.com/content/dam/trjo/products/m20903/01488.png',
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
