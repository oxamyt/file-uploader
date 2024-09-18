const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  console.log("hi");
  const { username, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("hi");
    return res.status(400).render("signUp", {
      errors: errors.array(),
      username,
    });
  }

  console.log("hi");
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    res.redirect("/");
  } catch (err) {
    handleError(res, err);
  }
}

async function getLogin(req, res) {
  res.render("login", { user: req.user });
}

async function getLogout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

module.exports = {
  getHomepage,
  getSignUp,
  postSignUp,
  getLogin,
  getLogout,
};
