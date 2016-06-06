require('./config.server.js');
var path = require("path");

module.exports = {
  mongoUri: process.env.MONGO_URL,
  migrationCollection: 'migration_track',
  directory: path.join(__dirname,"/../backend/migration"),
  extention: "js",
  productionPass: process.env.MIGRATE_PASS || "hudenbrtpo"
}
