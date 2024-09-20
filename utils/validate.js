const { validationResult } = require("express-validator");

exports.validate = (view = "signUp") => {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render(view, {
        errors: errors.array(),
        ...req.body,
      });
    }
    next();
  };
};
