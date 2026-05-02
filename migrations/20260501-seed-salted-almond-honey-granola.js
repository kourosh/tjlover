"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    return migration.bulkInsert('Products', [{
      name: 'Salted Almond Honey Granola',
      description: 'Sweet-salty granola with almonds and honey — great for breakfast, parfaits, or snacking.',
      picurl: 'https://www.traderjoes.com/content/dam/trjo/context-images/83295-salted-almond-honey-granola-pdp.jpg',
      amazonurl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {}).then(function() { done(); }).catch(function(err){ done(err); });
  },

  down: function(migration, DataTypes, done) {
    return migration.bulkDelete('Products', { name: 'Salted Almond Honey Granola' }, {}).then(function(){ done(); }).catch(function(err){ done(err); });
  }
};
