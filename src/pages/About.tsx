
import "../styles/About.css";

const faqItems = [
  {
    question: "Who are we?",
    answer:
      "We are a guitar company dedicated to creating high-quality electric guitars.",
  },
  {
    question: "What makes our guitars different?",
    answer:
      "We combine modern design, carefully selected materials, and attention to detail to create instruments that feel as good as they sound.",
  },
  {
    question: "Where are our guitars made?",
    answer:
      "Our guitars are designed and crafted by our team with a focus on quality at every stage of production.",
  },
  {
    question: "Who are our guitars made for?",
    answer:
      "Our instruments are made for everyone — from beginners discovering their sound to experienced musicians performing on stage and in the studio.",
  },
  {
    question: "What inspires our designs?",
    answer:
      "Our designs are inspired by music, modern technology, classic guitar culture, and the individuality of every musician.",
  },
];

export default function About() {
  return (
    <main className="about-page">
      <div className="about-overlay">
        <section className="about-content">
          <h1 className="about-title">FAQ</h1>

          <div className="about-faq">
            {faqItems.map((item) => (
              <article className="about-faq-item" key={item.question}>
                <h2 className="about-question">{item.question}</h2>
                <p className="about-answer">
  <span className="about-answer-dot">•</span>
  <span>{item.answer}</span>
</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
