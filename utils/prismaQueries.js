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
};
