"use strict"

var fs       = require("fs");
var path     = require("path");
var touch    = require("touch");
const gulp = require( "gulp" );
const babel = require( "gulp-babel" );
const gutil = require( "gulp-util" );
const nodemon = require( "gulp-nodemon" );
const webpack = require( "webpack" );
var runSequence    = require( "run-sequence" );
const webpackConfig = require( "./config/config.webpack" );

const paths = {
  webpack: [
    "*.jsx",
    "*.es6",
    "*.styl",
    "app/**",
    "com/**"
  ],
  envjson: [
    "app/**/*.env.json"
  ],
  stats: "build/stats.json"
}

// make release bundle
gulp.task( "release", (cb)=>{
  webpack( webpackConfig( true ), ( err, stats ) => {
    if( err ){
      throw( new gutil.PluginError( "release", err ) );
    }
    cb();
  });
});

// clean hot load patches
gulp.task( "clean", (cb)=> {
  var cfg = webpackConfig();
  fs.readdir(cfg.output.path, (err, list)=>{
    var flist = list.filter((f)=> f.search(/\.hot-update\./i)>-1 );
    flist.forEach((f)=>{
        var filepath = cfg.output.path+"/"+f;
        fs.unlink(filepath, (err)=>{
        if(err) console.log(filepath,":",err);
      });
    });
    cb();
  });
});

// watch stats file
var releaseTimer = null,
    cleanTimer = null,
    stylusTimer = null,
    lastHash = null;
gulp.task( "watch", ()=> {
  gulp.watch(paths.stats, ()=>{
    var stats = JSON.parse(fs.readFileSync(paths.stats).toString());

    if(lastHash!==stats.hash) {
      lastHash = stats.hash;

      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(()=>{ runSequence("release"); },30000);

      clearTimeout(cleanTimer);
      cleanTimer = setTimeout(()=>{ runSequence("clean"); },5000);
    }
  });

  // костыль для зависимости *.env.json -> style.styl
  gulp.watch(paths.envjson, (data)=>{
    clearTimeout(stylusTimer);
    stylusTimer = setTimeout(()=>{
      touch.sync(path.dirname(data.path)+"/style.styl", {
        force: true,
        nocreate: true
      });
    },1500);
  });

});

// running dev server
gulp.task( "serve", ()=> {
  // http://stackoverflow.com/questions/29217978/gulp-to-watch-when-node-app-listen-is-invoked-or-to-port-livereload-nodejs-a
  nodemon({
    script: "lib/server.js",
    ext: "jsx js es6",
    args: [ "--harmony", "--debug-break", "--trace_opt", "--trace_deopt", "--allow-natives-syntax" ],
    env: {
      "NODE_ENV": "development",
    },
    ignore: [ "app/*", "com/*", "build/*", "test/*", "www_root/" ],
    stdout: "false",
    // tasks: [ "clean" ]
  })
    .on( "restart", ()=> console.log("restarting dev server...") )
    .on( "start", () => console.log("starting dev server...") )
    .on( "readable", data => console.log("readable") );
});

gulp.task( "default", [ "watch", "serve" ] );
