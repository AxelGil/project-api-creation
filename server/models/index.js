const connection = require("./db");
const UserModel = require("./users")(connection);
const GameModel = require("./game")(connection);

module.exports = {
  db: connection,
  User: UserModel,
  Game: GameModel,
};
