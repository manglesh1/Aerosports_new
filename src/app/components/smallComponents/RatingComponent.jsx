import React, { memo } from "react";
import { FaStar } from "react-icons/fa";

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar color="var(--primary-color)" key={`star-${i}`} />);
  }
  return stars;
};

const RatingComponent = memo(({ ratingdata }) => {
  return (
    <section>
      <section className="aero_rating_wrapper">
        {ratingdata.reviews?.slice(0, 3).map((review, i) => {
          const stars = renderStars(review.rating); 
          return (
            <article key={i} className="aero_rating_card">
              <h4>Rating: &nbsp; {stars}</h4>
              <p>{review.text}  <span className="aero_rating_readmore">...Read More</span></p>
              <h5>{review.author_name}</h5>
             
            </article>
          );
        })}
      </section>
    </section>
  );
});

RatingComponent.displayName = "RatingComponent";

export default RatingComponent;
