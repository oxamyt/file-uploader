const { Router } = require("express");
const passport = require("../utils/passportConfig");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.getHomepage);

module.exports = indexRouter;
