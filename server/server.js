require("dotenv").config();
const express = require("express");
//const cors = require("cors");
const  i18next = require("./lib/i18n.js");
const bodyParser = require('body-parser');
const UserRouter = require("./routes/users");
const SecurityRouter = require("./routes/security");
const middlewaresformat = require("./middlewares/format.js");
const middlewarestrad = require('./middlewares/negociate_trad.js');
const middlewaresversion = require('./middlewares/mw-apiversion.js');
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
app.use(middlewaresformat())

//Middleware de traduction
app.use(middlewarestrad(i18next))

//MiddleWare de versionning
const defaultVersion = "v2";

app.use(
  "/api/users",
  middlewaresversion({
    v1: require("./routes/v1/users.js"),
    v2: require("./routes/v2/users.js")
  }, defaultVersion)
);

app.use(SecurityRouter);
app.use("/users", UserRouter);
app.use("/api/games", gameRoutes);

app.get('/data', (req, res) => {
  const data = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: res.t('Game not found')}
  ];
  res.render(data);
});

app.listen(process.env.PORT, () =>
  console.log("Server listening on port " + process.env.PORT)
);
