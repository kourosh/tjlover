"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    // Add a unique index on (user_id, product_id) to prevent duplicate ratings
    migration.addIndex('Ratings', ['user_id', 'product_id'], { indexName: 'ratings_user_product_unique', indicesType: 'UNIQUE' }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeIndex('Ratings', 'ratings_user_product_unique').done(done);
  }
};
