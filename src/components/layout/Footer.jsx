import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiArrowRight } from 'react-icons/fi';
import './Footer.css';

const PLATFORM_LINKS = [
  { to: '/study',     label: 'Study Notes' },
  { to: '/quiz',      label: 'Quick Quiz' },
  { to: '/subjects',  label: 'All Subjects' },
  { to: '/dashboard', label: 'My Progress' },
];

const RESOURCE_LINKS = [
  { to: '#', label: 'How It Works' },
  { to: '#', label: 'Flashcards' },
  { to: '#', label: 'Past Papers' },
  { to: '#', label: 'Formula Sheets' },
];

const SUPPORT_LINKS = [
  { to: '#', label: 'Suggest a Topic' },
  { to: '#', label: 'Report an Error' },
  { to: '#', label: 'Contribute Notes' },
  { to: '#', label: 'Contact Us' },
];

const STATS = [
  { value: '200+', label: 'Topics Covered' },
  { value: '1 000+', label: 'Practice Questions' },
  { value: 'NST', label: 'Built For' },
  { value: '100%', label: 'Free Forever' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container">

        {/* Stats strip */}
        <div className="footer-stats" role="list" aria-label="Platform statistics">
          {STATS.map(({ value, label }) => (
            <div key={label} className="footer-stat" role="listitem">
              <span className="footer-stat-value">{value}</span>
              <span className="footer-stat-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="SnapStudy home">
              <div className="footer-logo-mark" aria-hidden="true">S</div>
              <span className="footer-logo-name">SnapStudy</span>
            </Link>

            <p className="footer-tagline">
              Ditch the textbook. Study smarter with condensed, bite-sized notes
              and instant MCQ practice — built for NST students, by NST students.
            </p>

            <div className="footer-college-badge" aria-label="College affiliation">
              🎓 <span>Newton School of Technology</span>
            </div>

            {/* Social */}
            <div className="footer-social" aria-label="Social media links">
              <a
                href="#"
                className="footer-social-link"
                aria-label="GitHub"
                id="footer-social-github"
              >
                <FiGithub />
              </a>
              <a
                href="#"
                className="footer-social-link"
                aria-label="Twitter / X"
                id="footer-social-twitter"
              >
                <FiTwitter />
              </a>
              <a
                href="#"
                className="footer-social-link"
                aria-label="Instagram"
                id="footer-social-instagram"
              >
                <FiInstagram />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul role="list">
              {PLATFORM_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>
                    <FiArrowRight size={12} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h4>Resources</h4>
            <ul role="list">
              {RESOURCE_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to}>
                    <FiArrowRight size={12} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Community</h4>
            <ul role="list">
              {SUPPORT_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link to={to}>
                    <FiArrowRight size={12} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} <strong>SnapStudy</strong>. Made with{' '}
            <span className="footer-heart" aria-hidden="true">♥</span>{' '}
            at Newton School of Technology.
          </p>
          <nav className="footer-bottom-links" aria-label="Legal links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Use</Link>
            <Link to="#">Accessibility</Link>
          </nav>
        </div>

      </div>
    </footer>
  );
}
