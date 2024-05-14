const { v4: uuidv4 } = require("uuid");

const DEFAULT_BOARD_STATE = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const parties = {};

module.exports = {
  createGame: (req, res) => {
    let gameId;
    do {
      gameId = uuidv4();
    } while (parties[gameId]);
    const player1Id = uuidv4();
    const player2Id = uuidv4();
    const currentPlayer = player1Id;
    const game = {
      id: gameId,
      player1Id: player1Id,
      player2Id: player2Id,
      currentPlayer: currentPlayer,
      plateau: DEFAULT_BOARD_STATE.map(row => [...row]),
      movesCount: 0,
      gameState: "inProgress",
    };
    parties[gameId] = game;
    res.json({ gameId: gameId, player1Id: player1Id, player2Id: player2Id });
  },
  getGameStatus: (req, res) => {
    const gameId = req.params.gameId;
    if (!parties[gameId]) {
      res.status(404).send("Partie introuvable");
      return;
    }
    const game = parties[gameId];
    res.json({ game: game });
  },
  resetGame: (req, res) => {
    const gameId = req.params.gameId;
    if (!parties[gameId]) {
      res.status(404).send("Partie introuvable");
      return;
    }
    const game = parties[gameId];
    game.plateau = DEFAULT_BOARD_STATE.map(row => [...row]);
    game.currentPlayer = game.player1Id;
    game.movesCount = 0;
    game.gameState = "inProgress";
    parties[gameId] = game;
    res.json({ message: "Partie réinitialisée avec succès" });
  },

  placeMove: (req, res) => {
    const { playerId, row, col } = req.body;
    const gameId = req.params.gameId;
    const game = parties[gameId];

    if (game.gameState !== "inProgress") {
      res.json("Perdu!");
      return;
    }

    if (playerId !== game.currentPlayer) {
      res.json("Ce n'est pas ton tour!");
      return;
    }

    if (game.plateau[row][col] !== null) {
      res.json("Coup interdit!");
      return;
    }

    game.plateau[row][col] = playerId === game.player1Id ? "X" : "O";
    game.movesCount++;

    game.currentPlayer =
      game.currentPlayer === game.player1Id ? game.player2Id : game.player1Id;
    
    
      const response = {
      message: "Coup effectué",
      board: game.plateau,
    };


    const winner = module.exports.checkWinner(game);
    if (winner) {
      game.gameState = `Gagnant: ${winner}`;
      response.message = response.message + ` Gagnant: ${winner}`;
    } else if (game.movesCount === 9) {
      game.gameState = "Draw";
    }
    
    res.json(response);
  },

  checkWinner: (game) => {
    const winningLines = [
      // Horizontal rows
      [game.plateau[0][0], game.plateau[0][1], game.plateau[0][2]],
      [game.plateau[1][0], game.plateau[1][1], game.plateau[1][2]],
      [game.plateau[2][0], game.plateau[2][1], game.plateau[2][2]],
      // Vertical columns
      [game.plateau[0][0], game.plateau[1][0], game.plateau[2][0]],
      [game.plateau[0][1], game.plateau[1][1], game.plateau[2][1]],
      [game.plateau[0][2], game.plateau[1][2], game.plateau[2][2]],
      // Diagonals
      [game.plateau[0][0], game.plateau[1][1], game.plateau[2][2]],
      [game.plateau[0][2], game.plateau[1][1], game.plateau[2][0]],
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
