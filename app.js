// Set up node and modules
var express = require("express"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	pg = require("pg"),
	models = require("./models/index");
 	
	// ejs-locals for Layouts
 	engine = require('ejs-locals');

app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// enable ejs
app.set("view engine", "ejs");

// enables layout functionality
app.engine("ejs", engine);

// GET css stylesheets and other static assets
app.use(express.static(__dirname + '/public'));


// Route for home page
app.get("/", function(req, res) {
	// Need to pick three items at random from the Product table in the 
	// database to display on the front page. To do this, we have to first
	// find all the available products, because products could be added or 
	// deleted in real time.

	// Start with a Sequelize query to find all the items in the 
	// Product table.
	models.Product.findAll().done(function(error, items) {
		
		// Create blank array for storing IDs of all returned products
		var productIds= [];

		// Push the primary key IDs of the returned items into the array
		for (var i = 0; i < items.length - 1; i++) {
			productIds.push(items[i].id);
		};

		console.log("Product IDs: " + productIds);

		// This function generates a random number from 0 to the number
		// of items in the Products table
		randomItem = function() {
			return Math.floor(Math.random() * productIds.length);
		};

		// Assign the random number to variable randomPickedItem. This
		// variable will be used for picking an index in the productIds
		// array. You need this step because the primary key ID in Products
		// table might not be sequential.
		var randomPickedItem = randomItem();

		// Find the product name, description, picture URL and Amazon URL
		// for the random-picked ID
		var product = items[randomPickedItem].name,
				id = items[randomPickedItem].id,
				description = items[randomPickedItem].description,
				picurl = items[randomPickedItem].picurl;

		// Pick a second random number
		randomPickedItem = randomItem();		

		// Find the second product name, description, picture URL and Amazon URL
		// for the random-picked ID
		var product2 = items[randomPickedItem].name,
				id2 = items[randomPickedItem].id,
				description2 = items[randomPickedItem].description,
				picurl2 = items[randomPickedItem].picurl;

		// Pick a third random number
		randomPickedItem = randomItem();

		// Find the third product name, description, picture URL and Amazon URL
		// for the random-picked ID
		var product3 = items[randomPickedItem].name,
				id3 = items[randomPickedItem].id,
				description3 = items[randomPickedItem].description,
				picurl3 = items[randomPickedItem].picurl;

		// Now, render the front page ("index.ejs") and pass the EJS variables
		// that correspond with the above variables.
		res.render("index.ejs", {
			Product1: {
				id: id,
				product: product,
				description: description,
				picurl: picurl
			},
			Product2: {
				id: id2,
				product: product2,
				description: description2,
				picurl: picurl2
			},
			Product3: {
				id: id3,
				product: product3,
				description: description3,
				picurl: picurl3
			}			
		});
	}); 
});

// Route for a product administration page
app.get("/admin", function(req, res) {
	res.render("admin.ejs");
})

// Route for product create page
app.post("/admin", function(req, res) {
  models.Product.create({
    name: req.body.productname,
    description: req.body.description,
    picurl: req.body.pictureurl,
    amazonurl: req.body.amazonurl
  }).then(function(product) {
    res.redirect('/admin');
  });
});

// Route for product page
app.get("/product/:id", function(req, res) {
	models.Product.find(req.params.id).success(function(item) {
		res.render("product.ejs", {
			product: item.name,
			description: item.description,
			picurl: item.picurl,
			amazonurl: item.amazonurl
		});
	});
});

// Route to sign-up page
app.get("/signup", function(req, res) {
	res.render("signup.ejs");
});

// Route to log in
app.get("/login", function(req, res) {
	res.render("login.ejs")
});

// Bind and listen for connections on given host
app.listen(process.env.PORT || 3000);