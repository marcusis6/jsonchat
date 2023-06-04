import { Response, Request } from "express";

interface PageData {
  [key: string]: any;
}

export function renderPageOrRedirect(
  res: Response,
  pageName?: string,
  pageData?: PageData,
  redirectUrl?: string,
  req?: Request
): void {
  const queryParams: string[] = [];

  /*  the following method is not necessary because we are not passing any data to queryParams 
but keeping it here because  it might be useful in future  */

  // for (const key in pageData) {
  //   /*  When iterating over an object's properties in JavaScript, properties inherited
  //    from the object's prototype chain are also included in the loop.
  //    This means that if we simply iterate over the `pageData` object using
  //    a `for...in` loop, we will also get properties that are not "own properties"
  //    of the `pageData` object. To avoid this, we use the `hasOwnProperty()`
  //    method to check if each property is actually an "own property" of
  //    the `pageData` object. We use `Object.prototype.hasOwnProperty.call(pageData, key)`
  //    instead of `pageData.hasOwnProperty(key)` to ensure that we are only checking for
  //   "own properties" and not inherited properties, and to avoid any issues that could
  //   arise from `pageData` being `null`, `undefined`, or having a `null` prototype chain. */

  //   if (Object.prototype.hasOwnProperty.call(pageData, key)) {
  //     const value = pageData[key];
  //     queryParams.push(
  //       `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  //     );
  //   }
  // }

  if (req && req?.query?.lang) {
    queryParams.push(`lang=${encodeURIComponent(String(req?.query.lang))}`);
  }

  if (redirectUrl) {
    let redirectPath = redirectUrl;

    if (queryParams.length > 0) {
      redirectPath += `?${queryParams.join("&")}`;
    }

    res.redirect(redirectPath);
  } else if (pageName) {
    let data = { ...pageData };

    const successMessage = req?.flash("successMessage");
    const errorMessage = req?.flash("errorMessage");

    if (successMessage && successMessage?.length > 0) {
      // add the first element from successMessage to data
      // note: you don't have support for multiple elements as we don't require now
      data = { ...data, successMessage: successMessage[0] };
    }

    if (errorMessage && errorMessage?.length > 0) {
      // add the second element from successMessage to data
      // note: you don't have support for multiple elements as we don't require now
      data = { ...data, errorMessage: errorMessage[0] };
    }

    res.render(pageName, data);
  } else {
    throw new Error("Nothing to render or redirect");
  }
}
