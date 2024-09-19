const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function handleError(res, err) {
  console.error("An error occurred:", err);
  res.status(500).render("error", {
    message: "Something went wrong. Please try again later.",
  });
}

async function getUpload(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const Folders = await prisma.folder.findMany({
      where: {
        userId: userId,
      },
    });

    res.render("uploadFile", { folders: Folders });
  } catch (err) {
    handleError(res, err);
  }
}

async function postUpload(req, res) {
  const { folderId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400);
  }
  try {
    const File = await prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        url: `/uploads/${file.filename}`,
        folderId: parseInt(folderId),
      },
    });
    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function getFolders(req, res) {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: req.user.id,
      },
    });
    res.render("folders", { folders: folders });
  } catch (err) {
    handleError(res, err);
  }
}

async function getFoldersCreate(req, res) {
  try {
    res.render("folderCreate", { user: req.user });
  } catch (err) {
    handleError(res, err);
  }
}

async function postFoldersCreate(req, res) {
  try {
    const { name } = req.body;

    const Folder = await prisma.folder.create({
      data: {
        name: name,
        userId: req.user.id,
      },
    });
    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function getUpdateFolder(req, res) {
  const folderId = parseInt(req.params.id);

  try {
    const Folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    res.render("folderUpdate", { user: req.user, folder: Folder });
  } catch (err) {
    handleError(res, err);
  }
}

async function postUpdateFolder(req, res) {
  const { name } = req.body;

  const folderId = parseInt(req.params.id);

  try {
    const Folder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: name,
      },
    });

    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function postDeleteFolder(req, res) {
  try {
    const folderId = parseInt(req.params.id);

    const DeleteFolder = await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });

    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function getFolderFiles(req, res) {
  const folderId = parseInt(req.params.id);

  try {
    const Files = await prisma.file.findMany({
      where: {
        folderId: folderId,
      },
    });

    res.render("folderFiles", { files: Files });
  } catch (err) {
    handleError(res, err);
  }
}

async function postDeleteFile(req, res) {
  try {
    const fileId = parseInt(req.params.id);

    const DeleteFile = await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    res.redirect("/files/folders");
  } catch (err) {
    handleError(res, err);
  }
}

async function getFiles(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const Files = await prisma.file.findMany({
      where: {
        folder: {
          userId: userId,
        },
      },
      include: {
        folder: true,
      },
    });

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
