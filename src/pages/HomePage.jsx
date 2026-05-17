import { Link } from 'react-router-dom';
import {
  FiBook, FiZap, FiCheckCircle,
  FiArrowRight, FiTarget,
} from 'react-icons/fi';
import SEO from '../components/seo/SEO';
import './HomePage.css';

const FEATURES = [
  {
    icon: <FiBook />,
    iconClass: 'feature-icon-violet',
    title: 'Bite-Sized Notes',
    desc: 'Each topic is distilled into focused, scannable sections — no fluff, just what matters for your exam.',
  },
  {
    icon: <FiZap />,
    iconClass: 'feature-icon-cyan',
    title: 'Instant MCQ Practice',
    desc: 'Test yourself immediately after each concept with curated MCQs and tricky conceptual questions.',
  },
  {
    icon: <FiCheckCircle />,
    iconClass: 'feature-icon-emerald',
    title: 'Instant Feedback',
    desc: 'Know exactly what you got right and why — with explanations for every question.',
  },
];

const STEPS = [
  { num: '01', title: 'Pick a Subject', desc: 'Choose from your NST syllabus topics.' },
  { num: '02', title: 'Read the Notes', desc: 'Skim condensed, exam-focused content.' },
  { num: '03', title: 'Answer Questions', desc: 'Tackle MCQs while the concept is fresh.' },
  { num: '04', title: 'Track Progress', desc: 'See your accuracy and revisit weak areas.' },
];

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Active Learning Platform" 
        description="Ditch the textbook. Study smarter with bite-sized notes and instant MCQ practice — built for NST students, by NST students." 
        path="/" 
      />
      {/* ── Hero ── */}
      <section className="home-hero section" aria-labelledby="hero-heading">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="container">
          <div className="home-hero-eyebrow">
            <span className="badge badge-primary">🎓 Built for NST Students</span>
            <span className="badge badge-accent">Free Forever</span>
          </div>

          <h1 id="hero-heading">
            Study Smarter,{' '}
            <span className="gradient-text">Not Harder</span>
          </h1>

          <p className="home-hero-sub">
            Bite-sized notes paired with instant MCQ practice, built on your
            exact syllabus. Ditch passive reading — learn actively and ace your
            Newton School of Technology internals.
          </p>

          <div className="home-hero-actions">
            <Link
              to="/study"
              className="btn btn-primary"
              id="hero-cta-start"
              style={{ padding: '14px 32px', fontSize: '1rem' }}
            >
              Start Studying <FiArrowRight />
            </Link>
            <Link
              to="/quiz"
              className="btn btn-ghost"
              id="hero-cta-quiz"
              style={{ padding: '14px 32px', fontSize: '1rem' }}
            >
              <FiZap /> Take a Quick Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        className="home-features"
        aria-labelledby="features-heading"
      >
        <div className="container">
          <div className="home-section-header">
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
              Why SnapStudy
            </span>
            <h2 id="features-heading">Active Learning, Simplified</h2>
            <p>Everything you need to study efficiently — nothing you don't.</p>
          </div>
          <div className="home-features-grid">
            {FEATURES.map(({ icon, iconClass, title, desc }) => (
              <article key={title} className="glass-card feature-card">
                <div className={`feature-icon ${iconClass}`} aria-hidden="true">
                  {icon}
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="home-how" aria-labelledby="how-heading">
        <div className="container">
          <div className="home-section-header">
            <span className="badge badge-accent" style={{ marginBottom: '12px' }}>
              The Process
            </span>
            <h2 id="how-heading">Four Steps to Exam Confidence</h2>
            <p>A tight loop designed to lock in knowledge fast.</p>
          </div>
          <div className="home-steps" role="list">
            {STEPS.map(({ num, title, desc }) => (
              <article key={num} className="glass-card step-card" role="listitem">
                <div className="step-number" aria-hidden="true">{num}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="container" aria-label="Call to action">
        <div className="home-cta-banner">
          <span className="badge badge-success" style={{ marginBottom: '16px' }}>
            🚀 Ready?
          </span>
          <h2>Your Syllabus. Your Pace. Your Score.</h2>
          <p>
            Join your batchmates already studying smarter on SnapStudy.
          </p>
          <div className="home-hero-actions">
            <Link
              to="/subjects"
              className="btn btn-primary"
              id="cta-banner-explore"
              style={{ padding: '13px 28px' }}
            >
              Explore Subjects <FiArrowRight />
            </Link>
            <Link
              to="/dashboard"
              className="btn btn-ghost"
              id="cta-banner-dashboard"
              style={{ padding: '13px 28px' }}
            >
              <FiTarget /> View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
