const User = require("../domain/models/User");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField : 'email'},(email,password,done)=> {
            email.toLowerCase();
            //match user
            User.findOne({email_address : email})
                .then((user)=>{
                    if(!user) {
                        return done(null,false,{message : 'that email is not registered'});
                    }
                    //match pass
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err) throw err;

                        if(isMatch) {
                            return done(null,user);
                        } else {
                            return done(null,false,{message : 'pass incorrect'});
                        }
                    })
                })
                .catch((err)=> {console.log(err)})
        })

    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    })
}