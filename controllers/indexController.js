const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const prismaQueries = require("../utils/prismaQueries");
const { v4: uuidv4 } = require("uuid");
const parseDurationToMilliseconds = require("../utils/parseDuration");

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

async function postShareFolder(req, res) {
  const { folderId, duration } = req.body;
  const userId = parseInt(req.user.id);

  try {
    const linkId = uuidv4();

    const expiresAt = new Date(
      Date.now() + parseDurationToMilliseconds(duration)
    );

    await prismaQueries.createSharedFolder({
      folderId: parseInt(folderId),
      userId: userId,
      linkId: linkId,
      expiresAt: expiresAt,
    });

    const shareLink = `${req.protocol}://${req.get("host")}/share/${linkId}`;

    res.render("shareFolderSuccess", { shareLink });
  } catch (err) {
    handleError(res, err);
  }
}

async function getShare(req, res) {
  const linkId = req.params.id;

  try {
    const sharedFolder = await prismaQueries.getSharedFolderByLinkId(linkId);

    if (!sharedFolder) {
      return res.status(404).render("error", {
        message: "This shared folder link does not exist or has expired.",
      });
    }

    if (sharedFolder.expiresAt && sharedFolder.expiresAt < new Date()) {
      return res.status(410).render("error", {
        message: "This shared folder link has expired.",
      });
    }

    const Folder = await prismaQueries.getFolderById(sharedFolder.folderId);

    const Files = await prismaQueries.getFilesByFolderId(sharedFolder.folderId);

    const updatedFiles = Files.map((file) => ({
      ...file,
      url: file.url.replace(/upload/, "upload/fl_attachment"),
    }));

    res.render("sharedFolder", { folder: Folder, files: updatedFiles });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = {
  getHomepage,
  getSignUp,
  postSignUp,
  getLogin,
  getLogout,
  getShareFolder,
  postShareFolder,
  getShare,
};
