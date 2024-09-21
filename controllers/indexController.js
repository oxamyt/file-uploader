const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const prismaQueries = require("../utils/prismaQueries");

function handleError(res, err) {
  console.error("An error occurred:", err);
  res.status(500).render("error", {
    message: "Something went wrong. Please try again later.",
  });
}

async function getHomepage(req, res) {
  res.render("homepage", { user: req.user });
}

async function getSignUp(req, res) {
  res.render("signUp", {
    errors: [],
    username: "",
  });
}

async function postSignUp(req, res) {
  const { username, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("signUp", {
      errors: errors.array(),
      username,
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prismaQueries.createUser(username, hashedPassword);

    res.redirect("/");
  } catch (err) {
    handleError(res, err);
  }
}

async function getLogin(req, res) {
  res.render("login", { user: req.user, errors: [] });
}

async function getLogout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

async function getShareFolder(req, res) {
  const userId = parseInt(req.user.id);

  const Folders = await prismaQueries.getFoldersByUserId(userId);

  res.render("shareFolder", { user: req.user, folders: Folders });
}

module.exports = {
  getHomepage,
  getSignUp,
  postSignUp,
  getLogin,
  getLogout,
  getShareFolder,
};
