"use strict";

module.exports = function(sequelize, DataTypes) {
  var Rating = sequelize.define("Rating", {
    stars: DataTypes.FLOAT,
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Rating.belongsTo(models.Product, { foreignKey: "product_id" });
      }
    }
    
  });
  return Rating;
}  
