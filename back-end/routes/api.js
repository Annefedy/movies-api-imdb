const express = require("express");
const app = express();

//Requer arquivos do roteador
const usersRoutes = require("./api/users");
const reviewRoutes = require("./api/review");
const watchLinkRoutes = require("./api/watchlink");
const likeRoutes = require("./api/like");

// Incluir as rotas para expressar
app.use("/users", usersRoutes);
app.use("/review", reviewRoutes);
app.use("/watch", watchLinkRoutes);
app.use("/liked", likeRoutes);

module.exports = app;