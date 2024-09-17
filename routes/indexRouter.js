const { Router } = require("express");
const passport = require("../utils/passportConfig");
const indexController = require("../controllers/indexController");
const { validate } = require("../utils/validate");
const { signupValidation } = require("../utils/validators");

const indexRouter = Router();

indexRouter.get("/", indexController.getHomepage);

indexRouter.get("/sign-up", indexController.getSignUp);
indexRouter.post(
  "/sign-up",
  signupValidation,
  validate,
  indexController.postSignUp
);

indexRouter.get("/login", indexController.getLogin);
indexRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = indexRouter;
