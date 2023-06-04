import { Request, Response, NextFunction } from "express";
import { setSession } from "../controllers/AuthController";
import { UserDto } from "../dtos/UserDto";
import { getTranslation } from "../services/TranslateService";
import { setLangPreference } from "../services/UserCrudService";
import logger from "../config/logger";
const log = logger(__filename);

/**
 * Middleware function to set the translation for each request.
 * The translation is determined by the `lang` query parameter, or defaults to English.
 * The `getTranslation` is added to `res.locals` to provide localized strings in the EJS views.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the chain.
 * @returns {void}
 */
export async function setTranslateFuncToResponse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // // Check if the URL starts with allowed paths
  // const allowedPaths = ["/auth/login", "/auth/register", "/api", "/admin"];

  // if (allowedPaths.some((path) => req.originalUrl.startsWith(path))) {
  //   // Allowed to proceed
  // } else {
  //   // Set default language and translation function
  //   res.locals.lang = "en"; // This is needed for the language selector
  //   res.locals.getTranslation = getTranslation;
  //   return next();
  // }

  const selectedLang: string = req?.query?.lang as string; // lang pref from frontend
  const username: string | undefined = req.session?.userInfo?.username; // need t know if user is logged in
  const userExistingLangPref: string | undefined =
    req.session?.userInfo?.lang_pref; // need to know logged in user lang pref

  // anonymous user (user is not logged in)
  // if no selectedLanguage && anonymous user then -> set default lang
  if (selectedLang == undefined && username == undefined) {
    // log.info("deafult");
    res.locals.lang = "en"; // this is needed for lang selector
    res.locals.getTranslation = (key: string) => {
      return getTranslation(key);
    };
    return next();
  }

  // anonymous user (user is not logged in)
  // if selectedLanguage but anonymous user  then -> set selected lang
  if (selectedLang && !username) {
    // log.info(
    //   "if selectedLanguage but anonymous user  then -> set selected lang"
    // );
    res.locals.lang = selectedLang; // this is needed for lang selector
    res.locals.getTranslation = (key: string) => {
      return getTranslation(key, selectedLang);
    };
    return next();
  }

  // if logged in user and no selected lang then -> set his own lang pref
  if (username && !selectedLang) {
    // log.info(
    //   "if logged in user and no selected lang then -> set his own lang pref"
    // );
    res.locals.lang = userExistingLangPref; // this is needed for lang selector
    res.locals.getTranslation = (key: string) => {
      return getTranslation(key, userExistingLangPref);
    };
    return next();
  }

  // if logged in user && selected lang is different
  // then -> save to storage, set session
  if (username && selectedLang !== userExistingLangPref) {
    // log.info("if logged in user && selected lang is different");
    // set the lang to storage
    const assertLangPrefSetToUser: boolean = await setLangPreference(
      username,
      selectedLang
    );
    // if successful the set to session
    if (assertLangPrefSetToUser) {
      await setLangToSession(req, selectedLang);
      // set lang & translation to locals
      res.locals.lang = selectedLang;
      res.locals.getTranslation = (key: string) => {
        return getTranslation(key, selectedLang);
      };
      return next();
    }
    // else return default lang, log the error
    else {
      // log
      log.error("set lang to storage failed for $%s", username);
      // set the existing lang
      res.locals.lang = userExistingLangPref;

      res.locals.getTranslation = (key: string) => {
        return getTranslation(key, userExistingLangPref);
      };
      return next();
    }
  }

  // if logged in user && selected lang is same as user langPref
  // then -> return with user langPref/selected lang
  if (username && selectedLang === userExistingLangPref) {
    // log.info(
    //   "if logged in user && selected lang is same as user langPref then -> return with user langPref/selected lang"
    // );
    res.locals.lang = userExistingLangPref;
    res.locals.getTranslation = (key: string) => {
      return getTranslation(key, userExistingLangPref);
    };
    return next();
  }

  // no condition met so return the default
  res.locals.getTranslation = (key: string) => {
    // log.info("no condition met so return the default");
    return getTranslation(key);
  };
  return next();
}

async function setLangToSession(req: Request, selectedLang: string) {
  const user = new UserDto(req.session?.userInfo);
  user.lang_pref = selectedLang;
  // set the lang to session
  await setSession(req, user);
  log.info("set lang to session done");
}
