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
      },
      getAverage: function(productId) {
        models.Rating.findAll( {where: {product_id: req.body.id } }).done(function(error, rating) {
          if (error) console.log(error);
          var sum;
          for (var i = 0; i < rating.length; i++ ) {
            sum += parseInt( rating[i], 10);
          }

          var averageRating = sum / rating.length;

        });;
      }
    }
    
  });
  return Rating;
}  
