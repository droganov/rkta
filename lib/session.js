var koaSession = require( "koa-generic-session" );
// var redisStore = require( "koa-redis" );
var MongoStore = require( "koa-generic-session-mongo" );

var expressSession = require( "express-session" );
var connectStore = require( "connect-mongo" )( expressSession );

function koaHandler( app ){
   app.keys = [process.env.SESSION_KEY1,process.env.SESSION_KEY2];
   app.use(
      koaSession({
         store: new MongoStore({
            url: process.env.MONGO_URL
         })
      })
   );
}

function expressHandler(){
   var sessionStore = new connectStore({
      url: process.env.MONGO_URL
   });
   return expressSession({
      secret: process.env.SESSION_KEY1,
      store: sessionStore,
      name: "rkta",
      saveUninitialized: true,
      resave: true
   });
}

module.exports = {
   express: expressHandler,
   koa: koaHandler
};
