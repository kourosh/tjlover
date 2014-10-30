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


///////////////////////////////////////////
// Passport Installation and Configuration 
///////////////////////////////////////////
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

var passport = require("passport"),
    localStrategy = require("passport-local").Strategy,
    flash = require('connect-flash'),
    session = require("cookie-session");

//Setup Passport for use

app.use(session( {
  secret: 'thisismysecretkey',
  name: 'chocolate chip',
  maxage: 3600000
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    models.User.find({
        where: {
            id: id
        }
    }).done(function(error,user){
        done(error, user);
    });
});

/////////////////////////////////////////////////
// End of Passport installation and configuration
/////////////////////////////////////////////////





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

// Route for product page. This checks the ID in the URL and 
// returns the name, description, image URL and Amazon URL for 
// that product primary key ID.
app.get("/product/:id", function(req, res) {
	models.Product.find(req.params.id).success(function(item) {
		res.render("product", {
			product: item.name,
			description: item.description,
			picurl: item.picurl,
			amazonurl: item.amazonurl
		});
	});
});

// Route for product search from the search bar. Search bar posts
// "product". If a product with the same name is found, the
// product's primary key ID is returned. This route then redirects
// to the project.ejs page with ID appended to the URL to show 
// the matching search result.
app.post("/product", function(req, res) {
	debugger;
	models.Product.find( { where: {name: req.body.product} }).done(function(error, item) {
			if (error) console.log(error);
			res.redirect('/product/' + item.id);
		});
});

// Route for a product administration page
app.get("/admin", function(req, res) {
	res.render("admin");
})

// Route for product create page. A simple page to enter product
// info -- name, description, image URL and an Amazon URL where
// product can be bought (tied to an Amazon affiliate account).
app.post("/admin", function(req, res) {
  models.Product.create({
    name: req.body.name,
    description: req.body.description,
    picurl: req.body.pictureurl,
    amazonurl: req.body.amazonurl
  }).then(function(product) {
    res.redirect("/admin");
  });
});

// Route to user registration page
app.get("/signup", function(req, res) {
	res.render("signup");
});

// Route to register a new user
app.post("/signup", function(req, res) {
	models.User.createNewUser({
		email: req.body.email,
		password: req.body.password
	});
	res.redirect("/login");
});

// Login form routes
app.get("/login", function(req, res) {
	res.render("login");
});

//Set up login POST route to be handled through Passport

app.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}));

// Bind and listen for connections on given host
app.listen(process.env.PORT || 3000);