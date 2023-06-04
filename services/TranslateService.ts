import { LangFile } from "../interfaces/LangFile";
import logger from "../config/logger";
const log = logger(__filename);

/*
IMPORTANT: This getTranslation method only supports up to two layers. 
Any language file with more than two layers will not work.

Here are examples of how to define translations for different layers:

1 layer:
----------

"select_language": "Select Language",

two layer:
----------

"user": {
  "register": "Register",
},

Usage:
------

To access a translation from a single-layer, use the key directly. For example:

  select_language

To access a translation from a multi-layer, specify the key as a nested object, 
separated by a dot for each layer. For example:

  user.register
*/

const langFiles: Record<string, LangFile> = {};
const langFilesArray = ["en", "bn"]; // You can add more languages here
for (const lang of langFilesArray) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const langFile = require(`../lang/${lang}.json`);
  langFiles[lang] = langFile;
  log.info("{} file loaded", lang);
}

const getTranslation = (key: string, lang = "en"): string => {
  const langFile = langFiles[lang];
  if (!langFile) {
    throw new Error(`Language not found: ${lang}`);
  }

  const keys = key.split(".");
  let translation: any = langFile;

  for (let i = 0; i < keys.length; i++) {
    const subKey = keys[i];
    translation = translation[subKey];
    if (translation === undefined) {
      log.debug(`Translation not found for key "${key}" in language "${lang}"`);
      return key;
    }
  }

  if (typeof translation !== "string") {
    log.debug(
      `Translation for key "${key}" in language "${lang}" is not a string`
    );
    return key;
  }

  return translation;
};

export { getTranslation };
