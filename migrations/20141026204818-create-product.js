"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      product_name: {
        type: DataTypes.STRING
      },
      sku: {
        type: DataTypes.STRING
      },
      pic_url: {
        type: DataTypes.STRING
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
    migration.dropTable("Products").done(done);
  }
};