import express, { Request, Response } from "express";
import * as authController from "../controllers/AuthController";
import * as userController from "../controllers/UserController";
import { redirectAuthenticatedUsers } from "../middleware/redirectAuthenticatedUsers";
import { renderPageOrRedirect } from "../utils/ejsHelpers";

const router = express.Router();

router.get(
  "/register",
  redirectAuthenticatedUsers,
  (req: Request, res: Response) => {
    res.render("register", { title: "user.register" });
  }
);

router.post("/register", redirectAuthenticatedUsers, userController.addUser);

router.get(
  "/login",
  redirectAuthenticatedUsers,
  (req: Request, res: Response) => {
    const pageData = { title: "user.login" };
    renderPageOrRedirect(res, "login", pageData, undefined, req);
  }
);

router.post("/login", redirectAuthenticatedUsers, authController.login);

router.post("/logout", authController.logout);

export = router;
