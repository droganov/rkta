var mongodb = require("mongodb");
var fs = require("fs");
var path = require("path");
var debug = require("debug")("dev:migration.js");
var Migration = require('mongration').Migration;

var config = require("../config/config.migrations");
var isProduction = process.env.NODE_ENV == "production";

module.exports = {
  check: check
}

function newId(name) {
  var now = new Date();
  var uname = [now.getTime(), Math.ceil(Math.random()*100000)];
  if(name && name.length) uname.push(name.replace(/\s+/g,"-"));
  return uname.join("-");
}

function getExtentionRegExp() {
  return new RegExp("\\."+config.extention+"$","g");
}

function getListAllFiles() {
  // считывание всех миграций, отфильтровывание шаблона
  return fs.readdirSync(config.directory).filter(function (fileName) {
    return fileName.search(getExtentionRegExp()) > -1;
  });
}

function check(cb) {
  var chain = Promise.resolve();
  var trackCollection = null;
  var unmergedFiles = [];
  var cbCalled = false;

  var localListAllFiles = getListAllFiles();

  chain = chain.then(function () {
    return mongodb.connect(config.mongoUri);
  }).then(function (db) {
    trackCollection = db.collection(config.migrationCollection);
  });
  localListAllFiles.forEach(function (fileName) {
    chain = chain.then(function () {
      return trackCollection.findOne({ id: fileName.replace(getExtentionRegExp(), "") })
    }).then(function (result) {
      if(!result) unmergedFiles.push(fileName);
    });
  });
  chain.then(function () {
    trackCollection.s.db.close();
    if(!cbCalled) cb(null, unmergedFiles);
    cbCalled = true;
  }).catch(function (err) {
    if(cbCalled) {
      console.log(err);
      return;
    }
    cb(err);
  });
}

// для вызова через require обработка комманд не нужна
if(module.parent) return;

// обработка комманд из npm run migration commandName [migrationName]
var migrator = new Migration(config);

var args = process.argv.slice(2);
var commandName = args[0];
var migrationName = args[1];

var listAllFiles = getListAllFiles();

switch (commandName) {
  case "create":
    if(isProduction) {
      return debug("В режиме production создавать новые миграции нельзя.");
    }
    var id = newId(migrationName);
    try{
      var template = fs.readFileSync(path.join(config.directory, "template"), 'utf8');
      template = template.replace(/\${id}/g, id);
      fs.writeFileSync(path.join(config.directory, id+"."+config.extention), template);
    }catch(e) {
      return debug(e);
    }
    debug("Миграция создана");
    break;
  case "apply":
    // для режима production применение миграций через пароль
    if(isProduction && migrationName !== config.productionPass) {
      return debug("В режиме production нужно указать пароль для применения миграций.");
    };
    // добавление миграций в список
    migrator.add(listAllFiles.map(function (fileName) {
      return path.join(config.directory, fileName);
    }));
    // запуск зарегистрированных миграций
    migrator.migrate(function (err, result) {
      if(err) {
        return debug(err);
      }
      debug("Миграции применены успешно.");
    });
    break;
  case "check":
    check(function (err, unmergedFiles) {
      if(err) {
        return debug(err);
      }
      if(unmergedFiles.length) {
        return debug("Есть новые миграции - " + unmergedFiles.join(", "));
      }
      debug("Новых миграций нет");
    });
    break;
  default:
    finish("Неизвестная команда - "+commandName+"\n\n"+
      "Команды:\n"+
        "\tcreate 'migrationName' - создает новую миграцию\n"+
        "\tapply [password] - применяет существующие миграции, password нужен для применения в режиме production\n"+
        "\tcheck - проверка наличия новых миграций\n"+
        "\n");
    return;
}
