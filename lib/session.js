var koaSession = require( "koa-generic-session" );
// var redisStore = require( "koa-redis" );
var MongoStore = require( "koa-generic-session-mongo" );

var expressSession = require( "express-session" );
var connectStore = require( "connect-mongo" )( expressSession );

function koaHandler( app ){
   app.keys = process.env.SESSION_KEYS;
   app.use(
      koaSession({
         store: new MongoStore({
            url: process.env.MONGO_URL
         })
      })
   );
}

function expressHandler(){
   console.log( "expressHandler" );
   var sessionStore = new connectStore({
      url: process.env.MONGO_URL
   });
   return expressSession({
      secret: process.env.SESSION_KEYS[0],
      store: sessionStore,
      cookie: process.env.SESSION_KEYS[1],
      saveUninitialized: true,
      resave: true
   });
}

module.exports = {
   express: expressHandler,
   koa: koaHandler
};
