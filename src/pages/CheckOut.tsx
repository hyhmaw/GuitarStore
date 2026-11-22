import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, ShoppingBag } from "lucide-react";

import { getCurrentUser } from "../utils/auth";
import {
  getCart,
  clearCart,
  type CartItem,
} from "../utils/cart";

import "../styles/Checkout.css";

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  city: string;
  deliveryMethod: string;
  address: string;
  paymentMethod: string;
};

export default function Checkout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [cartItems, setCartItems] = useState<CartItem[]>(getCart);

  const [form, setForm] = useState<CheckoutForm>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: "",
    deliveryMethod: "nova-poshta",
    address: "",
    paymentMethod: "cash",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryPrice = 0;
  const total = subtotal + deliveryPrice;

  const handleChange = (
  event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = event.target;

  setForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

 const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (cartItems.length === 0) return;

  const newOrderId = crypto.randomUUID();
  const newOrderNumber = `YOJU-${newOrderId.slice(0, 8).toUpperCase()}`;

    const newOrder = {
      id: newOrderId,
      orderNumber: newOrderNumber,
      date: new Date().toISOString(),
      status: "Processing",
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      delivery: {
        city: form.city.trim(),
        method: form.deliveryMethod,
        address: form.address.trim(),
      },
      paymentMethod: form.paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || "",
      })),
      subtotal,
      deliveryPrice,
      total,
    };

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("yoju_orders") || "[]"
      );

      localStorage.setItem(
        "yoju_orders",
        JSON.stringify([...savedOrders, newOrder])
      );

      clearCart();
      setCartItems([]);
      setOrderNumber(newOrderNumber);
      setOrderPlaced(true);
    } catch {
      alert("Unable to save your demo order. Please try again.");
    }
  };

  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <section className="checkout-success">
          <div className="checkout-success-icon">
            <CheckCircle />
          </div>

          <h1>ORDER CONFIRMED</h1>

          <p>
            Thank you for your order. Your demo order has been saved.
          </p>

          <span className="checkout-order-number">
            ORDER NUMBER: {orderNumber}
          </span>

          <button
            type="button"
            onClick={() => navigate("/account")}
            className="checkout-primary-button"
          >
            GO TO MY ACCOUNT
          </button>

          <Link to="/catalog" className="checkout-text-link">
            CONTINUE SHOPPING
          </Link>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <ShoppingBag />
          <h1>YOUR CART IS EMPTY</h1>
          <p>Add some guitars to your cart before checkout.</p>

          <Link to="/catalog" className="checkout-primary-button">
            EXPLORE COLLECTION
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <Link to="/cart" className="checkout-back-link">
          <ArrowLeft size={17} />
          BACK TO CART
        </Link>

        <h1 className="checkout-heading">CHECKOUT</h1>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-form-column">
            <section className="checkout-section">
              <div className="checkout-section-heading">
                <span>01</span>
                <h2>CONTACT INFORMATION</h2>
              </div>

              <div className="checkout-fields">
                <label className="checkout-field">
                  <span>FULL NAME</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="checkout-field">
                  <span>EMAIL ADDRESS</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="checkout-field">
                  <span>PHONE NUMBER</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+380..."
                    autoComplete="tel"
                    required
                  />
                </label>
              </div>

              {user && (
                <p className="checkout-account-note">
                  Your account information has been filled in automatically.
                  You can edit it for this order.
                </p>
              )}
            </section>

            <section className="checkout-section">
              <div className="checkout-section-heading">
                <span>02</span>
                <h2>DELIVERY INFORMATION</h2>
              </div>

              <div className="checkout-fields">
                <label className="checkout-field">
                  <span>DELIVERY METHOD</span>
                  <select
                    name="deliveryMethod"
                    value={form.deliveryMethod}
                    onChange={handleChange}
                  >
                    <option value="nova-poshta">Nova Poshta</option>
                    <option value="ukrposhta">Ukrposhta</option>
                    <option value="courier">Courier delivery</option>
                    <option value="pickup">Store pickup</option>
                  </select>
                </label>

                <label className="checkout-field">
                  <span>CITY</span>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    autoComplete="address-level2"
                    required={form.deliveryMethod !== "pickup"}
                    disabled={form.deliveryMethod === "pickup"}
                  />
                </label>

                {form.deliveryMethod !== "pickup" && (
                  <label className="checkout-field">
                    <span>
                      {form.deliveryMethod === "courier"
                        ? "STREET AND HOUSE NUMBER"
                        : "BRANCH OR DELIVERY ADDRESS"}
                    </span>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder={
                        form.deliveryMethod === "courier"
                          ? "Street, building, apartment"
                          : "Branch number or address"
                      }
                      autoComplete="street-address"
                      required
                    />
                  </label>
                )}

                {form.deliveryMethod === "pickup" && (
                  <p className="checkout-pickup-note">
                    Store pickup details will be provided after order
                    confirmation.
                  </p>
                )}
              </div>
            </section>

            <section className="checkout-section">
              <div className="checkout-section-heading">
                <span>03</span>
                <h2>PAYMENT METHOD</h2>
              </div>

              <div className="checkout-payment-options">
                <label className="checkout-payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={form.paymentMethod === "cash"}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Cash on delivery</strong>
                    <small>Pay when you receive your order</small>
                  </span>
                </label>

                <label className="checkout-payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={form.paymentMethod === "card"}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Card on delivery</strong>
                    <small>Pay by card when receiving your order</small>
                  </span>
                </label>

                <label className="checkout-payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={form.paymentMethod === "transfer"}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Bank transfer</strong>
                    <small>Payment instructions will be provided later</small>
                  </span>
                </label>
              </div>

              <p className="checkout-demo-note">
                Payment is not processed on this demo website.
              </p>
            </section>
          </div>

          <aside className="checkout-summary">
            <h2>ORDER SUMMARY</h2>

            <div className="checkout-items">
              {cartItems.map((item) => (
                <div
                  className="checkout-item"
                  key={item.product.id}
                >
                  <div className="checkout-item-image">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                      />
                    ) : (
                      <ShoppingBag />
                    )}
                  </div>

                  <div className="checkout-item-info">
                    <h3>{item.product.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <span>
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-US"
                      )}{" "}
                      €
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-summary-line">
              <span>SUBTOTAL</span>
              <span>{subtotal.toLocaleString("en-US")} €</span>
            </div>

            <div className="checkout-summary-line">
              <span>DELIVERY</span>
              <span>{deliveryPrice === 0 ? "To be determined" : `${deliveryPrice} €`}</span>
            </div>

            <div className="checkout-summary-total">
              <span>TOTAL</span>
              <strong>{total.toLocaleString("en-US")} €</strong>
            </div>

            <p className="checkout-delivery-note">
              The final delivery cost is not included in this demo calculation.
            </p>

            <button
              type="submit"
              className="checkout-submit-button"
            >
              PLACE ORDER
            </button>

            <Link to="/cart" className="checkout-edit-cart">
              EDIT CART
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
}