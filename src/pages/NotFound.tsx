
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <h1 className="not-found-code">404</h1>

        <p className="not-found-message">
          SEEMS THE PAGE YOU'RE LOOKING FOR DOESN'T EXIST
        </p>

        <button
          className="not-found-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="not-found-arrow" />
          <span>BACK TO PREVIOUS PAGE</span>
        </button>
      </section>
    </main>
  );
}
