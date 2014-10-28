"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Ratings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      stars: {
        type: DataTypes.FLOAT
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      product_id: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Ratings").done(done);
  }
};