
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  type CartItem,
} from "../utils/cart";

import "../styles/Cart.css";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Cart() {
 const [cartItems, setCartItems] = useState<CartItem[]>(getCart);

const items = cartItems;

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleQuantityChange = (
    productId: number,
    quantity: number
  ) => {
    updateCartQuantity(productId, quantity);
    setCartItems(getCart());
  };

  const handleRemove = (productId: number) => {
    removeFromCart(productId);
    setCartItems(getCart());
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
  };

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-heading">
          <h1>YOUR CART</h1>
          <span>
            {totalItems} {totalItems === 1 ? "ITEM" : "ITEMS"}
          </span>
        </div>

        {items.length === 0 ? (
          <section className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag />
            </div>

            <h2>YOUR CART IS EMPTY</h2>

            <p>
              Looks like you haven't added anything to your cart yet.
              Discover our collection and find your perfect guitar.
            </p>

            <Link to="/catalog" className="cart-continue-button">
              EXPLORE COLLECTION
              <ArrowRight />
            </Link>
          </section>
        ) : (
          <section className="cart-content">
            <div className="cart-products">
              <div className="cart-products-header">
                <span>PRODUCT</span>
                <span>PRICE</span>
                <span>QUANTITY</span>
                <span>TOTAL</span>
              </div>

              {items.map((item) => {
                const product = item.product;

                return (
                  <article
                    className="cart-item"
                    key={product.id}
                  >
                    <div className="cart-product">
                      <Link
                        to={`/product/${product.id}`}
                        className="cart-product-image"
                      >
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                          />
                        ) : (
                          <ShoppingBag />
                        )}
                      </Link>

                      <div className="cart-product-info">
                        <Link
                          to={`/product/${product.id}`}
                          className="cart-product-name"
                        >
                          {product.name}
                        </Link>

                        {product.isLimited && (
                          <span className="cart-product-limited">
                            LIMITED EDITION
                          </span>
                        )}

                        <button
                          type="button"
                          className="cart-remove-mobile"
                          onClick={() => handleRemove(product.id)}
                        >
                          <Trash2 />
                          REMOVE
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-price">
                      {formatPrice(product.price)}
                    </div>

                    <div className="cart-quantity">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus />
                      </button>
                    </div>

                    <div className="cart-item-total">
                      {formatPrice(product.price * item.quantity)}
                    </div>

                    <button
                      type="button"
                      className="cart-remove-desktop"
                      aria-label={`Remove ${product.name} from cart`}
                      onClick={() => handleRemove(product.id)}
                    >
                      <Trash2 />
                    </button>
                  </article>
                );
              })}

              <div className="cart-bottom-actions">
                <Link to="/catalog" className="cart-back-link">
                  <ArrowLeft />
                  CONTINUE SHOPPING
                </Link>

                <button
                  type="button"
                  className="cart-clear-button"
                  onClick={handleClearCart}
                >
                  CLEAR CART
                </button>
              </div>
            </div>

            <aside className="cart-summary">
              <h2>ORDER SUMMARY</h2>

              <div className="cart-summary-line">
                <span>ITEMS</span>
                <span>{totalItems}</span>
              </div>

              <div className="cart-summary-line">
                <span>SUBTOTAL</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="cart-summary-line">
                <span>DELIVERY</span>
                <span>CALCULATED AT CHECKOUT</span>
              </div>

              <div className="cart-summary-total">
                <span>TOTAL</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <p className="cart-summary-note">
                Delivery costs will be determined during checkout.
              </p>

              <Link
                to="/checkout"
                className="cart-checkout-button"
              >
                PROCEED TO CHECKOUT
                <ArrowRight />
              </Link>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
