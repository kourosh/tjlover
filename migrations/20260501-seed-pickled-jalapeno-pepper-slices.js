"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    return migration.bulkInsert('Products', [{
      name: 'Pickled Jalapeño Pepper Slices',
      description: 'Sliced pickled jalapeños in a tangy vinegar brine — great as a topping for pizza, nachos, sandwiches, and more.',
      picurl: 'https://www.traderjoes.com/content/dam/trjo/context-images/78490-pickled-jalapeno-slices-pdp.jpg',
      amazonurl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {}).then(function() { done(); }).catch(function(err){ done(err); });
  },

  down: function(migration, DataTypes, done) {
    return migration.bulkDelete('Products', { name: 'Pickled Jalapeño Pepper Slices' }, {}).then(function(){ done(); }).catch(function(err){ done(err); });
  }
};
