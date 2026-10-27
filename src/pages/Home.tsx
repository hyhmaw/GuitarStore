import { ArrowRight } from "lucide-react";
import "../styles/Home.css";

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-banner">
          <a href="/limited" className="home-banner-link">
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