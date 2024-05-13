const router = require("express").Router();
const gameController = require("../controllers/game");

router.post("/create", gameController.createGame);
router.get("/:gameId", gameController.getGameStatus);
router.put("/:gameId/reset", gameController.resetGame);
router.post('/:gameId/moves', gameController.placeMove);

module.exports = router;
