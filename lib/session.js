var session = require( "koa-session-store" );
var mongoStore = require( "koa-session-mongo" );

var sessionStore = mongoStore.create({
  url: process.env.MONGO_URL
});

module.exports = session({
	store: sessionStore,
	name: "rkta",
	cookie: {
		signed: true
	}
});
