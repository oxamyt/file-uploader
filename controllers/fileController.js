const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function handleError(res, err) {
  console.error("An error occurred:", err);
  res.status(500).render("error", {
    message: "Something went wrong. Please try again later.",
  });
}

async function getUpload(req, res) {
  res.render("uploadFile");
}

async function postUpload(req, res) {
  const { file } = req;

  if (!file) {
    return res.status(400);
  }
  try {
    const File = await prisma.file.create({
      data: {
        name: file.originalName,
        size: file.size,
        url: `/uploads/${file.filename}`,
      },
    });
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

module.exports = {
  getUpload,
  postUpload,
};
