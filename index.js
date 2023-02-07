const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

app.use(sassMiddleware({
    src : './assets/scss/',
    dest : './assets/css',
    debug : true,
    outputStyle : 'extentended',
    prefix : '/css'
}))

app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use(express.static('./assets'));


app.use(session({
    name : 'codial',
    // TODO change the secret before deployment in production mode 
    secret : 'blahsomething',
    saveUninitialized : true, 
    resave : false,
    cookie : {
        maxAge : (1000 * 60 * 100)
    },
    store : MongoStore.create(
        {
            mongoUrl : 'mongodb://127.0.0.1:27017/codial_development',
        autoRemove : 'disabled'
     },
     function(err){
        if(err){
            console.log(err || 'connect-mongodb setup ok');
        }
     }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');





app.listen(port, (err) => {
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port: ${port}`)
    
})