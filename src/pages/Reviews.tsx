import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Product as ProductType } from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCurrentUser } from "../utils/auth";
import "../styles/Reviews.css";

type Review = {
  id: string;
  productId: number;
  productName: string;
  userName: string;
  rating: number | null;
  text: string;
  date: string;
};

const REVIEWS_KEY = "yoju_reviews";

function getSavedReviews(): Review[] {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function Reviews() {
  const location = useLocation();
  const currentUser = getCurrentUser();

  const initialProductId = (
    location.state as { productId?: number } | null
  )?.productId;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | "">(
    initialProductId ?? ""
  );
  const [reviews, setReviews] = useState<Review[]>(getSavedReviews());
  const [rating, setRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);

        if (initialProductId && data.some((item) => item.id === initialProductId)) {
          setSelectedProductId(initialProductId);
        } else if (data.length > 0) {
          setSelectedProductId(data[0].id);
        }
      })
      .catch(() => setError("Unable to load products. Please try again later."))
      .finally(() => setLoading(false));
  }, [initialProductId]);

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId
  );

  const productReviews = useMemo(() => {
    if (!selectedProduct) return [];

    return reviews.filter(
      (review) => review.productId === selectedProduct.id
    );
  }, [reviews, selectedProduct]);

  const ratedReviews = productReviews.filter(
    (review) => review.rating !== null
  );

  const averageRating =
    ratedReviews.length > 0
      ? ratedReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        ratedReviews.length
      : 0;

  const visibleReviews = useMemo(() => {
    let result = [...productReviews];

    if (filterRating !== "all") {
      result = result.filter(
        (review) => review.rating === Number(filterRating)
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      if (sortOrder === "highest") {
        return (b.rating || 0) - (a.rating || 0);
      }

      if (sortOrder === "lowest") {
        return (a.rating || 0) - (b.rating || 0);
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [productReviews, filterRating, sortOrder]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");

    if (!currentUser) {
      setError("Please sign in to write a review.");
      return;
    }

    if (!selectedProduct) {
      setError("Please select a product.");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please enter your review.");
      return;
    }

    // DEMO ONLY:
    // Replace this temporary permission with verified purchase checking
    // when the order system is implemented.
    const alreadyReviewed = reviews.some(
      (review) =>
        review.productId === selectedProduct.id &&
        review.userName === currentUser.name
    );

    if (alreadyReviewed) {
      setError("You have already reviewed this product.");
      return;
    }

    const newReview: Review = {
      id: crypto.randomUUID(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      userName: currentUser.name,
      rating,
      text: reviewText.trim(),
      date: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];

    setReviews(updatedReviews);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));

    setReviewText("");
    setRating(null);
    setError("");
    setSuccessMessage("Your review has been added.");
  };

  if (loading) {
    return <main className="reviews-page">Loading...</main>;
  }

  if (error && products.length === 0) {
    return (
      <main className="reviews-page">
        <p className="reviews-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="reviews-page">
      <div className="reviews-container">
        <h1 className="reviews-heading">REVIEWS</h1>

        <div className="reviews-layout">
          <section className="reviews-list-section">
            <div className="reviews-list-header">
              <div>
                <h2>CUSTOMER REVIEWS</h2>
                <p className="reviews-subtitle">
                  Opinions and experiences from our customers
                </p>
              </div>

              <div className="reviews-summary">
                <span className="reviews-average">
                  {ratedReviews.length > 0 ? averageRating.toFixed(1) : "—"}
                </span>

                <div>
                  <div className="reviews-summary-stars">
                    {ratedReviews.length > 0
                      ? "★".repeat(Math.round(averageRating)) +
                        "☆".repeat(5 - Math.round(averageRating))
                      : "☆☆☆☆☆"}
                  </div>
                  <span>
                    {productReviews.length}{" "}
                    {productReviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            </div>

            <div className="reviews-controls">
              <label>
                <span>RATING</span>
                <select
                  value={filterRating}
                  onChange={(event) => setFilterRating(event.target.value)}
                >
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </label>

              <label>
                <span>SORT BY</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="highest">Highest rating</option>
                  <option value="lowest">Lowest rating</option>
                </select>
              </label>
            </div>

            <div className="reviews-list">
              {visibleReviews.length > 0 ? (
                visibleReviews.map((review) => (
                  <article className="review-card" key={review.id}>
                    <div className="review-card-header">
                      <div>
                        <h3>{review.userName}</h3>
                        <span className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      {review.rating !== null && (
                        <span className="review-rating">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      )}
                    </div>

                    <p className="review-text">{review.text}</p>
                    <span className="review-product-name">
                      {review.productName}
                    </span>
                  </article>
                ))
              ) : (
                <div className="reviews-empty">
                  <h3>NO REVIEWS YET</h3>
                  <p>
                    Be the first to share your experience with this guitar.
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="reviews-sidebar">
            <section className="reviews-product">
              <h2>PRODUCT INFORMATION</h2>

              <label className="reviews-product-select">
                <span>SELECT PRODUCT</span>
                <select
                  value={selectedProductId}
                  onChange={(event) =>
                    setSelectedProductId(
                      event.target.value ? Number(event.target.value) : ""
                    )
                  }
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>

              {selectedProduct && (
                <div className="reviews-product-details">
                  {selectedProduct.images?.[0] && (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                    />
                  )}

                  <h3>{selectedProduct.name}</h3>
                  <p>
                    {typeof selectedProduct.price === "number"
                      ? `$${selectedProduct.price.toLocaleString()}`
                      : selectedProduct.price}
                  </p>

                  <Link
                    to={`/product/${selectedProduct.id}`}
                    className="reviews-product-link"
                  >
                    VIEW PRODUCT
                  </Link>
                </div>
              )}
            </section>

            <section className="reviews-form-section">
              <h2>WRITE A REVIEW</h2>

              {!currentUser ? (
                <div className="reviews-login-message">
                  <p>You need to sign in to leave a review.</p>
                  <Link to="/login">SIGN IN</Link>
                </div>
              ) : (
                <form className="reviews-form" onSubmit={handleSubmit}>
                  <label className="reviews-rating-label">
                    RATING <span>(OPTIONAL)</span>
                  </label>

                  <div className="reviews-rating-picker">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        type="button"
                        key={value}
                        className={value <= (rating || 0) ? "active" : ""}
                        onClick={() =>
                          setRating(rating === value ? null : value)
                        }
                        aria-label={`Rate ${value} out of 5`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <label htmlFor="review-text">YOUR REVIEW</label>
                  <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    placeholder="Share your experience with this guitar..."
                    rows={6}
                    required
                  />

                  <p className="reviews-demo-notice">
                    Demo mode: purchase verification is not connected yet.
                  </p>

                  {error && <p className="reviews-error">{error}</p>}
                  {successMessage && (
                    <p className="reviews-success">{successMessage}</p>
                  )}

                  <button
                    type="submit"
                    className="reviews-submit-button"
                    disabled={!selectedProduct}
                  >
                    SUBMIT REVIEW
                  </button>
                </form>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}