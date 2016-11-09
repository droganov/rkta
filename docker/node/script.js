var fs = require("fs");
var configPath = "/app/package.json";

var config = JSON.parse(fs.readFileSync(configPath).toString());

delete config.devDependencies.gulp;
delete config.devDependencies["gulp-postmortem"];
delete config.devDependencies.yargs;

fs.writeFileSync(configPath, JSON.stringify(config));
