// Here we are requiring our dependencies
var db = require("../models");
var bcrypt = require("bcrypt");
var passport = require('passport');




module.exports = function(app) {
     app.post("/api/users", function(req, res) {
          console.log(req.body);
          var newUser = {
               username: req.body.username,
               firstname: req.body.firstname,
               lastname: req.body.lastname,
               password: req.body.password
          }
          //Hashing the password of the user
          bcrypt.genSalt(10,function(err,salt) {
               bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if (err) {throw err};
                    //Setting password to hash
                    newUser.password = hash;
                    //saving user
                    db.user.create(newUser).then(function(dbUser) {
                         res.json(dbUser);
                    }).catch(err => console.log(err))
               })
          });
          
     })

     app.post("/api/login", function(req,res,next){
          passport.authenticate('local', {
               successRedirect: '/user',
               failureRedirect: '/'
          })(req, res, next)
     });
}