var models = require('../models/index');

models.sequelize.sync().then(function() {
  return models.Product.findOrCreate({ where: { name: 'Bonding Shampoo' }, defaults: {
    description: 'Great hair doesn’t happen by accident—it happens when the bonds that give hair its strength and structure are properly supported. Trader Joe\'s Bonding Shampoo is formulated with hydrolyzed keratin and silk to help nourish and strengthen hair. Sulfate-free and gentle for everyday use; safe for color-treated hair.',
    picurl: 'https://www.traderjoes.com/content/dam/trjo/context-images/82842-82843-bonding-shampoo-conditioner-pdp.jpg',
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
