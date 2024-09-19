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
fileRouter.post("/folders/create", checkAuth, fileController.postFoldersCreate);

fileRouter.get(
  "/folders/update/:id",
  checkAuth,
  fileController.getUpdateFolder
);
fileRouter.post(
  "/folders/update/:id",
  checkAuth,
  fileController.postUpdateFolder
);

fileRouter.get("/folders/:id", checkAuth, fileController.getFolderFiles);

fileRouter.post(
  "/folders/delete/:id",
  checkAuth,
  fileController.postDeleteFolder
);

fileRouter.post("/delete/:id", checkAuth, fileController.postDeleteFile);

module.exports = fileRouter;
