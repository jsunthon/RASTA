var mongoose = require('mongoose');
var config = require('../../config/constants');
var User = require('./../models/user.js');

function DBInit() {
    if (mongoose.connection.readyState == 0) {
        mongoose.connect(config.database);
    }

    User.findOne({name: "Admin"}, function (err, found_user) {
        if (err) return console.error(err);
        if (found_user == null) {
            var new_user = new User(
                {
                    name: "Admin",
                    password: "jpl",
                    addedBy: "AI"
                }
            );
            new_user.save();
        }
    });

    User.findOne({name: "Rastadmin"}, function (err, found_user) {
        if (err) return console.error(err);
        if (found_user == null) {
            var new_user = new User(
              {
                  name: "Rastadmin",
                  password: "jpl",
                  addedBy: "AI"
              }
            );
            new_user.save();
        }
    });


    User.findOne({name: "George_costanza"}, function (err, found_user) {
        if (err) return console.error(err);
        if (found_user == null) {
            var new_user = new User(
              {
                  name: "George_costanza",
                  password: "bosco",
                  addedBy: "AI"
              }
            );
            new_user.save();
        }
    });

    mongoose.Promise = Promise;
    this.goose = mongoose.connection;
    this.goose.once('error', console.error.bind(console, 'connection error'));
}

var init = new DBInit();
module.exports = init;