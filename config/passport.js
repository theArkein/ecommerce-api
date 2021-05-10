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
          console.log(accessToken)
          User.findOne({googleId: profile.id}).then((user)=>{
          if(user){
               //if we already have a record with the given profile ID
               console.log("Already registered")
               return done(null, user)
          } else{
               // check if email alreay exists
               User.findOne({email: profile.emails[0].value}).then(user=>{
                    if(user){
                         let error = {
                              message: "User with this email already exists. Please sigin"
                         }
                         console.log("found")
                         return done(null, {error})
                    } else {
                         //if not, create a new user 
                         new User({
                              googleId: profile.id,
                              profileDetails: {
                                   firstname: profile.name.givenName, 
                                   lastname: profile.name.familyName,
                                   email: profile.emails[0].value,
                                   profilePictureExternal: profile.photos[0].value
                              },
                              email: profile.emails[0].value,
                              accountStatus: 1
                         }).save().then((user) =>{
                              return done(null, user);
                         });
                    }
               })
               
          } 
          })
     })
)

passport.use(new GoogleOauthTokenStrategy({
     clientID: google.clientID,
     clientSecret: google.clientSecret,
     profileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, (accessToken, refreshToken, profile, done) => {
     console.log(profile)
     User.findOne({googleId: profile.id}).then((user)=>{
          if(user){
               //if we already have a record with the given profile ID
               console.log("Already registered")
               return done(null, user)
          } else{
               // check if email alreay exists
               User.findOne({email: profile.emails[0].value}).then(user=>{
                    if(user){
                         let error = {
                              message: "User with this email already exists. Please sigin"
                         }
                         console.log("found")
                         return done(null, {error})
                    } else {
                         //if not, create a new user 
                         new User({
                              googleId: profile.id,
                              profileDetails: {
                                   firstname: profile.name.givenName, 
                                   lastname: profile.name.familyName,
                                   email: profile.emails[0].value,
                                   profilePictureExternal: profile.photos[0].value
                              },
                              email: profile.emails[0].value,
                              accountStatus: 1
                         }).save().then((user) =>{
                              return done(null, user);
                         });
                    }
               })
               
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
                    User.findOne({email: profile.emails[0].value}).then(user=>{
                         if(user){
                              let error = {
                                   message: "User with this email already exists. Please sigin"
                              }
                              console.log("found")
                              return done(null, {error})
                         } else {
                              //if not, create a new user 
                              new User({
                                   facebookId: profile.id,
                                   profileDetails: {
                                        firstname: profile.name.givenName, 
                                        lastname: profile.name.familyName,
                                        email: profile.emails[0].value,
                                        profilePictureExternal: profile.photos[0].value
                                   },
                                   email: profile.emails[0].value,
                                   accountStatus: 1
                              }).save().then((newUser) =>{
                                   done(null, newUser);
                              });
                         }
                    })
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
               done(null, currentUser)
          } else{
               User.findOne({email: profile.emails[0].value}).then(user=>{
                    if(user){
                         let error = {
                              message: "User with this email already exists. Please sigin"
                         }
                         console.log("found")
                         return done(null, {error})
                    } else {
                         //if not, create a new user 
                         new User({
                              facebookId: profile.id,
                              profileDetails: {
                                   firstname: profile.name.givenName, 
                                   lastname: profile.name.familyName,
                                   email: profile.emails[0].value,
                                   profilePictureExternal: profile.photos[0].value
                              },
                              email: profile.emails[0].value,
                              accountStatus: 1
                         }).save().then((newUser) =>{
                              done(null, newUser);
                         });
                    }
               })
           } 
        })
   }
 ));