import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">YŌJU GUITARS</div>
      <p className="footer-tagline">Built for your sound.</p>

      <div className="footer-socials">
        <a href="https://instagram.com">Instagram</a>
        <span>·</span>
        <a href="https://youtube.com">YouTube</a>
        <span>·</span>
        <a href="https://facebook.com">Facebook</a>
      </div>

      <p className="footer-copyright">
        © 2026 YŌJU Guitars. All rights reserved.
      </p>
    </footer>
  );
}