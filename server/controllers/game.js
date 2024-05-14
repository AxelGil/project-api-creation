const { v4: uuidv4 } = require("uuid");

const DEFAULT_BOARD_STATE = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const parties = {};

module.exports = {
  post: (req, res) => {
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
      board: DEFAULT_BOARD_STATE.map(row => [...row]),
      movesCount: 0,
      gameState: "inProgress",
    };
    parties[gameId] = game;
    res.status(201).json({ gameId: gameId, player1Id: player1Id, player2Id: player2Id });
  },
  iget: (req, res) => {
    const gameId = req.params.gameId;
    if (!parties[gameId]) {
      res.status(404).send("Partie introuvable");
      return;
    }
    const game = parties[gameId];
    res.status(200).json(game);
  },
  patch: (req, res) => {
    const gameId = req.params.gameId;
    if (!parties[gameId]) {
      res.status(404).send("Partie introuvable");
      return;
    }
    const game = parties[gameId];
    game.board = DEFAULT_BOARD_STATE.map(row => [...row]);
    game.currentPlayer = game.player1Id;
    game.movesCount = 0;
    game.gameState = "inProgress";
    parties[gameId] = game;
    res.status(200).json({ message: "Partie réinitialisée avec succès" });
  },

  placeMove: (req, res) => {
    const { playerId, row, col } = req.body;
    const gameId = req.params.gameId;
    if (!parties[gameId]) {
      res.status(404).send("Partie introuvable");
      return;
    }
    const game = parties[gameId];

    if (game.gameState !== "inProgress") {
      res.status(409).json({ message: "Game is not in progress" });
      return;
    }

    if (playerId !== game.currentPlayer) {
      res.status(400).json({ message: "It's not your turn" });
      return;
    }

    if (game.board[row][col] !== null) {
      res.status(400).json({ message: "Invalid move" });
      return;
    }

    game.board[row][col] = playerId === game.player1Id ? "X" : "O";
    game.movesCount++;

    game.currentPlayer =
      game.currentPlayer === game.player1Id ? game.player2Id : game.player1Id;
    
    
      const response = {
      message: "Coup effectué",
      board: game.board,
    };


    const winner = module.exports.checkWinner(game);
    if (winner) {
      game.gameState = `Gagnant: ${winner}`;
      response.message = response.message + ` Gagnant: ${winner}`;
    } else if (game.movesCount === 9) {
      game.gameState = "Draw";
    }

    res.status(200).json(response);
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
