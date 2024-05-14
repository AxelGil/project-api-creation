const router = require("express").Router();
const gameController = require("../controllers/game");
const hateoasMiddleware = require("../middlewares/hateoasMiddleware");

const gameMovesHateoas = {
  placeMove: {
    method: "PATCH",
    path: "/:gameId/moves",
  },
  reset: {
    method: "PATCH",
    path: "/:gameId",
  },
};

router.post("",  gameController.post);
router.get("/:gameId", hateoasMiddleware(gameMovesHateoas), gameController.iget);
router.patch("/:gameId", gameController.patch);
router.patch('/:gameId/moves', gameController.placeMove);

module.exports = router;
