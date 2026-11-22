
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserRound,
  Camera,
  Pencil,
  LogOut,
  Package,
  Guitar,
  X,
  Save,
  CreditCard,
  Plus,
  Trash2,
} from "lucide-react";

import {
  getCurrentUser,
  updateCurrentUser,
  logoutUser,
  addPaymentCard,
  removePaymentCard,
} from "../utils/auth";

import type { User, SavedCard } from "../utils/auth";

import "../styles/Account.css";

export default function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState<string | null>(
    user?.avatar || null,
  );

  const [message, setMessage] = useState("");

  const [addingCard, setAddingCard] = useState(false);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardError, setCardError] = useState("");

  if (!user) {
    return null;
  }

  const cards = user.cards || [];

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must not exceed 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result as string);
      setMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }

    const updatedUser = updateCurrentUser({
      name: name.trim(),
      phone: phone.trim(),
      avatar: avatar || undefined,
    });

    if (!updatedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(updatedUser);
    setEditing(false);
    setMessage("Profile updated successfully.");
  };

  const handleCancel = () => {
    setName(user.name);
    setPhone(user.phone || "");
    setAvatar(user.avatar || null);
    setEditing(false);
    setMessage("");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);

    setCardNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
    setCardError("");
  };

  const handleExpiryChange = (value: string) => {
    let digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length > 2) {
      digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    setCardExpiry(digits);
    setCardError("");
  };

  const getCardBrand = (number: string) => {
    if (/^4/.test(number)) return "VISA";
    if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(number)) {
      return "MASTERCARD";
    }
    if (/^3[47]/.test(number)) return "AMEX";
    if (/^6(?:011|5)/.test(number)) return "DISCOVER";

    return "BANK CARD";
  };

  const handleAddCard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCardError("");

    const digits = cardNumber.replace(/\D/g, "");

    if (!cardHolder.trim()) {
      setCardError("Please enter the cardholder name.");
      return;
    }

    if (!/^\d{13,19}$/.test(digits)) {
      setCardError("Please enter a valid card number.");
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      setCardError("Please enter a valid expiry date (MM/YY).");
      return;
    }

    const [month, year] = cardExpiry.split("/").map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      setCardError("This card has expired.");
      return;
    }

    const updatedUser = addPaymentCard({
      holder: cardHolder.trim(),
      last4: digits.slice(-4),
      expiry: cardExpiry,
      brand: getCardBrand(digits),
    });

    if (!updatedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(updatedUser);
    setAddingCard(false);
    setCardHolder("");
    setCardNumber("");
    setCardExpiry("");
    setCardError("");
  };

  const handleRemoveCard = (cardId: string) => {
    const updatedUser = removePaymentCard(cardId);

    if (!updatedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(updatedUser);
  };

  return (
    <main className="account-page">
      <div className="account-container">
        <div className="account-heading">
          <div>
            <span className="account-eyebrow">YŌJŪ GUITARS</span>
            <h1>MY ACCOUNT</h1>
          </div>

          <button
            className="account-logout"
            type="button"
            onClick={handleLogout}
          >
            <LogOut />
            LOG OUT
          </button>
        </div>

        <section className="account-profile">
          <div className="account-section-heading">
            <h2>MY PROFILE</h2>

            {!editing ? (
              <button
                className="account-edit-button"
                type="button"
                onClick={() => {
                  setEditing(true);
                  setMessage("");
                }}
              >
                <Pencil />
                EDIT PROFILE
              </button>
            ) : (
              <div className="account-edit-actions">
                <button
                  className="account-cancel-button"
                  type="button"
                  onClick={handleCancel}
                >
                  <X />
                  CANCEL
                </button>

                <button
                  className="account-save-button"
                  type="button"
                  onClick={handleSave}
                >
                  <Save />
                  SAVE
                </button>
              </div>
            )}
          </div>

          <div className="account-profile-content">
            <div className="account-avatar-wrapper">
              <div className="account-avatar">
                {avatar ? (
                  <img src={avatar} alt="Profile avatar" />
                ) : (
                  <UserRound />
                )}
              </div>

              {editing && (
                <label
                  htmlFor="account-avatar-input"
                  className="account-avatar-upload"
                  title="Change avatar"
                >
                  <Camera />
                </label>
              )}

              <input
                id="account-avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
                disabled={!editing}
              />
            </div>

            <div className="account-profile-fields">
              <div className="account-field">
                <label>NAME</label>

                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                ) : (
                  <p>{user.name}</p>
                )}
              </div>

              <div className="account-field">
                <label>EMAIL</label>
                <p>{user.email}</p>
              </div>

              <div className="account-field">
                <label>PHONE</label>

                {editing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380"
                  />
                ) : (
                  <p>{user.phone || "Not specified"}</p>
                )}
              </div>
            </div>
          </div>

          {message && (
            <p className="account-message">{message}</p>
          )}
        </section>

        <section className="account-payment">
          <div className="account-section-heading">
            <h2>MY PAYMENT METHODS</h2>
            <span>{cards.length} SAVED CARDS</span>
          </div>

          {cards.length === 0 && !addingCard && (
            <div className="account-empty">
              <CreditCard />
              <h3>NO SAVED CARDS</h3>
              <p>
                Your saved payment methods will appear here.
              </p>

              <button
                type="button"
                onClick={() => setAddingCard(true)}
              >
                <Plus />
                ADD NEW CARD
              </button>
            </div>
          )}

          {cards.length > 0 && (
            <div className="account-cards">
              {cards.map((card: SavedCard) => (
                <div className="account-payment-card" key={card.id}>
                  <div className="account-payment-card-top">
                    <CreditCard />
                    <span>{card.brand}</span>
                  </div>

                  <p className="account-card-number">
                    •••• •••• •••• {card.last4}
                  </p>

                  <div className="account-payment-card-bottom">
                    <div>
                      <span>CARDHOLDER</span>
                      <p>{card.holder}</p>
                    </div>

                    <div>
                      <span>EXPIRES</span>
                      <p>{card.expiry}</p>
                    </div>

                    <button
                      type="button"
                      className="account-remove-card"
                      onClick={() => handleRemoveCard(card.id)}
                      aria-label="Remove card"
                      title="Remove card"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cards.length > 0 && !addingCard && (
            <button
              className="account-add-card-button"
              type="button"
              onClick={() => setAddingCard(true)}
            >
              <Plus />
              ADD NEW CARD
            </button>
          )}

          {addingCard && (
            <form
              className="account-card-form"
              onSubmit={handleAddCard}
              noValidate
            >
              <div className="account-card-form-heading">
                <h3>ADD NEW CARD</h3>

                <button
                  type="button"
                  onClick={() => {
                    setAddingCard(false);
                    setCardError("");
                  }}
                  aria-label="Close form"
                >
                  <X />
                </button>
              </div>

              <div className="account-card-form-fields">
                <div className="account-field">
                  <label htmlFor="card-holder">CARDHOLDER NAME</label>
                  <input
                    id="card-holder"
                    type="text"
                    placeholder="Name on card"
                    autoComplete="cc-name"
                    value={cardHolder}
                    onChange={(e) => {
                      setCardHolder(e.target.value);
                      setCardError("");
                    }}
                  />
                </div>

                <div className="account-field">
                  <label htmlFor="card-number">CARD NUMBER</label>
                  <input
                    id="card-number"
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    autoComplete="off"
                    maxLength={23}
                    value={cardNumber}
                    onChange={(e) =>
                      handleCardNumberChange(e.target.value)
                    }
                  />
                </div>

                <div className="account-field account-card-expiry">
                  <label htmlFor="card-expiry">EXPIRY DATE</label>
                  <input
                    id="card-expiry"
                    type="text"
                    placeholder="MM/YY"
                    autoComplete="off"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) =>
                      handleExpiryChange(e.target.value)
                    }
                  />
                </div>
              </div>

              {cardError && (
                <p className="account-card-error">{cardError}</p>
              )}

              <p className="account-card-security-note">
                This demo stores only the card brand, last four digits
                and expiry date. Full card details are not saved.
              </p>

              <button
                className="account-save-card-button"
                type="submit"
              >
                <Save />
                SAVE CARD
              </button>
            </form>
          )}
        </section>

        <section className="account-collection">
          <div className="account-section-heading">
            <h2>MY COLLECTION</h2>
            <span>0 GUITARS</span>
          </div>

          <div className="account-empty">
            <Guitar />
            <h3>YOUR COLLECTION IS EMPTY</h3>
            <p>
              Your purchased guitars will appear here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/catalog")}
            >
              EXPLORE COLLECTION
            </button>
          </div>
        </section>

        <section className="account-orders">
          <div className="account-section-heading">
            <h2>ORDER HISTORY</h2>
            <span>0 ORDERS</span>
          </div>

          <div className="account-empty">
            <Package />
            <h3>NO ORDERS YET</h3>
            <p>
              Your orders and their status will be displayed here.
            </p>
            <button
              type="button"
              onClick={() => navigate("/catalog")}
            >
              START SHOPPING
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
