
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { registerUser, loginUser } from "../utils/auth";
import { ArrowLeft, Eye, EyeOff, Plus, UserRound } from "lucide-react";
import "../styles/Auth.css";

type AuthMode = "login" | "register";

type FieldName =
  | "name"
  | "email"
  | "phone"
  | "password"
  | "confirmPassword"
  | "cardHolder"
  | "cardNumber"
  | "cardExpiry";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<AuthMode>(
    location.pathname === "/login" ? "login" : "register"
  );
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [avatar, setAvatar] = useState<string | null>(null);

  const [cardExpanded, setCardExpanded] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const validateField = (field: FieldName): string => {
    switch (field) {
      case "name":
        if (!name.trim()) return "Please enter your name.";
        if (name.trim().length < 2) return "Name must contain at least 2 characters.";
        return "";

      case "email":
        if (!email.trim()) return "Please enter your email.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          return "Please enter a valid email address.";
        }
        return "";

      case "phone":
        if (phone.trim() && !/^\+?[0-9\s()-]{7,20}$/.test(phone.trim())) {
          return "Please enter a valid phone number.";
        }
        return "";

      case "password":
        if (!password) return "Please enter your password.";
        if (isRegister && password.length < 8) {
          return "Password must contain at least 8 characters.";
        }
        return "";

      case "confirmPassword":
        if (!confirmPassword) return "Please confirm your password.";
        if (password !== confirmPassword) return "Passwords do not match.";
        return "";

      case "cardHolder":
        if (cardExpanded && !cardHolder.trim()) {
          return "Please enter the cardholder name.";
        }
        return "";

      case "cardNumber":
        if (cardExpanded && cardNumber.replace(/\s/g, "").length !== 16) {
          return "Card number must contain 16 digits.";
        }
        return "";

      case "cardExpiry": {
        if (!cardExpanded || !cardExpiry) return "Please enter the expiry date.";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
          return "Please enter a valid date (MM/YY).";
        }

        const [month, year] = cardExpiry.split("/").map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          return "This card has expired.";
        }
        return "";
      }

      default:
        return "";
    }
  };

  const getFieldError = (field: FieldName) => {
    return touched[field] ? validateField(field) : "";
  };

  const markTouched = (field: FieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const fieldsToCheck: FieldName[] = isRegister
      ? ["name", "email", "phone", "password", "confirmPassword"]
      : ["email", "password"];

    if (isRegister && cardExpanded) {
      fieldsToCheck.push("cardHolder", "cardNumber", "cardExpiry");
    }

    const newTouched: Partial<Record<FieldName, boolean>> = {};

    fieldsToCheck.forEach((field) => {
      newTouched[field] = true;
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));

    const hasErrors = fieldsToCheck.some(
      (field) => validateField(field) !== "",
    );

    if (hasErrors) return;

    // BACKEND PLACEHOLDER
    // Registration/login API will be connected here.

  if (isRegister) {
  const newUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim() || undefined,
    avatar: avatar || undefined,
  };

  const success = registerUser(newUser, password);

  if (!success) {
    setError("An account with this email already exists.");
    return;
  }

  navigate("/account", { replace: true });
} else {
  const success = loginUser(email.trim(), password);

  if (!success) {
    setError("Incorrect email or password.");
    return;
  }

  navigate("/account", { replace: true });
}
};
  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setTouched({});
    setShowPassword(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-back">
          <ArrowLeft />
          BACK TO HOME
        </Link>

        <div className="auth-card">
          <div className="auth-heading">
            <span className="auth-eyebrow">YŌJŪ GUITARS</span>

            <h1>
              {isRegister ? "CREATE ACCOUNT" : "WELCOME BACK"}
            </h1>

            <p>
              {isRegister
                ? "Create your account and become part of YŌJŪ."
                : "Sign in to your YŌJŪ account."}
            </p>
          </div>

          <div className="auth-switch">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              LOGIN
            </button>

            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              REGISTER
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <>
                <div className="auth-avatar-upload">
                  <label
                    htmlFor="auth-avatar"
                    className="auth-avatar-preview"
                  >
                    {avatar ? (
                      <img src={avatar} alt="Avatar preview" />
                    ) : (
                      <UserRound />
                    )}

                    <span className="auth-avatar-add">
                      <Plus />
                    </span>
                  </label>

                  <input
                    id="auth-avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />

                  <span className="auth-avatar-text">
                    ADD PROFILE PHOTO
                  </span>
                </div>

                <div className="auth-field">
                  <label htmlFor="auth-name">NAME *</label>
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      markTouched("name");
                    }}
                    onBlur={() => markTouched("name")}
                  />
                  {getFieldError("name") && (
                    <p className="auth-field-error">{getFieldError("name")}</p>
                  )}
                </div>
              </>
            )}

            <div className="auth-field">
              <label htmlFor="auth-email">EMAIL *</label>
              <input
                id="auth-email"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  markTouched("email");
                }}
                onBlur={() => markTouched("email")}
              />
              {getFieldError("email") && (
                <p className="auth-field-error">{getFieldError("email")}</p>
              )}
            </div>

            {isRegister && (
              <div className="auth-field">
                <label htmlFor="auth-phone">PHONE</label>
                <input
                  id="auth-phone"
                  type="tel"
                  placeholder="+380"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    markTouched("phone");
                  }}
                  onBlur={() => markTouched("phone")}
                />
                {getFieldError("phone") && (
                  <p className="auth-field-error">{getFieldError("phone")}</p>
                )}
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="auth-password">PASSWORD *</label>

              <div className="auth-password-wrapper">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    markTouched("password");
                    if (confirmPassword) markTouched("confirmPassword");
                  }}
                  onBlur={() => markTouched("password")}
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {getFieldError("password") && (
                <p className="auth-field-error">{getFieldError("password")}</p>
              )}
            </div>

            {isRegister && (
              <div className="auth-field">
                <label htmlFor="auth-confirm-password">
                  CONFIRM PASSWORD *
                </label>

                <input
                  id="auth-confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    markTouched("confirmPassword");
                  }}
                  onBlur={() => markTouched("confirmPassword")}
                />
                {getFieldError("confirmPassword") && (
                  <p className="auth-field-error">
                    {getFieldError("confirmPassword")}
                  </p>
                )}
              </div>
            )}

            {!isRegister && (
              <div className="auth-forgot">
                <button
                  type="button"
                  onClick={() =>
                    alert("Password recovery will be connected to the backend.")
                  }
                >
                  FORGOT PASSWORD?
                </button>
              </div>
            )}

            {isRegister && (
              <div className="auth-card-section">
                <button
                  type="button"
                  className="auth-add-card"
                  onClick={() => {
                    setCardExpanded(!cardExpanded);
                    setTouched({});
                  }}
                >
                  <Plus />
                  {cardExpanded ? "REMOVE CARD" : "ADD BANK CARD"}
                </button>

                {cardExpanded && (
                  <div className="auth-card-fields">
                    <div className="auth-field">
                      <label htmlFor="auth-card-holder">
                        CARDHOLDER NAME
                      </label>
                      <input
                        id="auth-card-holder"
                        type="text"
                        placeholder="Name on card"
                        autoComplete="cc-name"
                        value={cardHolder}
                        onChange={(e) => {
                          setCardHolder(e.target.value);
                          markTouched("cardHolder");
                        }}
                        onBlur={() => markTouched("cardHolder")}
                      />
                      {getFieldError("cardHolder") && (
                        <p className="auth-field-error">
                          {getFieldError("cardHolder")}
                        </p>
                      )}
                    </div>

                    <div className="auth-field">
                      <label htmlFor="auth-card-number">
                        CARD NUMBER
                      </label>
                      <input
                        id="auth-card-number"
                        type="text"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        autoComplete="cc-number"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          setCardNumber(
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16)
                              .replace(/(\d{4})(?=\d)/g, "$1 "),
                          );
                          markTouched("cardNumber");
                        }}
                        onBlur={() => markTouched("cardNumber")}
                      />
                      {getFieldError("cardNumber") && (
                        <p className="auth-field-error">
                          {getFieldError("cardNumber")}
                        </p>
                      )}
                    </div>

                    <div className="auth-field">
                      <label htmlFor="auth-card-expiry">
                        EXPIRY DATE
                      </label>
                      <input
                        id="auth-card-expiry"
                        type="text"
                        placeholder="MM/YY"
                        autoComplete="cc-exp"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);

                          if (value.length > 2) {
                            value = `${value.slice(0, 2)}/${value.slice(2)}`;
                          }

                          setCardExpiry(value);
                          markTouched("cardExpiry");
                        }}
                        onBlur={() => markTouched("cardExpiry")}
                      />
                      {getFieldError("cardExpiry") && (
                        <p className="auth-field-error">
                          {getFieldError("cardExpiry")}
                        </p>
                      )}
                    </div>

                    <p className="auth-card-note">
                      Card linking will be available after payment
                      integration.
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit">
              {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
            </button>
          </form>

          <div className="auth-footer">
            <span>
              {isRegister
                ? "ALREADY HAVE AN ACCOUNT?"
                : "DON'T HAVE AN ACCOUNT?"}
            </span>

            <button
              type="button"
              onClick={() =>
                switchMode(isRegister ? "login" : "register")
              }
            >
              {isRegister ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
