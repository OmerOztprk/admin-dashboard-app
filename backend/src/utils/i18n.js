const i18nData = require("../config/i18n");

class I18n {
  constructor(lang = "EN") {
    this.lang = lang;
  }

  translate(path, lang = this.lang, params = []) {
    try {
      const parts = path.split(".");
      let value = i18nData[lang];
      for (const part of parts) {
        value = value?.[part];
      }

      if (typeof value === "string" && params.length > 0) {
        params.forEach((param) => {
          value = value.replace("{}", param);
        });
      }

      return value || path;
    } catch {
      return path;
    }
  }
}

module.exports = new I18n();
