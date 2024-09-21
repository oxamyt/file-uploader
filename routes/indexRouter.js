const { Router } = require("express");
const passport = require("../utils/passportConfig");
const indexController = require("../controllers/indexController");
const { validate } = require("../utils/validate");
const { signupValidation, loginValidation } = require("../utils/validators");
const checkAuth = require("../utils/checkAuth");

const indexRouter = Router();

indexRouter.get("/", indexController.getHomepage);

indexRouter.get("/sign-up", indexController.getSignUp);
indexRouter.post(
  "/sign-up",
  signupValidation,
  validate("signUp"),
  indexController.postSignUp
);

indexRouter.get("/login", indexController.getLogin);
indexRouter.post(
  "/login",
  loginValidation,
  validate("login"),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

indexRouter.get("/logout", indexController.getLogout);

indexRouter.get("shareFolder", checkAuth, indexController.getShareFolder);
indexRouter.post("shareFolder", checkAuth, indexController.postShareFolder);

module.exports = indexRouter;
