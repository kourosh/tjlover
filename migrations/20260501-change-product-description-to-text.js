"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    // Change Products.description to TEXT
    migration.changeColumn('Products', 'description', { type: DataTypes.TEXT }).done(done);
  },
  down: function(migration, DataTypes, done) {
    // Revert back to STRING
    migration.changeColumn('Products', 'description', { type: DataTypes.STRING }).done(done);
  }
};
