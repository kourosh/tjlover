"use strict";

module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
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
      getAverageRating: function() {
        var self = this;
        return this.getRatings().then(function(ratings) {
          if (!ratings || ratings.length === 0) return 0;
          var sum = 0;
          for (var i = 0; i < ratings.length; i++) {
            sum += ratings[i].stars;
          }
          return sum / ratings.length;
        });
      }
    }
  });

  return Product;
};
