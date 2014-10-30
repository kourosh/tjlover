"use strict";

var passport = require("passport");
var localStrategy = require("passport-local").Strategy;

var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      validate: {
        // isEmail:true
      }
    },
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
      // associations can be defined here
      },
      // This method encrypts a password with blowfish
      hashPass: function(password) {
        return bcrypt.hashSync(password, salt);
      },

      // This method compares a given password with 
      // encrypted password hash in database
      comparePass: function(userpass, dbpass) {
        return bcrypt.compareSync(userpass, dbpass);
      },

      // This method creates a new user in the database
      createNewUser: function(userInfo) {
        User.create({
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
      }).done(function(error, user) {
        if (user) {
          if (User.comparePass(password, user.password)) {
            done(null, user);
          } else {
            done(null, null);
          }
        } else {
          done(null, null);
        }
      });
    }
  ));

  return User;
};
