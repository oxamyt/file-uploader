const prismaQueries = require("./prismaQueries");

async function checkUser(userId, folderId) {
  return prismaQueries.checkUser(userId, folderId);
}

module.exports = checkUser;
