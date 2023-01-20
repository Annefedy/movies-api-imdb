import React, { useEffect, useState } from "react";
import "./ReviewForm.css";

export default function ReviewForm({ movieId, reviews, setReviews }) {
  const [reviewId, setReviewId] = useState();
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(3);
  const [content, setContent] = useState("");
  const [hasReview, setHasReview] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  function handleUserHasReview() {
    fetch("http://localhost:7070/api/review/hasreview/" + movieId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setHasReview(true);
          return res.json();
        } else {
          setHasReview(false);
        }
      })
      .then((data) => {
        if (data) {
          data = data[0];
          setReviewId(data.id);
          setTitle(data.title);
          setRating(data.rating);
          setContent(data.content);
        } else {
          setTitle("");
          setRating(3);
          setContent("");
        }
      });
  }

  function handleUpdateReview() {
    fetch("http://localhost:7070/api/review/" + reviewId, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        rating,
        content,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setHasReview(true);
          const index = reviews.findIndex((review) => review.id === reviewId);
          const newReviews = [...reviews];
          newReviews[index].title = title;
          newReviews[index].rating = rating;
          newReviews[index].content = content;
          setReviews(newReviews);
          setSuccessMessage("A avaliação foi atualizada");
          setError("");
          setTimeout(() => {
            setSuccessMessage("");
          }, 2000);
        } else {
          throw res;
        }
      })
      .catch((error) => {
        error.json().then((body) => {
          setError(body.response);
        });
      });
  }

  function handleDeleteReview() {
    fetch("http://localhost:7070/api/review/" + reviewId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setHasReview(false);
        const index = reviews.findIndex((review) => review.id === reviewId);
        const newReviews = [...reviews];
        newReviews.splice(index, 1);
        setReviews(newReviews);
      }
    });
  }

  function submitReview() {
    fetch("http://localhost:7070/api/review/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        rating,
        content,
        movie_id: movieId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setHasReview(true);
          setError("");
          return res.json();
        } else {
          throw res;
        }
      })
      .then((data) => {
        data.review.created_at = new Date();
        let newReviews = [...reviews];
        newReviews.unshift(data.review);
        setReviews(newReviews);
      })
      .catch((error) => {
        error.json().then((body) => {
          setError(body.response);
        });
      });
  }

  useEffect(() => {
    handleUserHasReview();
  }, [movieId, hasReview]);

  return (
    <div className="ReviewForm">
      <div className="review-container">
        <form>
          <label>Avaliação</label>
          <div>
            <input
              className="review-range"
              type="range"
              name="rating"
              min="1"
              max="4"
              value={rating}
              className="range"
              onChange={(e) => setRating(e.target.value)}
            />
            <span>{rating} stars</span>
          </div>
          <label>Título</label>
          <input
            type="text"
            name="title"
            placeholder="título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Conteúdo</label>
          <textarea
            type="text"
            name="content"
            placeholder="Conteúdo"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {hasReview ? (
            <>
              {successMessage ? (
                <p className="success">{successMessage}</p>
              ) : (
                  ""
                )}
              {error ? <p className="error-dark">{error}</p> : ""}
              <div className="review-buttons">
                <button type="button" onClick={handleUpdateReview}>
                  Atualizar
                </button>
                <button type="button" onClick={handleDeleteReview}>
                  Deletar
                </button>
              </div>
            </>
          ) : (
              <button type="button" onClick={submitReview}>
                Publicar
              </button>
            )}
        </form>
      </div>
    </div>
  );
}
