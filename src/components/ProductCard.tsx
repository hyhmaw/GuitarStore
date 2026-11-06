
import { useState } from "react";
import type { TouchEvent } from "react";
import "../styles/ProductCard.css";

export type Product = {
  id: number;
  name: string;
  price: number;
  images: string[];
  isLimited: boolean;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { name, price, images } = product;
  const [activeImage, setActiveImage] = useState(0);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    e.currentTarget.dataset.startX = String(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (images.length < 2) return;

    const startX = Number(e.currentTarget.dataset.startX);
    const endX = e.changedTouches[0].clientX;
    const difference = startX - endX;

    if (Math.abs(difference) < 40) return;

    setActiveImage((prev) =>
      difference > 0
        ? (prev + 1) % images.length
        : (prev - 1 + images.length) % images.length
    );
  };

  const handleMouseEnter = () => {
    if (images.length > 1) setActiveImage(1);
  };

  const handleMouseLeave = () => {
    setActiveImage(0);
  };

  return (
    <article className="product-card">
      <div
        className="product-card-image"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 && (
          <img
            src={images[activeImage]}
            alt={name}
            draggable="false"
          />
        )}

        {images.length > 1 && (
          <div className="product-card-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={activeImage === index ? "active" : ""}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-card-info">
        <h3>{name}</h3>
        <p>{price.toLocaleString("en-US")} €</p>
      </div>
    </article>
  );
}
