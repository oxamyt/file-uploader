const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getFoldersByUserId(userId) {
  return prisma.folder.findMany({ where: { userId } });
}

async function createFile(data) {
  return prisma.file.create({ data });
}

async function createFolder(data) {
  return prisma.folder.create({ data });
}

async function getFolderById(id) {
  return prisma.folder.findUnique({ where: { id } });
}

async function updateFolder(id, data) {
  return prisma.folder.update({ where: { id }, data });
}

async function deleteFolderById(id) {
  return prisma.folder.delete({ where: { id } });
}

async function getFilesByFolderId(folderId) {
  return prisma.file.findMany({ where: { folderId } });
}

async function deleteFileById(id) {
  return prisma.file.delete({ where: { id } });
}

async function getFilesWithFolderInfo(userId) {
  return prisma.file.findMany({
    where: { folder: { userId } },
    include: { folder: true },
  });
}

async function checkUser(userId, folderId) {
  return prisma.folder.findUnique({
    where: {
      id: folderId,
      userId: userId,
    },
  });
}

async function createUser(username, hashedPassword) {
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
}

async function getFileById(id) {
  return prisma.file.findUnique({ where: { id } });
}

async function createSharedFolder(data) {
  return await prisma.sharedFolder.create({
    data,
  });
}

async function getSharedFolderByLinkId(linkId) {
  return prisma.sharedFolder.findUnique({
    where: { linkId },
  });
}

module.exports = {
  getFoldersByUserId,
  createFile,
  createFolder,
  getFolderById,
  updateFolder,
  deleteFolderById,
  getFilesByFolderId,
  deleteFileById,
  getFilesWithFolderInfo,
  createUser,
  checkUser,
  getFileById,
  createSharedFolder,
  getSharedFolderByLinkId,
};
