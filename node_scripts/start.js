var fs = require("fs");
var path = require("path");

var rootPaths = require('../config/config.paths.js');
var appModule = require('app-module-path');
rootPaths.forEach(appModule.addPath);

require( "babel-core/register" );

var debug = require("debug")("dev:start.js");
var mongodb = require("mongodb");

var migration = require("./migration");
var connectAttempts = 0;
var maxConnectAttempts = 150;
var connectTimer = null;

function start() {
  connectToDb(function (err) {
    if (err) {
      if (connectAttempts < maxConnectAttempts) {
        connectAttempts++;
        clearTimeout(connectTimer);
        connectTimer = setTimeout(start, 2000);
      } else {
        debug("connect to mongo error: " + err, err.stack);
      }
      return;
    }
    debug("Connected to mongo successfully.");
    migrationsCheck(function(err) {
      if (err) return;
      applyHooks(startDue);
    });
  });
}

function connectToDb(cb) {
  debug("Trying connect to mongo ...");
  mongodb
    .connect(process.env.MONGO_URL)
    .then(function(db) {
      return db.collection('startups').insertOne({ ts: new Date().getTime() });
    })
    .then(function(insertResult) {
      cb();
    })
    .catch(cb);
}

function migrationsCheck(cb) {
  debug( "Check for new migration files ..." );
  migration.check(function (err, unmergedFiles) {
    if (err) {
      debug("Migration check error: " + err, err.stack);
      return cb(err);
    }
    if (unmergedFiles.length) {
      debug("Have new migrations, applying ...");
      return migration.apply(cb);
    } else {
      debug("clean.");
      cb();
    }
  });
}

function applyHooks(cb) {
  debug( "Applying server side hooks ..." );

  var hook = require( "css-modules-require-hook" );
  var stylus = require( "stylus" );

  hook({
    extensions: [".styl"],
    generateScopedName: "[path]-[local]",
    preprocessCss: function( src, filename ){
      return stylus( src )
        .include( require( "nib" ).path )
        .set( "filename", filename )
        .render()
    },
  });

  debug("done.");
  cb();
}

function startDue() {
  debug( "Starting live dev server" );

  var c2k = require( "koa-connect" )
  var koa = require( "koa" )

  var webpack = require( "webpack" )
  var webpackDevMiddleware = require("koa-webpack-dev-middleware" )
  var webpackHotMiddleware = require("koa-webpack-hot-middleware" )

  var configHMR = require( "../config/config.webpack.hmr.js" )
  var compiler = webpack( configHMR )

  var startServer = require( "../lib/server" )

  var app = koa()
  app
    .use( webpackDevMiddleware(
      compiler,
      {
        noInfo: true,
        publicPath: configHMR.output.publicPath,
      })
    )
    .use( webpackHotMiddleware( compiler, { heartbeat: 1000 }) )

  startServer( app )
}

start();
