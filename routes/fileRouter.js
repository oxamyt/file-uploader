const { Router } = require("express");
const fileController = require("../controllers/fileController");
const upload = require("../utils/multerConfig");
const checkAuth = require("../utils/checkAuth");
const { folderValidation, fileValidation } = require("../utils/validators");
const { validate } = require("../utils/validate");

const fileRouter = Router();

fileRouter.get("/", checkAuth, fileController.getFiles);

fileRouter.get("/upload", checkAuth, fileController.getUpload);
fileRouter.post(
  "/upload",
  checkAuth,
  upload.single("file"),
  fileController.postUpload
);

fileRouter.get("/folders", checkAuth, fileController.getFolders);

fileRouter.get("/folders/create", checkAuth, fileController.getFoldersCreate);
fileRouter.post(
  "/folders/create",
  checkAuth,
  folderValidation,
  validate("folderCreate"),
  fileController.postFoldersCreate
);

fileRouter.get(
  "/folders/update/:id",
  checkAuth,
  fileController.getUpdateFolder
);
fileRouter.post(
  "/folders/update/:id",
  checkAuth,
  folderValidation,
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
