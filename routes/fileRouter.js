const { Router } = require("express");
const fileController = require("../controllers/fileController");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "../uploads/") });
const checkAuth = require("../utils/checkAuth");

const fileRouter = Router();

fileRouter.get("/upload", checkAuth, fileController.getUpload);
fileRouter.post(
  "/upload",
  checkAuth,
  upload.single("file"),
  fileController.postUpload
);

fileRouter.get("/folders", checkAuth, fileController.getFolders);

fileRouter.get("/folders/create", checkAuth, fileController.getFoldersCreate);
fileRouter.get("/foldesr/create", checkAuth, fileController.postFoldersCreate);

module.exports = fileRouter;
