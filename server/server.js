require("dotenv").config();
const express = require("express");
//const cors = require("cors");
const i18next = require("i18next");
const bodyParser = require('body-parser');
const UserRouter = require("./routes/users");
const SecurityRouter = require("./routes/security");
const middlewares = require("./middlewares");
const gameRoutes = require("./routes/game");

const app = express();
app.use(express.json());

/*var corsOptions = {
  origin: "http://localhost:4000"
};
app.use(cors(corsOptions));*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//Middleware pour gérer les formats
app.use(middlewares.format())

//Middleware de traduction
app.use(middlewares.negociate_trad(i18next))

//MiddleWare de versionning
const defaultVersion = "v2";
app.use(
  "/api/games",
  middlewares.apiVersions({
    v1: require("./routes/v1/game.js"),
    v2: require("./routes/v2/game.js")
  }, "v2")
);
app.use(
  "/api/security",
  middlewares.apiVersions({
    v1: require("./routes/v1/security.js"),
    v2: require("./routes/v2/security.js")
  }, "v2")
);
app.use(
  "/api/users",
  middlewares.apiVersions({
    v1: require("./routes/v1/users.js"),
    v2: require("./routes/v2/users.js")
  }, "v2")
);

app.use(SecurityRouter);
app.use("/users", UserRouter);
app.use("/api/games", gameRoutes);

app.get('/data', (req, res) => {
  const data = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" }
  ];
  res.render(data);
});

app.listen(process.env.PORT, () =>
  console.log("Server listening on port " + process.env.PORT)
);
