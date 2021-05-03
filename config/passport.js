const passport = require('passport')
const Google = require('passport-google-oauth20').Strategy
const Facebook = require('passport-facebook')
const GoogleOauthTokenStrategy = require('passport-google-oauth-token');
const FacebookTokenStrategy = require('passport-facebook-token');


const User  = require('@models/user')
const config = require('@config/config')
const {google, facebook} = require('@config/config').keys


passport.serializeUser((user, done) => {
     done(null, user.id);
});

passport.deserializeUser(( id, done) => {
     User.findById(id).then(user => {
          done(null, user);
     });
});

// Google Strategy
passport.use(
     new Google({
          // options for the google strategy
          clientID: google.clientID,
          clientSecret: google.clientSecret,
          callbackURL: "/api/v1/user/auth/google/return",
     }, (accessToken, refreshToken, profile, done)=>{
          console.log(profile)
            User.findOne({googleId: profile.id}).then((user)=>{
               if(user){
                 //if we already have a record with the given profile ID
                    done(null, user)
               } else{
                    //if not, create a new user 
                   new User({
                     googleId: profile.id,
                     username: profile.displayName,
                     email: profile.emails[0].value,
                     verified: true
                   }).save().then((user) =>{
                         done(null, user);
                   });
               } 
            })
     })
)

passport.use(new GoogleOauthTokenStrategy({
     clientID: google.clientID,
     clientSecret: google.clientSecret,
     profileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, (accessToken, refreshToken, profile, done) => {
     User.findOne({googleId: profile.id}).then(user=>{
          if(user){
            //if we already have a record with the given profile ID
               return done(null, user)
          } else{
               //if not, create a new user 
              new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                verified: true
              }).save().then((savedUser) =>{
                    return done(null, savedUser);
              }).catch(err=>{
                   console.log(err)
                   return done(err, null)
              });
          } 
       })
}));

// Facebook Strategy
passport.use(
     new Facebook({
          // options for the facebook strategy
          clientID: facebook.clientID,
          clientSecret: facebook.clientSecret,
          callbackURL: "/api/v1/user/auth/facebook/return",
          profileFields: ['id', 'emails', 'name', 'photos']
     }, (accessToken, refreshToken, profile, done)=>{
          console.log("Accesstoken", accessToken)
          User.findOne({facebookId: profile.id}).then((currentUser)=>{
               console.log(profile)
               if(currentUser){
                 //if we already have a record with the given profile ID
                    done(null, currentUser)
               } else{
                    //if not, create a new user 
                   new User({
                         facebookId: profile.id,
                         username: profile.displayName || null,
                         email: profile.emails[0].value,
                         verified: true
                     }).save().then((newUser) =>{
                         done(null, newUser);
                   });
                } 
             })
     })
)

passport.use(new FacebookTokenStrategy({
     clientID: facebook.clientID,
     clientSecret: facebook.clientSecret,
     fbGraphVersion: 'v3.0'
   }, function(accessToken, refreshToken, profile, done) {
     User.findOne({facebookId: profile.id}).then((currentUser)=>{
          console.log(profile)
          if(currentUser){
            //if we already have a record with the given profile ID
               return done(null, currentUser)
          } else{
               //if not, create a new user 
              new User({
                    facebookId: profile.id,
                    username: profile.displayName || null,
                    email: profile.emails[0].value,
                    verified: true
                }).save().then((newUser) =>{
                    return done(null, newUser);
              }).catch(err=>{
                    console.log(err)
                    return done(err, null)
               })
           } 
        })
   }
 ));