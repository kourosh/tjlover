// Set up node and modeuls
var express = require("express"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	pg = require("pg");


app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set("view engine", "ejs");

// Route for home page
app.get("/", function(req, res) {
	res.render("home.ejs");
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