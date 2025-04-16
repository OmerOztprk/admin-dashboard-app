const i18nData = require("../config/i18n");

class I18n {
  constructor(lang = "EN") {
    this.lang = lang;
  }

  translate(text, lang = this.lang, params = []) {
    const parts = text.split(".");
    let val = i18nData[lang]?.[parts[0]];

    for (let i = 1; i < parts.length; i++) {
      val = val?.[parts[i]];
    }

    if (typeof val === "string") {
      for (let i = 0; i < params.length; i++) {
        val = val.replace("{}", params[i]);
      }
    }

    return val || text;
  }
}

module.exports = new I18n();
