var express = require('express');  
var app = express();

var passport =  require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var GOOGLE_CLIENT_ID      = "74866510249-4kt0qqbem6oavq03omrb90sg1t278dbe.apps.googleusercontent.com"
  , GOOGLE_CLIENT_SECRET  = "rAB4qvD2USheyiBC49xxJYI7";


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({  
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/oauth2callback'
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

function ensureAuthenticated(req, res, next) {  
    if (req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
}

passport.serializeUser(function(user, done) {  
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {  
    db.findUserById(id, function(err, user) {
        done(err, user);
    });
});

app.get('/auth/google', passport.authenticate('google',  
    { scope: ['https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'] }),
    function(req, res){} // this never gets called
);

/*
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
  */
app.get('/oauth2callback', passport.authenticate('google',  
    { successRedirect: '/api', failureRedirect: '/login' }
));

app.get('/api',  
    ensureAuthenticated,
    function(req, res) {
        res.json({ message: 'Hooray! welcome to our api!' });
    }
); 

app.get('/', function (req, res) {  
  res.send('Welcome!')
});

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

