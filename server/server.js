require("dotenv").config();
const express = require("express");
const UserRouter = require("./routes/users");
const SecurityRouter = require("./routes/security");
const checkAuth = require("./middlewares/checkAuth");
const gameRoutes = require("./routes/game");

const app = express();
app.use(express.json());

app.use(SecurityRouter);
app.use("/users", UserRouter);
app.use("/api/games", gameRoutes);

app.listen(process.env.PORT, () =>
  console.log("Server listening on port " + process.env.PORT)
);
