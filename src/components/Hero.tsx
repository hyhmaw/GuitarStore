import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <main className="hero">
      <div className="hero-banner">
        <a href="/limited" className="hero-link">
          <span>
            Check out our new{" "}
            <span className="underlined">limited series</span>
          </span>

          <ArrowRight className="hero-arrow" />
        </a>
      </div>
    </main>
  );
}