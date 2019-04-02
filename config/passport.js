const LocalStrategy = require("passport-local").Strategy;
var db = require("../models");
var bcrypt = require("bcrypt");

module.exports = function(passport) {
     passport.use( new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
               //Match user
               db.user.findOne({username: username}).then(function(user) {
                    console.log("You are in match user");
                    if(!user){
                         return done(null, false, {message: "that username is not registered"}); 
                    };
                    //Match password
                    bcrypt.compare(password, user.password, function(err, isMatch) {
                         if  (err) throw err;

                         if (isMatch) {
                              return done(null, user)
                         } else {
                              return done(null, false, {message: "password incorrect"}); 
                         }
                    })

               }).catch(err => console.log(err))
          })); //End of our strategy

     passport.serializeUser(function(user, done) {
          done(null, user.id);
     });

     passport.deserializeUser(function(id, done) {
          db.user.findOne({where: {id: id}}).then(function(err, user) {
               done(err, user);
          });
     });


}// End of our exports function