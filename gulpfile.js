"use strict"

var fs       = require("fs");
const gulp = require( "gulp" );
const babel = require( "gulp-babel" );
const gutil = require( "gulp-util" );
const nodemon = require( "gulp-nodemon" );
const uglify  = require( "gulp-uglify" );
const webpack = require( "webpack" );
var runSequence    = require( "run-sequence" );
const webpackConfig = require( "./config/config.webpack" );

const paths = {
   webpack: [
      "*.jsx",
      "*.es6",
      "**.styl",
      "com/**",
      "app/**"
   ],
}

var hashHistory = [];
function webpackFn (pro, cb) {
   webpack( webpackConfig( pro ), ( err, stats ) => {
      if( err ){
         throw( new gutil.PluginError( "webpack", err ) );
      }

      if(!pro) {
         hashHistory.unshift(stats.hash);
         hashHistory = hashHistory.slice(0,2);
         console.log(hashHistory);
      }

      cb(err);
   });
}

gulp.task( "webpack", (cb)=> webpackFn(false, cb) );

// compressing js
gulp.task( "release", (cb)=>{
   webpackFn(true, (err)=> {
      gulp
         .src( "www_root/assets/*.js" )
         .pipe( uglify() )
         .pipe( gulp.dest("www_root/assets") );
   });
   cb();
});

// watching file changes
gulp.task( "watch", ()=> {
   gulp.watch(paths.webpack,(e)=>{
      setTimeout(()=>{
         var hl = hashHistory.length;
         runSequence("webpack", ()=> {
            if(hl<2||hashHistory[0]!==hashHistory[1]) {
               runSequence("release");
            }
         });
      },5000);
   });
});


// running dev server
gulp.task( "serve", ()=> {
   // todo: live reload
   // http://stackoverflow.com/questions/29217978/gulp-to-watch-when-node-app-listen-is-invoked-or-to-port-livereload-nodejs-a
   nodemon({
      script: "lib/server.js",
      ext: "jsx es6 styl",
      args: [ "--harmony", "--debug-break", "--trace_opt", "--trace_deopt", "--allow-natives-syntax" ],
      env: {
         "NODE_ENV": "development",
      },
      ignore: [ "app/*", "com/*", "www_root/*" ],
      stdout: "false",
      // tasks: [ "webpack" ],
   })
      .on( "restart", () => console.log("restarting dev server...") )
      .on( "start", () => console.log("starting dev server...") )
      .on( "readable", data => console.log("readable") );
});


gulp.task( "default", [ "serve", "webpack", "watch" ] );
