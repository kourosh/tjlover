var models = require('../models/index');

models.sequelize.sync().then(function() {
  console.log('Database synced.');
  return models.Product.findOrCreate({ where: { name: 'Pickled Jalapeño Pepper Slices' }, defaults: {
    description: 'Sliced pickled jalapeños in a tangy vinegar brine — great as a topping for pizza, nachos, sandwiches, and more.',
    picurl: 'https://www.traderjoes.com/content/dam/trjo/context-images/78490-pickled-jalapeno-slices-pdp.jpg',
    amazonurl: null
  }});
}).then(function(result) {
  console.log('Product created or already exists:', result[0].name);
  process.exit(0);
}).catch(function(err) {
  console.error('Error syncing or inserting:', err);
  process.exit(1);
});
