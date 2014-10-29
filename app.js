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
app.use(bodyParser.urlencoded({ extended: false }))

// enable ejs
app.set("view engine", "ejs");

// enables layout functionality
app.engine('ejs', engine);

// GET css stylesheets and other static assets
app.use(express.static(__dirname + '/public'));


// Route for home page
app.get("/", function(req, res) {
	//Step 1: Pull out all ids into an array
	models.Product.find(8).success(function(item) {
		res.render("index.ejs", {
			product: item.name,
			description: item.description,
			picurl: item.picurl
		});
	});
});
	//Step 2: Generate random number from 0 to array.length - 1
	//Step 3: Pull record with that ID from db
	//Step 4: Repeat

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
app.get("/product", function(req, res) {
	res.render("product.ejs");
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