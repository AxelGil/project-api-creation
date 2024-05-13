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
    game.plateau = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    game.currentPlayer = game.player1Id;
    game.movesCount = 0;
    game.gameState = "inProgress";
    parties[gameId] = game;
    res.json({ message: "Partie réinitialisée avec succès" });
  },

  placeMove: (playerId, row, col) => {
    if (this.gameState !== "inProgress") {
      return "Perdu!";
    }

    if (playerId !== this.currentPlayer) {
      return "Ce n'est pas ton tour!";
    }

    if (this.plateau[row][col] !== null) {
      return "Coup interdit!";
    }

    this.plateau[row][col] = playerId === this.player1Id ? "X" : "O";
    this.movesCount++;

    this.currentPlayer =
      this.currentPlayer === this.player1Id ? this.player2Id : this.player1Id;

    const winner = this.checkWinner();
    if (winner) {
      this.gameState = `Gagnant: ${winner}`;
    } else if (this.movesCount === 9) {
      this.gameState = "Draw";
    }

    const response = {
      message: "Coup effectué",
      board: this.plateau,
    };

    return response;
  },

  checkWinner: () => {
    const winningLines = [
      // Horizontal rows
      [this.plateau[0][0], this.plateau[0][1], this.plateau[0][2]],
      [this.plateau[1][0], this.plateau[1][1], this.plateau[1][2]],
      [this.plateau[2][0], this.plateau[2][1], this.plateau[2][2]],
      // Vertical columns
      [this.plateau[0][0], this.plateau[1][0], this.plateau[2][0]],
      [this.plateau[0][1], this.plateau[1][1], this.plateau[2][1]],
      [this.plateau[0][2], this.plateau[1][2], this.plateau[2][2]],
      // Diagonals
      [this.plateau[0][0], this.plateau[1][1], this.plateau[2][2]],
      [this.plateau[0][2], this.plateau[1][1], this.plateau[2][0]],
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
