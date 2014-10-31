var models = require('./models/index');

models.Product.find(3).then(function(p) {
	p.getAverageRating().then(function(average) {
		console.log(average);
	});
});
