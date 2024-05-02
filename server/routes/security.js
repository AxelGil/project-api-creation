const { Router } = require("express");
const SecurityController = require("../controllers/security");
const router = new Router();

// Collection route : GET : list users
router.post("/login", /* middlewares */ SecurityController.login);

module.exports = router;
