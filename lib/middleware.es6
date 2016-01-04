// import passport from "koa-passport";
import bodyParser from "koa-bodyparser";

module.exports = function( app ){
   app.keys = [ "you-have-to-create-your-own-key" ];
   app.use( bodyParser() );
};

// module.exports = ( app )->
//    # session key
//    app.keys       = [ "you-have-to-create-your-own-key" ]
//
//    app
//       .use require("koa-bodyparser")()
//       # TODO: add presistent store
//       # .use require("koa-session")( app )
//       # .use passport.initialize()
//
//       # TODO: add spree passport policy
//       # .use passport.session()
