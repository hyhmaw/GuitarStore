import { useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";
import "../styles/CartNotification.css";

export type CartNotificationProduct = {
  name: string;
  price: number;
  image?: string;
};

type CartNotificationProps = {
  product: CartNotificationProduct | null;
  onClose: () => void;
  onViewCart?: () => void;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
};

export default function CartNotification({
  product,
  onClose,
  onViewCart,
  onCheckout,
  onContinueShopping,
}: CartNotificationProps) {
  useEffect(() => {
    if (!product) return;

    const timer = window.setTimeout(onClose, 4000);

    return () => window.clearTimeout(timer);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="cart-notification">
      <div className="cart-notification-header">
        <span className="cart-notification-label">
          PRODUCT ADDED TO CART
        </span>

        <button
          className="cart-notification-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X />
        </button>
      </div>

      <div className="cart-notification-product">
        <div className="cart-notification-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <ShoppingBag />
          )}
        </div>

        <div className="cart-notification-info">
          <h3>{product.name}</h3>
          <p>${product.price.toLocaleString("en-US")}</p>
        </div>
      </div>

      <div className="cart-notification-actions">
        {onCheckout && (
          <button
            className="cart-notification-checkout"
            onClick={onCheckout}
          >
            CHECKOUT
          </button>
        )}

        {onViewCart && (
          <button
            className="cart-notification-view"
            onClick={onViewCart}
          >
            VIEW CART
          </button>
        )}

        {onContinueShopping && (
          <button
            className="cart-notification-continue"
            onClick={onContinueShopping}
          >
            CONTINUE SHOPPING
          </button>
        )}
      </div>
    </div>
  );
}