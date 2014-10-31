"use strict";

module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    picurl: DataTypes.STRING,
    amazonurl: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Product.hasMany(models.Rating, { foreignKey: "product_id" });
      }
    },
    instanceMethods: {
      // getAverageRating: function() {
      //   this.getRatings().then(function(ratings) {
      //     var sum = 0;
      //     for (var i=0; i < ratings.length; i++) {
      //       sum += ratings[i].stars;
      //     }

      //     return new Promise(function(resolve, reject) {
      //       resolve(sum / ratings.length);
      //     });
      //   });
      // }
    }
  });

  return Product;
};
