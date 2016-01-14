"use strict"

const gulp = require( "gulp" );
const babel = require( "gulp-babel" );
const gutil = require( "gulp-util" );
const nodemon = require( "gulp-nodemon" );
const uglify  = require( "gulp-uglify" );
const webpack = require( "webpack" );
const webpackConfig = require( "./config/config.webpack" );

const paths = {
   webpack: [
      "*.jsx",
      "*.es6",
      "*.styl",
      "app/**",
      "com/**",
   ],
}

gulp.task( "webpack", cb => {
   webpack( webpackConfig( false ), ( err, stats ) => {

      let jsonStats = stats.toJson();

      if(jsonStats.errors.length > 0) {
         console.log(jsonStats.errors[0]);
      };

      if( err ){
         throw( new gutil.PluginError( "webpack", err ) );
      }
      cb()
   });
});

// compressing js
gulp.task( "uglify", [ "webpack" ], ()=>{
   gulp
      .src( "www_root/_assets/*.js" )
      .pipe( uglify() )
      .pipe( gulp.dest("www_root/assets") );
});


// watching file changes
gulp.task( "watch", ()=> {
   gulp.watch( paths.webpack, [ "uglify" ]);
});


// running dev server
gulp.task( "serve", ()=> {
   // todo: live reload
   // http://stackoverflow.com/questions/29217978/gulp-to-watch-when-node-app-listen-is-invoked-or-to-port-livereload-nodejs-a
   nodemon({
      script: "lib/server.js",
      ext: "es6",
      args: [ "--harmony", "--debug-break", "--trace_opt", "--trace_deopt", "--allow-natives-syntax" ],
      env: {
         "NODE_ENV": "development",
      },
      ignore: [ "www_root/*" ],
      stdout: "false",
      tasks: [ "webpack" ],
   })
      .on( "restart", () => console.log("restarting dev server...") )
      .on( "start", () => console.log("starting dev server...") )
      .on( "readable", data => console.log("readable") );
});


gulp.task( "default", [ "serve", "watch", "uglify" ] );
