var path = require("path");
const root = process.cwd();
const language = require(`${root}/language/`);

var langData = {};
for (var key in language) {
  if (language.hasOwnProperty(key)) {
    var mod = require(path.join(`${root}/language/`, language[key]));
    if (mod instanceof Function) {
      language[key][mod.name] = mod;
    } else {
      Object.keys(mod).forEach(function (property) {
        language[key][property] = mod.property;
      });
      langData[key] = mod;
    }
  }
}

function translate(line, lang = "default") {
  return langData[lang][line];
}

module.exports.translate = translate;
