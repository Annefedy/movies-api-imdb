const express = require("express");
const router = express.Router();
const MovieLike = require("../../models/MovieLike");

// verificar se o usuário gostou do filme
router.get("/isLiked/:movieId", async (req, res) => {
  const movieId = req.params.movieId;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }

  if (movieId) {
    try {
    const likedMovie = await MovieLike.query()
      .where({
        movie_id: movieId,
        user_id: req.session.user.id
      })
      .limit(1);

      if (!likedMovie[0]) {
        return res.status(404).send({ response: "Não gostei" });
      } else {
        return res.json({ response: "Liked", id: likedMovie[0].id });
      }
    } catch(error) {
        return res
        .status(500)
        .send({ response: "Algo deu errado com o banco de dados" });
    }
  } else {
    return res.status(404).send({ response: "Sem id do filme" });
  }
});

// obter todos os filmes curtidos de um usuário
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }
  
  try {
    const userLikedList = await MovieLike.query().where({
      user_id: req.session.user.id
    });
    return res.json(userLikedList);
  } catch (error) {
      return res
        .status(500)
        .send({ response: "Algo deu errado com o banco de dados" });
  }
});

// postar nova curtida
router.post("/", async (req, res) => {
  const { movie_id } = req.body;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }

  if (movie_id) {
    try {
      const isMovieLiked = await MovieLike.query()
        .where({
          movie_id: movie_id,
          user_id: req.session.user.id,
        })
        .limit(1);
      if (!isMovieLiked[0]) {
        const newLike = await MovieLike.query().insert({
          movie_id,
          user_id: req.session.user.id,
        });
        return res.json(newLike);
      } else {
        return res
          .status(400)
          .send({ response: "Você já gostou deste filme" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ response: "Algo deu errado com o banco de dados" });
    }
  } else {
    return res.status(400).send({ response: "Nenhum ID fornecido" });
  }
});

// Diferente de um filme
router.delete("/:id", async (req, res) => {
  const likeId = req.params.id;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }
  
  if (likeId) {
    try {
      await MovieLike.query().deleteById(likeId);
      return res.send({ response: "filme desvinculado com sucesso" });
    } catch (error) {
      return res.status(500).send({ response: "não poderia deixar de gostar do filme" });
    }
  } else {
    return res.status(404).send({ response: "Nenhum id fornecido" });
  }
});

module.exports = router;