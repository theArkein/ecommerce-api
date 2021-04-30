const passport = require('passport')
const Google = require('passport-google-oauth20').Strategy
const Facebook = require('passport-facebook')
// const Local = require('passport-local')
const jwt = require('jsonwebtoken')


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
          callbackURL: "/api/v1/user/auth/google/return"
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

// Facebook Strategy
passport.use(
     new Facebook({
          // options for the facebook strategy
          clientID: facebook.clientID,
          clientSecret: facebook.clientSecret,
          callbackURL: "/api/v1/user/auth/facebook/return",
          profileFields: ['id', 'emails', 'name', 'photos']
     }, (accessToken, refreshToken, profile, done)=>{
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