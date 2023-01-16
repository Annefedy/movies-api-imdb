const express = require("express");
const router = express.Router();
const Review = require("../../models/Review.js");


//obter todas as críticas para o filme
router.get("/:movieId/", async (req, res) => {
  const movieId = req.params.movieId;
  const movieReviews = await Review.query()
    .where("movie_id", movieId)
    .withGraphFetched("user");
  return res.json(movieReviews);
});

//obter todas as avaliações do usuário 
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send({ response: "you need to log in" });
  }

  const { id } = req.session.user;
  const reviews = await Review.query().where({ user_id: id });

  return res.json(reviews);
});

//verificar se o usuário tem avaliação
router.get("/hasreview/:movieId/", async (req, res) => {
  const movieId = req.params.movieId;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }

  if (movieId) {
    const hasReview = await Review.query()
      .where({
        user_id: req.session.user.id,
        movie_id: movieId,
      })
      .limit(1);

    if (!hasReview[0]) {
      return res.status(404).send({ response: "Nenhuma avaliação ainda" });
    } else {
      return res.json(hasReview);
    }
  } else {
    return res.status(404).send({ response: "Sem id do filme" });
  }
});

//postar nova avaliação
router.post("/", async (req, res) => {
  const { title, rating, content, movie_id } = req.body;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }

  if (movie_id) {
    if (!title || !rating || !content) {
      return res.status(400).send({ response: "Campos ausentes" });
    }

    if (title.length > 100 || content.length > 280) {
      return res.status(400).send({ response: "O título ou a avaliação são muito longos" });
    }

    try {
      const existingReview = await Review.query()
        .where({
          user_id: req.session.user.id,
          movie_id: movie_id,
        })
        .limit(1);

      if (!existingReview[0]) {
        const newReview = await Review.query().insert({
          rating,
          title,
          content,
          user_id: req.session.user.id,
          movie_id,
        }).withGraphFetched("user");

        return res.send({ response: "Avaliação postada", review: newReview });
      } else {
        return res
          .status(404)
          .send({ response: "Você já tem um comentário para este filme" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ response: "Algo deu errado com o banco de dados" });
    }
  } else {
    res.status(404).send({ response: "Sem id do filme" });
  }
});

//Revisão de atualização
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { rating, title, content } = req.body;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }

  if (!title || !rating || !content) {
    return res.status(400).send({ response: "Campos ausentes" });
  }

  if (title.length > 100 || content.length > 280) {
    return res.status(400).send({ response: "O título ou a avaliação são muito longos" });
  }

  try {
    const existingReview = await Review.query().where({ id }).limit(1);
    if (!existingReview[0]) {
      return res
        .status(404)
        .send({ response: "comentário com este id não existe" });
    } else {
      const review = await Review.query().findById(id).patch({
        id,
        rating,
        title,
        content,
      });
      return res.json(review);
    }
  } catch (error) {
    return res.status(500).send({ response: "não foi possível atualizar o comentário" });
  }
});

//excluir comentário
router.delete("/:id", async (req, res) => {
  const reviewId = req.params.id;

  if (!req.session.user) {
    return res.status(403).send({ response: "você precisa fazer login" });
  }

  try {
    const reviewToDelete = await Review.query().deleteById(reviewId);
    return res.send({
      response: "comentário excluído com sucesso",
      review: reviewToDelete,
    });
  } catch (error) {
    return res.status(500).send({ response: "não foi possível excluir o comentário" });
  }
});

module.exports = router;