import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

import type { Product as ProductType } from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { addToCart } from "../utils/cart";

import CartNotification, {
  type CartNotificationProduct,
} from "../components/CartNotification";

import "../styles/Product.css";

export default function Product() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] =
    useState<CartNotificationProduct | null>(null);

  const from = (location.state as { from?: string } | null)?.from;
  const backPath = from === "/limited" ? "/limited" : "/catalog";

  useEffect(() => {
    getProducts()
      .then((products) => {
        const foundProduct = products.find(
          (item) => item.id === Number(id)
        );

        if (!foundProduct) {
          setError("Product not found.");
          return;
        }

        setProduct(foundProduct);
      })
      .catch(() => {
        setError("Unable to load product. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);

    setNotification({
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  };

  if (loading) {
    return <main className="product-page">Loading...</main>;
  }

  if (error || !product) {
    return (
      <main className="product-page">
        <p>{error || "Product not found."}</p>
        <Link to="/catalog">BACK TO CATALOG</Link>
      </main>
    );
  }

  return (
    <main className="product-page">
      <nav className="product-navigation">
        <Link to={backPath} className="product-back-link">
          ← BACK TO CATALOG
        </Link>

        <Link
          to="/reviews"
          state={{ productId: product.id }}
          className="product-reviews-link"
        >
          REVIEWS →
        </Link>
      </nav>

      <section className="product-main">
        <div className="product-gallery">
          <div className="product-main-image">
            {product.images.length > 0 && (
              <img src={product.images[0]} alt={product.name} />
            )}
          </div>

          <button className="product-gallery-button" type="button">
            IMAGE GALLERY
          </button>

          <div className="product-additional-images">
            {product.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} view ${index + 2}`}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>

          <p className="product-price">
            {product.price.toLocaleString("en-US")} €
          </p>

          {product.isLimited && (
            <span className="product-limited-label">
              LIMITED EDITION
            </span>
          )}

          <p className="product-description">
            Product description will be displayed here.
          </p>

          <button
            className="product-add-button"
            type="button"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
        </div>
      </section>

      <CartNotification
        product={notification}
        onClose={() => setNotification(null)}
        onCheckout={() => navigate("/checkout")}
        onViewCart={() => navigate("/cart")}
        onContinueShopping={() => setNotification(null)}
      />
    </main>
  );
}