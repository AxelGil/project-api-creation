const { v4: uuidv4 } = require("uuid");
const { Game } = require("../models");

const DEFAULT_BOARD_STATE = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

module.exports = {
  post: async (req, res, next) => {
    try {
      const gameId = uuidv4();
      const player1Id = uuidv4();
      const player2Id = uuidv4();
      const currentPlayer = player1Id;
      const game = await Game.create({
        id: gameId,
        player1Id: player1Id,
        player2Id: player2Id,
        currentPlayer: currentPlayer,
        board: DEFAULT_BOARD_STATE.map(row => [...row]),
        movesCount: 0,
        gameState: "inProgress",
      });
      
      res.status(201).json(game);
    } catch (error) {
      next(error);
    }
  },
  iget: async (req, res, next) => {
    const gameId = req.params.gameId;
    const game = await Game.findByPk(gameId);

    if (game) res.status(200).json(game);
    else res.sendStatus(404);
  },
  patch: async (req, res, next) => {
    try {
      if (req.body.board === null) {
        req.body.board = DEFAULT_BOARD_STATE.map(row => [...row]);
      }
      const [updated] = await Game.update(req.body, {
        where: { id: req.params.gameId },
      });
  
      if (updated) {
        const updatedGame = await Game.findByPk(req.params.gameId);
        return res.status(200).json(updatedGame);
      } else {
        return res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  },

  placeMove: async (req, res, next) => {
    const { playerId, row, col } = req.body;
    const game = await Game.findByPk(req.params.gameId);

    if (!game) {
      return res.status(404).json({ message: res.render(res.t("Game not found")) });
    }

    if (game.gameState !== "inProgress") {
      res.status(409).json({ message: res.render(res.t("Game is not in progress")) });
      return;
    }

    if (playerId !== game.currentPlayer) {
      res.status(403).json({ message: res.render(res.t("It's not your turn")) });
      return;
    }

    if (game.board[row][col] !== null) {
      res.status(400).json({ message: res.render(res.t("Invalid move")) });
      return;
    }

    game.board[row][col] = playerId === game.player1Id ? "X" : "O";
    game.movesCount++;

    game.currentPlayer =
      game.currentPlayer === game.player1Id ? game.player2Id : game.player1Id;

    const winner = module.exports.checkWinner(game);
    if (winner) {
      game.gameState = `Gagnant: ${winner}`;
    } else if (game.movesCount === 9) {
      game.gameState = "Draw";
    }

    const [updated] = await Game.update(
      { board: game.board, 
        currentPlayer: game.currentPlayer, 
        movesCount: game.movesCount, 
        gameState: game.gameState
      }
    ,{
      where: { id: game.id },
    });

    if (updated) {
      const updatedGame = await Game.findByPk(game.id);
      res.status(200).json(updatedGame);
    } else {
      res.sendStatus(404);
    }
  },

  checkWinner: (game) => {
    const winningLines = [
      // Horizontal rows
      [game.board[0][0], game.board[0][1], game.board[0][2]],
      [game.board[1][0], game.board[1][1], game.board[1][2]],
      [game.board[2][0], game.board[2][1], game.board[2][2]],
      // Vertical columns
      [game.board[0][0], game.board[1][0], game.board[2][0]],
      [game.board[0][1], game.board[1][1], game.board[2][1]],
      [game.board[0][2], game.board[1][2], game.board[2][2]],
      // Diagonals
      [game.board[0][0], game.board[1][1], game.board[2][2]],
      [game.board[0][2], game.board[1][1], game.board[2][0]],
    ];

    for (const line of winningLines) {
      const allSame = line.every((cell) => cell !== null && cell === line[0]);
      if (allSame) {
        return line[0];
      }
    }

    return null;
  },
};
