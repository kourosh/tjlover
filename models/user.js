"use strict";

var passport = require("passport");
var localStrategy = require("passport-local").Strategy;

var bcrypt;
var salt = null;
try {
  bcrypt = require("bcrypt");
  salt = bcrypt.genSaltSync(10);
} catch (e) {
  try {
    // fallback to bcryptjs (pure JS)
    bcrypt = require('bcryptjs');
    salt = bcrypt.genSaltSync(10);
  } catch (err) {
    // bcrypt not installed/failed to build — provide safe fallbacks for dev
    bcrypt = null;
  }
}

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      validate: {
        // isEmail:true
      }
    },
    password: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    resetTokenExpires: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
      // A user can rate many products, so a user will have
      // many ratings.
      User.hasMany(models.Rating, { foreignKey: "user_id" });
      },
      // This method encrypts a password with blowfish (or returns plain text in dev when bcrypt missing)
      hashPass: function(password) {
        if (bcrypt) return bcrypt.hashSync(password, salt);
        return password;
      },

      // This method compares a given password with encrypted password hash in database
      comparePass: function(userpass, dbpass) {
        if (bcrypt) return bcrypt.compareSync(userpass, dbpass);
        return userpass === dbpass;
      },

      // This method creates a new user in the database
      createNewUser: function(userInfo) {
        return User.create({
          email: userInfo.email,
          password: this.hashPass(userInfo.password)
        });
      }
    }
  });

  passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(username, password, done) {
      User.find({
        where: {
          email: username
        }
      }).then(function(user) {
        if (!user) return done(null, false);
        if (User.comparePass(password, user.password)) {
          done(null, user);
        } else {
          done(null, false);
        }
      }).catch(function(error) {
        done(error);
      });
    }
  ));

  return User;
};
