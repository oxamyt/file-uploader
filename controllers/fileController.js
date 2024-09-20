const { validationResult } = require("express-validator");
const prismaQueries = require("../utils/prismaQueries");
const checkUser = require("../utils/checkUser");

function handleError(res, err) {
  console.error("An error occurred:", err);
  res.status(500).render("error", {
    message: "Something went wrong. Please try again later.",
  });
}

async function getUpload(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const Folders = await prismaQueries.getFoldersByUserId(userId);

    res.render("uploadFile", { folders: Folders, errors: [] });
  } catch (err) {
    handleError(res, err);
  }
}

async function postUpload(req, res) {
  console.log(req.body);
  const { folderId } = req.body;
  const file = req.file;
  const fileUrl = req.file.path;
  if (!file) {
    return res.status(400);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const userId = parseInt(req.user.id);
    const Folders = await prismaQueries.getFoldersByUserId(userId);
    return res.status(400).render("uploadFile", {
      errors: errors.array(),
      folders: Folders,
    });
  }

  try {
    await prismaQueries.createFile({
      name: file.originalname,
      size: file.size,
      url: fileUrl,
      folderId: parseInt(folderId),
    });

    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function getFolders(req, res) {
  try {
    const Folders = await prismaQueries.getFoldersByUserId(req.user.id);
    res.render("folders", { folders: Folders });
  } catch (err) {
    handleError(res, err);
  }
}

async function getFoldersCreate(req, res) {
  try {
    res.render("folderCreate", { user: req.user, errors: [], name: "" });
  } catch (err) {
    handleError(res, err);
  }
}

async function postFoldersCreate(req, res) {
  try {
    await prismaQueries.createFolder({
      name: req.body.name,
      userId: req.user.id,
    });
    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function getUpdateFolder(req, res) {
  const folderId = parseInt(req.params.id);

  const isUser = await checkUser(req.user.id, folderId);

  if (!isUser) {
    return res
      .status(403)
      .send("You do not have permission to access this folder.");
  }

  try {
    const Folder = await prismaQueries.getFolderById(folderId);

    res.render("folderUpdate", { user: req.user, folder: Folder, errors: [] });
  } catch (err) {
    handleError(res, err);
  }
}

async function postUpdateFolder(req, res) {
  const folderId = parseInt(req.params.id);

  try {
    const isUser = await checkUser(req.user.id, folderId);

    if (!isUser) {
      return res
        .status(403)
        .send("You do not have permission to access this folder.");
    }

    await prismaQueries.updateFolder(folderId, { name });

    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function postDeleteFolder(req, res) {
  try {
    const folderId = parseInt(req.params.id);

    const isUser = await checkUser(req.user.id, folderId);

    if (!isUser) {
      return res
        .status(403)
        .send("You do not have permission to access this folder.");
    }

    await prismaQueries.deleteFolderById(folderId);

    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function getFolderFiles(req, res) {
  const folderId = parseInt(req.params.id);

  try {
    const isUser = await checkUser(req.user.id, folderId);

    if (!isUser) {
      return res
        .status(403)
        .send("You do not have permission to access this folder.");
    }

    const Files = await prismaQueries.getFilesByFolderId(folderId);

    const updatedFiles = Files.map((file) => ({
      ...file,
      url: file.url.replace(/upload/, "upload/fl_attachment"),
    }));

    res.render("folderFiles", { files: updatedFiles });
  } catch (err) {
    handleError(res, err);
  }
}

async function postDeleteFile(req, res) {
  try {
    const fileId = parseInt(req.params.id);

    const file = await prismaQueries.getFileById(fileId);

    const folderId = file.folderId;

    const isUser = await checkUser(req.user.id, folderId);

    if (!isUser) {
      return res
        .status(403)
        .send("You do not have permission to access this folder.");
    }

    await prismaQueries.deleteFileById(fileId);

    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function getFiles(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const Files = await prismaQueries.getFilesWithFolderInfo(userId);

    res.render("files", { files: Files });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = {
  getUpload,
  postUpload,
  getFolders,
  getFoldersCreate,
  postFoldersCreate,
  getUpdateFolder,
  postUpdateFolder,
  getFolderFiles,
  postDeleteFolder,
  postDeleteFile,
  getFiles,
};
