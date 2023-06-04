import express, { Request, Response } from "express";
import {
  getUsers,
  addUser,
  removeUser,
  makeUserAdmin,
  makeUserRegular,
  suspendUser,
  unsuspendUser,
} from "../controllers/UserController";
const router = express.Router();

/* router level middleware
 * all routes starting with /api must be loggedin
 */
router.use((req, res, next) => {
  if (req.session?.userInfo?.username) next();
  else res.redirect("/auth/login");
});

/* Index Route */
router.get("/", function (req: Request, res: Response) {
  res.render("index/index", {
    username: req.session?.userInfo?.username,
    title: "home",
  });
});

/* Admin Route */
router.get("/admin", async function (req: Request, res: Response) {
  if (req.session?.userInfo?.isAdmin) {
    await getUsers(req, res);
  } else res.render("forbidden", { title: "forbidden" });
});

/* Users Route */
router.get("/users", getUsers);

router.post("/users", addUser);

router.delete("/users/:id", removeUser);

router.put("/users/:id/make-admin", makeUserAdmin);

router.put("/users/:id/make-user", makeUserRegular);

router.put("/users/:id/suspend", suspendUser);

router.put("/users/:id/unsuspend", unsuspendUser);

export = router;
