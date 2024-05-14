const { Model, DataTypes } = require("sequelize");

module.exports = function GameModelGenerator(connection) {
  class Game extends Model {}

  Game.init(
    {
      id: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      player1Id: {type: DataTypes.STRING, required: true},
      player2Id: {type: DataTypes.STRING, required: true},
      currentPlayer: {type: DataTypes.STRING, required: true},
      board: {type: DataTypes.JSON, required: true},
      movesCount: {type: DataTypes.INTEGER, required: true},
      gameState: {type: DataTypes.STRING, required: true},
    },
    {
      sequelize: connection,
    }
  );

  return Game;
}