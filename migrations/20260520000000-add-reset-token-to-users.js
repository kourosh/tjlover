"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn("Users", "resetToken", { type: DataTypes.STRING })
      .then(function() {
        return migration.addColumn("Users", "resetTokenExpires", { type: DataTypes.DATE });
      })
      .then(function() { done(); })
      .catch(done);
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn("Users", "resetToken")
      .then(function() {
        return migration.removeColumn("Users", "resetTokenExpires");
      })
      .then(function() { done(); })
      .catch(done);
  }
};
