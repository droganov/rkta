require( "babel-core/register" );

var fs = require("fs");
var path = require("path");
var debug = require("debug")("dev:start.js");

var migration = require("./migration");
var packageHash = require("./packageHash");

debug( "Check for new migration files ..." );

migration.check(function (err, unmergedFiles) {
  if(err) {
    return debug("migration check error: " + err);
  }
  if(unmergedFiles.length) {
    return debug("Have new migrations, you need to apply them. Type 'npm run migration apply'");
  }

  debug( "clean." );
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
  debug( "Check package version ..." );
  try {
    fs.statSync(path.join(__dirname,"../www_root/assets/hmr.dll.js"));
    var dll_stats = require("../build/dll/stats.json");
    var hash = packageHash.compute();
    if(hash !== dll_stats.packageHash) {
      throw("mismatch ...");
    }
    debug( "clean." );
  } catch(e) {
    debug(e.message || e);
    return require("../node_scripts/builddll").then(startDue);
  }
  startDue();
});

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
