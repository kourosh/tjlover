// Set up node and modules
var crypto = require("crypto"),
    express = require("express"),
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
var bcrypt;
var salt = null;
try {
	bcrypt = require('bcrypt');
	salt = bcrypt.genSaltSync(10);
} catch (e) {
	try {
		bcrypt = require('bcryptjs');
		salt = bcrypt.genSaltSync(10);
	} catch (err) {
		bcrypt = null;
	}
}

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
	models.Product.findAll().then(function(items) {

		// Create blank array for storing IDs of all returned products
		var productIds= [];

		// Push the primary key IDs of the returned items into the array
		for (var i = 0; i < items.length; i++) {
			productIds.push(items[i].id);
		}

		var pickRandom = function() {
			var idx = Math.floor(Math.random() * items.length);
			return items.splice(idx, 1)[0];
		};

		var pick1 = pickRandom();
		var pick2 = pickRandom();
		var pick3 = pickRandom();

		var product = pick1.name, id = pick1.id, description = pick1.description, picurl = pick1.picurl;
		var product2 = pick2.name, id2 = pick2.id, description2 = pick2.description, picurl2 = pick2.picurl;
		var product3 = pick3.name, id3 = pick3.id, description3 = pick3.description, picurl3 = pick3.picurl;

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
			}, isAuthenticated: req.isAuthenticated()			
		});
	}); 
});

// Route for product page. This checks the ID in the URL and 
// returns the name, description, image URL and Amazon URL for 
// that product primary key ID.
app.get("/product/:id", function(req, res) {
	models.Product.find(req.params.id).then(function(item) {
		if (!item) return res.status(404).send('Not found');
		// Compute average rating and pass product id to view
		item.getAverageRating().then(function(avg) {
			res.render("product", {
				product: item.name,
				description: item.description,
				picurl: item.picurl,
				amazonurl: item.amazonurl,
				isAuthenticated: req.isAuthenticated(),
				averageRating: avg,
				productId: item.id
			});
		});
	}).catch(function(err){
		console.log(err);
		res.status(500).send('Server error');
	});
});

// Route to save a rating via AJAX
app.post('/rating', function(req, res) {
	if (!req.isAuthenticated || !req.isAuthenticated()) {
		return res.status(401).json({ error: 'authentication required' });
	}

	var stars = parseFloat(req.body.stars);
	var productId = parseInt(req.body.product_id, 10);
	// If the user already rated this product, update the existing rating
	models.Rating.find({ where: { user_id: req.user.id, product_id: productId } }).then(function(existing) {
		var savePromise;
		if (existing) {
			savePromise = existing.updateAttributes({ stars: stars });
		} else {
			savePromise = models.Rating.create({
				stars: stars,
				product_id: productId,
				user_id: req.user.id
			});
		}

		savePromise.then(function(rating) {
			// return updated average
			models.Product.find(productId).then(function(product) {
				product.getAverageRating().then(function(avg) {
					res.json({ success: true, average: avg });
				});
			});
		}).catch(function(err) {
			console.log(err);
			res.status(500).json({ error: 'db error' });
		});
	}).catch(function(err) {
		console.log(err);
		res.status(500).json({ error: 'db error' });
	});
});



// Route for product search from the search bar. Search bar posts
// "product". If a product with the same name is found, the
// product's primary key ID is returned. This route then redirects
// to the project.ejs page with ID appended to the URL to show 
// the matching search result.
app.post("/product", function(req, res) {
	var term = req.body.product ? req.body.product.trim() : '';
	if (!term) return res.redirect('/');
	models.Product.findAll({ where: ['name LIKE ?', '%' + term + '%'] }).then(function(items) {
		res.render('search', { results: items, query: term, isAuthenticated: req.isAuthenticated() });
	}).catch(function(err) {
		console.log(err);
		res.redirect('/');
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
	}).then(function() {
		res.redirect("/login");
	}).catch(function(err) {
		console.log(err);
		res.redirect("/signup");
	});
});

// Login form routes
app.get("/login", function(req, res) {
	res.render("login");
});

// Logout route
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

//Set up login POST route to be handled through Passport

app.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}));

// Forgot password routes
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.get("/forgot", function(req, res) {
	res.render("forgot", { message: null });
});

app.post("/forgot", function(req, res) {
	var email = req.body.email ? req.body.email.trim() : '';
	if (!email) return res.render("forgot", { message: "Please enter your email address." });

	var token = crypto.randomBytes(32).toString("hex");
	var expires = new Date(Date.now() + 3600000); // 1 hour

	models.User.find({ where: { email: email } }).then(function(user) {
		if (!user) {
			// Don't reveal whether the address exists
			return res.render("forgot", { message: "If that address is registered, a reset link has been sent." });
		}
		return user.updateAttributes({ resetToken: token, resetTokenExpires: expires }).then(function() {
			var baseUrl = process.env.BASE_URL || 'http://localhost:3000';
			var resetUrl = baseUrl + '/reset/' + token;
			var msg = {
				to: email,
				from: process.env.FROM_EMAIL || 'noreply@traderlover.com',
				subject: 'Trader Lover — password reset',
				text: 'Click the link below to reset your password. It expires in 1 hour.\n\n' + resetUrl,
				html: '<p>Click the link below to reset your password. It expires in 1 hour.</p><p><a href="' + resetUrl + '">' + resetUrl + '</a></p>'
			};
			return sgMail.send(msg).then(function() {
				res.render("forgot", { message: "Reset link sent — check your inbox." });
			});
		});
	}).catch(function(err) {
		console.log(err);
		res.render("forgot", { message: "Something went wrong. Please try again." });
	});
});

app.get("/reset/:token", function(req, res) {
	models.User.find({ where: { resetToken: req.params.token, resetTokenExpires: { gt: new Date() } } }).then(function(user) {
		if (!user) return res.render("forgot", { message: "Reset link is invalid or has expired." });
		res.render("reset", { token: req.params.token, message: null });
	}).catch(function(err) {
		console.log(err);
		res.redirect("/forgot");
	});
});

app.post("/reset/:token", function(req, res) {
	models.User.find({ where: { resetToken: req.params.token, resetTokenExpires: { gt: new Date() } } }).then(function(user) {
		if (!user) return res.render("forgot", { message: "Reset link is invalid or has expired." });
		var newPassword = models.User.hashPass(req.body.password);
		return user.updateAttributes({ password: newPassword, resetToken: null, resetTokenExpires: null }).then(function() {
			res.redirect("/login");
		});
	}).catch(function(err) {
		console.log(err);
		res.render("reset", { token: req.params.token, message: "Something went wrong. Please try again." });
	});
});

// Bind and listen for connections on given host
app.listen(process.env.PORT || 3000);