
import "../styles/Contacts.css";

export default function Contacts() {
  return (
    <main className="contacts-page">
      <section className="contacts-content">
        <h1 className="contacts-title">Stay tuned</h1>

        <div className="contacts-details">
          <div className="contacts-item">
            <h2>General Inquiries</h2>
            <a href="mailto:info@yourbrand.com">
              info@yourbrand.com
            </a>
          </div>

          <div className="contacts-item">
            <h2>Customer Support</h2>
            <a href="mailto:support@yourbrand.com">
              support@yourbrand.com
            </a>
          </div>

          <div className="contacts-item">
            <h2>Phone</h2>
            <a href="tel:+10000000000">
              +1 (000) 000-0000
            </a>
          </div>
        </div>

        <section className="contacts-message">
          <h2 className="contacts-section-title">
            SEND US A MESSAGE
          </h2>

          <div className="contacts-message-item">
            <span className="contacts-field-placeholder">Your name</span>
          </div>

          <div className="contacts-message-item">
            <span className="contacts-field-label">Email</span>
          </div>

          <div className="contacts-message-item">
            <span className="contacts-field-label">Message</span>
            <p className="contacts-message-hint">
              Tell us how we can help.
            </p>
          </div>

          <a
            className="contacts-send-link"
            href="mailto:info@yourbrand.com?subject=Contact%20Message"
          >
            SEND MESSAGE
          </a>
        </section>

        <section className="contacts-social">
          <h2 className="contacts-section-title">
            FOLLOW OUR SOUND
          </h2>

          <p className="contacts-social-description">
            Stay tuned with new guitars, behind-the-scenes content,
            artist stories, and upcoming releases.
          </p>

          <nav className="contacts-social-links" aria-label="Social media">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <span>·</span>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <span>·</span>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">
              TikTok
            </a>
          </nav>
        </section>
      </section>
    </main>
  );
}
