const { Router } = require("express");
const fileController = require("../controllers/fileController");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "../uploads/") });

const fileRouter = Router();

fileRouter.get("/upload", fileController.getUpload);
fileRouter.post("/upload", upload.single("file"), fileController.postUpload);
