const express = require("express");
const router = express.Router();
const WatchLink = require("../../models/WatchLink.js");

// verifique se o usuário tem um filme na lista de observação
router.get("/hasWatchLink/:movieId", async (req, res) => {
  const movieId = req.params.movieId;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }

  if (movieId) {
    try {
      const watchListedMovie = await WatchLink.query()
        .where({
          movie_id: movieId,
          user_id: req.session.user.id,
        })
        .limit(1);

      if (!watchListedMovie[0]) {
        return res.status(404).send({ response: "O filme não está na lista de observação" });
      } else {
        return res.json({ response: "O filme está na lista de observação", id: watchListedMovie[0].id });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ response: "Algo deu errado com o banco de dados" });
    }
  }
});

// obter todos os filmes na lista de observação do usuário da sessão
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }
  
  try {
    const userWatchList = await WatchLink.query().where({
      user_id: req.session.user.id
    })
    return res.json(userWatchList);
  } catch (error) {
    return res
      .status(500)
      .send({ response: "Algo deu errado com o banco de dados" });
  }
});

// adicionar novo filme à lista de observação
router.post("/", async (req, res) => {
  const { movie_id } = req.body;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }

  if (movie_id) {
    try {
      const existingWatchLink = await WatchLink.query()
        .where({
          movie_id: movie_id,
          user_id: req.session.user.id,
        })
        .limit(1);
      if (!existingWatchLink[0]) {
        const newWatchLink = await WatchLink.query().insert({
          user_id: req.session.user.id,
          movie_id: movie_id,
        });
        return res.json(newWatchLink);
      } else {
        return res
          .status(404)
          .send({ response: "Você já tem o filme na lista de observação" });
      }
    } catch (error) {
      return res.status(500).send({
        response: "Algo deu errado com o banco de dados"
      });
    }
  } else {
    return res.status(404).send({ response: "Nenhum ID de filme fornecido" });
  }
});

// remover filme da lista de observação
router.delete("/:id", async (req, res) => {
  watchLinkId = req.params.id;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }

  if (watchLinkId) {
    try {
      await WatchLink.query().deleteById(watchLinkId);
      return res.status(200).send({ response: "excluído com sucesso" });
    } catch (error) {
      return res.status(500).send({ response: "não foi possível excluir" });
    }
  } else {
    return res.status(404).send({ response: "nenhum id fornecido" });
  }
});


module.exports = router;