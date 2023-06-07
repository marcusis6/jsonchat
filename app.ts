import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import session from "express-session";
import authRouter from "./routes/auth";
import router from "./routes/router";
import { setTranslateFuncToResponse } from "./middleware/setTranslateFuncToResponse";
import { SessionUser } from "./dtos/UserDto";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const expressLayouts = require("express-ejs-layouts");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const flash = require("connect-flash");

require("./config/logger");

// initialize storage repository and insert dummy admin user( with super admin role)
require("./config/initData");

const app = express();

const sessionMiddleware = session({
  // It holds the secret key for session
  secret: "My_T00P-Secr@t",
  // Forces the session to be saved to the session store
  resave: true,
  // Forces a session that is "uninitialized" to be saved to the store
  saveUninitialized: true,
  // cookie
  cookie: { maxAge: 3 * (1000 * 60 * 60) }, // three hour in mili-seconds.
});

// Session Setup
app.use(sessionMiddleware);

app.use(setTranslateFuncToResponse);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Serve static files from the "node_modules" directory
app.use("/node_modules", express.static("node_modules"));

// ***************** List of routes starts ***********************

// Mount auth router at /auth
app.use("/auth", authRouter);

// Mount API router at /api
app.use("/api", router);

// Redirect root path to /api
app.get("/", (req, res) => {
  res.redirect("/api");
});

// Catch-all route for unmatched routes
app.use((req, res) => {
  res.status(403).render("notFound", { title: "client_error.error" });
});

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export { app, sessionMiddleware };
