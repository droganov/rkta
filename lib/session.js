var koaSession = require( "koa-generic-session" );
// var redisStore = require( "koa-redis" );
var MongoStore = require( "koa-generic-session-mongo" );

var expressSession = require( "express-session" );
var connectStore = require( "connect-mongo" )( expressSession );



var koaHandler = koaSession({
   store: new MongoStore({
      url: process.env.MONGO_URL
   })
})

var sessionStore = new connectStore({
   url: process.env.MONGO_URL
});
var expressHandler = expressSession({
   secret: process.env.SESSION_SECRET,
   store: sessionStore,
   cookie: process.env.SESSION_COOKIE,
   saveUninitialized: true,
   resave: true
});

module.exports = {
   express: expressHandler,
   koa: koaHandler
};
