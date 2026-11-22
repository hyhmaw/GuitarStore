import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLimitedClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();

    if (window.innerWidth <= 768) {
      navigate("/limited");
      return;
    }

    const limitedSection = document.getElementById("limited");

    if (limitedSection) {
      limitedSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate("/catalog#limited");
    }
  };

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-banner">
          <a
            href="/catalog#limited"
            className="home-banner-link"
            onClick={handleLimitedClick}
          >
            <span>
              Check out our new{" "}
              <span className="home-banner-underline">
                limited series
              </span>
            </span>

            <ArrowRight className="home-banner-arrow" />
          </a>
        </div>
      </section>
    </main>
  );
}