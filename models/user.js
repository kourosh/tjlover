"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail:true
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

  return User;
};
