const { body } = require("express-validator");

exports.signupValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters"),
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

exports.loginValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.folderValidation = [
  body("name")
    .notEmpty()
    .withMessage("Folder name is required.")
    .isLength({ max: 50 })
    .withMessage("Folder must be less than 50 characters"),
];
