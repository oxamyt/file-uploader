async function getHomepage(req, res) {
  res.render("homepage", { user: req.user });
}

module.exports = {
  getHomepage,
};
