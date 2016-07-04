var postcss_vars = require("postcss-simple-vars");
var precss = require( "precss" );
var autoprefixer = require( "autoprefixer" );

module.exports = function () {
  return [
    postcss_vars({
      variables: function () {
        return require("./config.css.js");
      }
    }),
    precss({
      import: { disable: true },
      mixins: { disable: true }
    }),
    autoprefixer()
  ];
}
