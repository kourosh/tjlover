// Set up node and modeuls
var express = require("express"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	pg = require("pg");
	models = require('./models/index')


app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set("view engine", "ejs");


// GET css stylesheets and other static assets
app.use(express.static(__dirname + '/public'));


// Route for home page
app.get("/", function(req, res) {
	res.render("home.ejs", {
		product: "Speculoos Cookie Butter Jar",
		description: "Trader John's Speculoos Cookie Butter is, in its most simplistic terms, spreadable Speculoos cookies. Speculoos cookies are classic Belgian cookies with great crunch, and a slightly caramelized, almost-but-not-quite-gingerbread flavor.",
		picurl: "http://ecx.images-amazon.com/images/I/51lDQdCVPHL.jpg",
		amazonurl: "http://www.amazon.com/Trader-Joes-Speculoos-Cookie-Butter/dp/B006KK4GUO"
	});
});

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
app.listen(3000);