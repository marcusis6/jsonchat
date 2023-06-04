import { Request, Response, NextFunction } from "express";

/**
 * Middleware to redirect already authenticated users from the '/api/login' route to the '/api/' route.
 * If the user is already authenticated, the middleware redirects them to the '/api/' route.
 * Otherwise, it calls 'next()' to proceed to the next middleware in the stack.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
export function redirectAuthenticatedUsers(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.session?.userInfo?.username) {
    return res.redirect("/api/");
  }
  next();
}
