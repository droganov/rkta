var fs = require("fs");
var path = require("path");
var crypto = require('crypto');

module.exports = exports = {
  compute: function () {
    var  packageContent = fs.readFileSync(path.join(__dirname,"../package.json"),"utf-8");
    var md5sum = crypto.createHash('md5');
    md5sum.update(packageContent);
    return md5sum.digest('hex');
  },
  write: function (jsonFilePath) {
    var jsonValue = require(jsonFilePath);
    jsonValue.packageHash = exports.compute();
    fs.writeFileSync(path.resolve(jsonFilePath),JSON.stringify(jsonValue,null,"\t"));
  }
}
