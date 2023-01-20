import React, { useEffect, useState } from "react";
import ReviewCard from "../ReviewCard/ReviewCard";
import ReviewForm from "../ReviewForm/ReviewForm";
import "./Review.css";

export default function Review({ isAuthenticated, movie }) {
  const [reviews, setReviews] = useState([]);

  function getAllReviews() {
    fetch("http://localhost:7070/api/review/" + movie.id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setReviews(data);
      });
  }

  useEffect(() => {
    getAllReviews();
  }, [movie]);

  return (
    <div className="reviews">
      {isAuthenticated && (
        <>
          <h2>Postar comentários</h2>
          <ReviewForm
            movieId={movie.id}
            reviews={reviews}
            setReviews={setReviews}
          />
        </>
      )}

      <h2>Comentários {reviews.length ? "(" + reviews.length + ")" : ""}</h2>
      
      {reviews && (
        <div className="review-list">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {!reviews.length && (
        <p className="no-review">Não há comentários ainda!</p>
      )}
    </div>
  );
}
