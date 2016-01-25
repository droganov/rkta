var expressSession = require( "express-session" );
var connectStore = require( "connect-mongo" )( expressSession );

var sessionStore = new connectStore({
  url: process.env.MONGO_URL
});

var sessionHandler = expressSession({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  name: "rkta",
  saveUninitialized: true,
  resave: true
});

module.exports = sessionHandler;
