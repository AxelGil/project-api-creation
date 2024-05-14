const router = require("express").Router();
const gameController = require("../controllers/game");

router.post("", gameController.post);
router.get("/:gameId", gameController.iget);
router.patch("/:gameId", gameController.patch);
router.post('/:gameId/moves', gameController.placeMove);

module.exports = router;
