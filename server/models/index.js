const connection = require("./db");
const UserModel = require("./users")(connection);

module.exports = {
  db: connection,
  User: UserModel,
};
