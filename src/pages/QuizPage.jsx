import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiChevronRight, FiPlay, FiTarget } from 'react-icons/fi';
import { topics } from '../data/topics';
import { generateQuiz } from '../services/aiService';
import SEO from '../components/seo/SEO';
import './Placeholder.css'; // Reusing some base styles

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [currentTopic, setCurrentTopic] = useState(null);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(null);
  const [answered, setAnswered]   = useState(false);
  const [score, setScore]         = useState(0);
  const [done, setDone]           = useState(false);

  const [selectedTopicId, setSelectedTopicId] = useState('random');

  const LETTERS = ['A', 'B', 'C', 'D'];

  // Group topics by subject for the dropdown
  const subjects = [...new Set(topics.map(t => t.subject))];

  async function startQuiz() {
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setDone(false);

    try {
      let chosenTopic;
      if (selectedTopicId === 'random') {
        // Pick a random topic from the entire database
        chosenTopic = topics[Math.floor(Math.random() * topics.length)];
      } else {
        chosenTopic = topics.find(t => t.id === selectedTopicId);
      }
      
      setCurrentTopic(chosenTopic);

      // We no longer have static notes in the DB, so we tell the AI to generate from general knowledge
      const combinedNotes = "No notes context needed. Generate based on the topic.";
      
      // Generate quiz using a baseline mastery level of 3 (intermediate) for Quick Quizzes
      const aiQuestions = await generateQuiz(chosenTopic.title, chosenTopic.subject, combinedNotes, 3);
      setQuestions(aiQuestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelect(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const q = questions[current];
    if (idx === q.correctIndex) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
    }
  }

  // ─── STATE 1: Landing Page ───
  if (!isLoading && questions.length === 0) {
    return (
      <div className="placeholder-page container">
        <SEO 
          title="Quick Quiz" 
          description="Test your knowledge with an AI-generated quiz." 
          path="/quiz" 
        />
        <div className="placeholder-icon" aria-hidden="true"><FiZap /></div>
        <span className="badge badge-accent">Quick Quiz</span>
        <h1>AI Global Quiz Mode</h1>
        <p>
          Challenge yourself! Choose a specific topic to revise, or let the AI randomly 
          select one from your entire syllabus to keep you on your toes.
        </p>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', maxWidth: '500px', marginInline: 'auto' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div style={{ maxWidth: '400px', margin: '0 auto 24px auto', textAlign: 'left' }}>
          <label htmlFor="topic-select" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Choose Topic:</label>
          <select 
            id="topic-select"
            value={selectedTopicId} 
            onChange={(e) => setSelectedTopicId(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            <option value="random">🎲 Surprise me! (Random Topic)</option>
            {subjects.map(subject => (
              <optgroup key={subject} label={subject}>
                {topics.filter(t => t.subject === subject).map(t => (
                  <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={startQuiz}>
            <FiPlay /> Start Quiz
          </button>
          <Link to="/" className="btn btn-ghost" id="quiz-back-home">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ─── STATE 2: Loading State ───
  if (isLoading) {
    return (
      <div className="placeholder-page container">
        <div className="loader-spinner" style={{ width: '48px', height: '48px', margin: '0 auto 24px auto', borderColor: 'rgba(255,255,255,0.1)', borderTopColor: 'var(--color-primary-light)' }} />
        <h2>Generating your Quiz...</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {currentTopic ? `AI is analyzing notes for "${currentTopic.title}"...` : "Selecting a random topic..."}
        </p>
      </div>
    );
  }

  // ─── STATE 3: Quiz Finished ───
  const q = questions[current];
  const finalScore = score + (done && selected === q?.correctIndex ? 1 : 0);
  const pct = Math.round((finalScore / questions.length) * 100);

  if (done) {
    const total = questions.length;
    const emoji = finalScore === total ? '🎉' : finalScore >= total / 2 ? '👍' : '📚';
    return (
      <div className="placeholder-page container">
        <div className="glass-card score-screen" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div className="score-ring-wrap" aria-label={`Score: ${finalScore} out of ${total}`}>
            <div>
              <div className="score-number">{finalScore}/{total}</div>
              <div className="score-label">correct</div>
            </div>
          </div>
          <h2>{emoji} {finalScore === total ? 'Perfect!' : finalScore >= total / 2 ? 'Good Job!' : 'Keep Practicing'}</h2>
          <p>
            You scored <strong style={{ color: 'var(--color-primary-light)' }}>{pct}%</strong> on 
            the topic <strong>{currentTopic.title}</strong> ({currentTopic.subject}).
          </p>
          <div className="score-actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
            <button className="btn btn-primary" onClick={() => {
              setQuestions([]);
              setDone(false);
            }}>
              <FiZap /> Take Another Quiz
            </button>
            <Link to="/study" className="btn btn-ghost">
              <FiTarget /> Go to Study Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── STATE 4: Quiz Active ───
  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <SEO title={`Quiz: ${currentTopic.title}`} path="/quiz" />
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-accent" style={{ marginBottom: '12px' }}>{currentTopic.subject}</span>
        <h1>{currentTopic.icon} {currentTopic.title}</h1>
      </header>

      <div className="quiz-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiZap color="var(--color-accent)" /> Question {current + 1}
        </h3>
        <span className="quiz-q-count">
          {current + 1} / {questions.length}
        </span>
      </div>

      <div className="glass-card quiz-card">
        <p className="quiz-question" style={{ fontSize: '1.2rem', marginBottom: '24px' }}>{q.question}</p>
        <div className="quiz-options" role="group" aria-label="Answer options">
          {q.options.map((opt, idx) => {
            let cls = 'quiz-option';
            if (answered) {
              if (idx === q.correctIndex) cls += ' correct';
              else if (idx === selected)  cls += ' wrong';
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                aria-pressed={selected === idx}
              >
                <span className="quiz-option-letter">{LETTERS[idx]}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
            <div className="quiz-explanation" style={{ marginBottom: '24px' }}>
              <strong>Explanation:</strong> {q.explanation}
            </div>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {current + 1 < questions.length ? 'Next Question' : 'See Final Score'}{' '}
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
