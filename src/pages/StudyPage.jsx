import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiChevronRight, FiRotateCcw, FiZap, FiSearch, FiPlay, FiLock, FiUnlock, FiArrowLeft, FiBookOpen } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { topics } from '../data/topics';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';
import { useMastery } from '../hooks/useMastery';
import { generateQuiz, generateStudyNotes } from '../services/aiService';
import SEO from '../components/seo/SEO';
import './StudyPage.css';

/* ── Sub-components ──────────────────────────── */

/* eslint-disable no-unused-vars */
function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-primary-light)'}} {...props} />,
          h2: ({node, ...props}) => <h2 style={{marginTop: '1.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem'}} {...props} />,
          h3: ({node, ...props}) => <h3 style={{marginTop: '1.25rem', marginBottom: '0.5rem'}} {...props} />,
          p: ({node, ...props}) => <p style={{marginBottom: '1rem', lineHeight: '1.7'}} {...props} />,
          ul: ({node, ...props}) => <ul style={{marginBottom: '1rem', paddingLeft: '2rem', lineHeight: '1.7'}} {...props} />,
          ol: ({node, ...props}) => <ol style={{marginBottom: '1rem', paddingLeft: '2rem', lineHeight: '1.7'}} {...props} />,
          li: ({node, ...props}) => <li style={{marginBottom: '0.5rem'}} {...props} />,
          code: ({node, inline, ...props}) => 
            inline ? (
              <code style={{background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9em'}} {...props} />
            ) : (
              <pre style={{background: '#1a1b26', padding: '1rem', borderRadius: '8px', overflowX: 'auto', marginBottom: '1rem'}}>
                <code style={{fontFamily: 'monospace', fontSize: '0.9em'}} {...props} />
              </pre>
            ),
          blockquote: ({node, ...props}) => (
            <blockquote style={{borderLeft: '4px solid var(--color-primary-light)', paddingLeft: '1rem', margin: '1rem 0', color: 'var(--text-muted)', fontStyle: 'italic'}} {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function QuizSection({ topic, level, onComplete, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(null);
  const [answered, setAnswered]   = useState(false);
  const [score, setScore]         = useState(0);
  const [done, setDone]           = useState(false);

  const LETTERS = ['A', 'B', 'C', 'D'];

  async function handleStart() {
    setIsLoading(true);
    setError(null);
    try {
      const aiQuestions = await generateQuiz(topic.title, topic.subject, "No notes context needed. Generate based on topic.", level);
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
      const q = questions[current];
      const finalScore = score + (selected === q.correctIndex ? 1 : 0);
      onComplete(finalScore, questions.length);
    }
  }

  // State 1: Before AI generation
  if (questions.length === 0) {
    return (
      <div className="glass-card quiz-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <button onClick={onBack} className="btn btn-ghost" style={{ position: 'absolute', top: '16px', left: '16px', padding: '8px' }}>
          <FiArrowLeft /> Back
        </button>
        <FiZap size={48} color="var(--color-accent)" style={{ marginBottom: '16px', marginTop: '20px' }} />
        <h2>Level {level} Quiz</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          You must score at least 80% to unlock the next level of mastery.
        </p>
        
        {error && (
          <div className="note-highlight" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderLeftColor: '#EF4444', marginBottom: '24px', textAlign: 'left' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <button 
          className="btn btn-primary" 
          onClick={handleStart} 
          disabled={isLoading}
          style={{ width: '100%', justifyContent: 'center', maxWidth: '300px', margin: '0 auto' }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="loader-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> 
              Generating Quiz...
            </span>
          ) : (
             <><FiPlay /> Start Quiz</>
          )}
        </button>
      </div>
    );
  }

  const q = questions[current];
  const finalScore = score + (done && selected === q?.correctIndex ? 0 : 0);
  const pct = Math.round((finalScore / questions.length) * 100);

  // State 2: Quiz Finished
  if (done) {
    const total = questions.length;
    const passed = pct >= 80;
    const emoji = passed ? '🎉' : '📚';
    return (
      <div className="glass-card score-screen">
        <div className="score-ring-wrap" aria-label={`Score: ${finalScore} out of ${total}`}>
          <div>
            <div className="score-number">{finalScore}/{total}</div>
            <div className="score-label">correct</div>
          </div>
        </div>
        <h2>{emoji} {passed ? 'Level Passed!' : 'Keep Practicing'}</h2>
        <p>
          You scored <strong style={{ color: 'var(--color-primary-light)' }}>
            {pct}%
          </strong>.
          {passed ? " You have unlocked the next tier of mastery." : " You need at least 80% to level up. Review the study guide and try again!"}
        </p>
        <div className="score-actions" style={{ marginTop: '24px' }}>
          <button className="btn btn-primary" onClick={onBack}>
            Return to Path
          </button>
        </div>
      </div>
    );
  }

  // State 3: Quiz Active
  return (
    <section className="quiz-section" aria-labelledby="quiz-heading">
      <div className="quiz-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiZap color="var(--color-accent)" />
          <h3 id="quiz-heading">Level {level} Practice</h3>
        </div>
        <span className="quiz-q-count">
          {current + 1} / {questions.length}
        </span>
      </div>

      <div className="glass-card quiz-card">
        <p className="quiz-question">{q.question}</p>
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
              {current + 1 < questions.length ? 'Next Question' : 'See Results'}{' '}
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Main StudyPage ──────────────────────────── */
export default function StudyPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subjectFilter = queryParams.get('subject');

  const [activeTopic, setActiveTopic] = useState(null);
  const [viewState, setViewState] = useState('path'); // 'path', 'notes', 'quiz'
  const [activeLevel, setActiveLevel] = useState(1);
  
  // Dynamic notes state
  const [notesContent, setNotesContent] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [notesError, setNotesError] = useState(null);

  // ── Debounced search ──────────────────────────
  const [searchRaw, setSearchRaw] = useState('');
  const searchQuery = useDebounce(searchRaw, 350);

  // ── Throttled Scroll Progress ───────────────────
  const [scrollRaw, setScrollRaw] = useState(0);
  const scrollThrottled = useThrottle(scrollRaw, 100);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollRaw(percentage);
    };
    const el = contentRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => { if (el) el.removeEventListener('scroll', handleScroll); };
  }, [viewState]);

  let filteredTopics = topics.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (subjectFilter) {
    filteredTopics = filteredTopics.filter(t => t.subject === subjectFilter);
  }

  const groupedTopics = filteredTopics.reduce((acc, topic) => {
    if (!acc[topic.subject]) acc[topic.subject] = [];
    acc[topic.subject].push(topic);
    return acc;
  }, {});

  function selectTopic(topic) {
    setActiveTopic(topic);
    setViewState('path');
    setNotesContent('');
  }

  // Auto-select first topic on initial load or filter change
  useEffect(() => {
    if (filteredTopics.length > 0) {
      if (!activeTopic || (subjectFilter && activeTopic.subject !== subjectFilter)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        selectTopic(filteredTopics[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectFilter, activeTopic]);

  // Hook for the currently active topic
  const { mastery, updateMastery, resetMastery } = useMastery(activeTopic?.id || 'default');

  async function handleOpenLevel(level, forceRegenerate = false) {
    setActiveLevel(level);
    setViewState('notes');
    
    // Check cache first if not explicitly regenerating
    if (!forceRegenerate) {
      const cacheKey = `snapstudy_notes_${activeTopic.id}_lvl${level}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setNotesContent(cached);
        return; // Skip API call
      }
    }

    setNotesContent('');
    setIsGeneratingNotes(true);
    setNotesError(null);
    try {
      const content = await generateStudyNotes(activeTopic.title, activeTopic.subject, level);
      
      // Save to cache
      localStorage.setItem(`snapstudy_notes_${activeTopic.id}_lvl${level}`, content);
      
      setNotesContent(content);
    } catch (err) {
      setNotesError(err.message);
    } finally {
      setIsGeneratingNotes(false);
    }
  }

  function handleQuizComplete(score, total) {
    const pct = score / total;
    if (pct >= 0.8 && activeLevel === mastery && mastery < 5) {
      // Force update mastery to current level + 1 if they just beat their highest level
      // The hook does Math.min(5, prev+1), but since we strictly gate, it works out.
      updateMastery(total, total); // Simulate perfect score to force level up in the hook
    }
  }

  if (!activeTopic) {
    return (
      <div className="study-layout">
        <SEO title="Study" description="Adaptive AI Learning" path="/study" />
        <aside className="study-sidebar">
          <div className="sidebar-topics-header"><h2>Topics</h2></div>
          <p className="sidebar-no-results">No topics available.</p>
        </aside>
        <div className="study-content">Select a topic.</div>
      </div>
    );
  }

  const levelTitles = [
    "Beginner", "Novice", "Intermediate", "Advanced", "Elite Master"
  ];

  return (
    <div className="study-layout">
      <SEO 
        title={activeTopic.title} 
        description={`Study notes and AI Quizzes for ${activeTopic.title}.`} 
        path={`/study`} 
      />
      {/* ── Sidebar ── */}
      <aside className="study-sidebar" aria-label="Topic list">
        <div className="sidebar-search-wrap">
          <FiSearch className="sidebar-search-icon" aria-hidden="true" />
          <input
            className="sidebar-search-input"
            type="search"
            placeholder="Search topics…"
            value={searchRaw}
            onChange={e => setSearchRaw(e.target.value)}
          />
        </div>

        {subjectFilter && (
          <div style={{ marginTop: '16px', marginBottom: '8px' }}>
            <Link to="/study" className="btn btn-ghost" style={{ fontSize: '0.85rem', padding: '8px', width: '100%', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
              <FiRotateCcw style={{ marginRight: '6px' }} /> Clear Subject Filter
            </Link>
          </div>
        )}

        <div className="topic-list-container" style={{ marginTop: '16px' }}>
          {Object.keys(groupedTopics).map(subjectName => (
            <div key={subjectName} className="sidebar-subject-group" style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '8px' }}>
                {subjectName}
              </h4>
              <ul className="topic-list" role="list">
                {groupedTopics[subjectName].map(topic => (
                  <li key={topic.id}>
                    <button
                      className={`topic-btn${activeTopic?.id === topic.id ? ' active' : ''}`}
                      onClick={() => selectTopic(topic)}
                    >
                      <span className="topic-btn-icon">{topic.icon}</span>
                      <span>{topic.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="study-content" ref={contentRef} style={{ overflowY: 'auto', height: 'calc(100vh - var(--nav-height))' }}>
        
        {viewState === 'notes' && (
          <div style={{ position: 'sticky', top: 0, left: 0, right: 0, height: '3px', background: 'var(--bg-surface)', zIndex: 10, marginBottom: '20px' }}>
            <div style={{ height: '100%', width: `${scrollThrottled}%`, background: 'var(--color-primary-light)', transition: 'width 0.1s linear' }} />
          </div>
        )}

        <header className="study-topic-header">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-primary">{activeTopic.subject}</span>
            <span className="badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.3)' }}>
              Mastery: {mastery}/5
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 id="study-topic-heading">
              {activeTopic.icon} {activeTopic.title}
            </h1>
            {mastery > 1 && viewState === 'path' && (
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to completely reset your progress for this topic? You will lose access to higher level notes until you pass the quizzes again.")) {
                    resetMastery();
                  }
                }}
                className="btn btn-ghost" 
                style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)', marginTop: '16px' }}
                title="Reset progress to Level 1"
              >
                <FiRotateCcw /> Reset Progress
              </button>
            )}
          </div>
        </header>

        {/* ── VIEW: Path to Mastery ── */}
        {viewState === 'path' && (
          <div className="path-container" style={{ padding: '20px 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
              Select a tier below. You must pass the AI quiz at the end of each study guide to unlock the next level of mastery.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3, 4, 5].map((level, i) => {
                const isUnlocked = level <= mastery;
                const isCurrent = level === mastery;
                
                return (
                  <div 
                    key={level}
                    className={`glass-card ${!isUnlocked ? 'locked' : ''}`}
                    style={{ 
                      padding: '24px', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: isCurrent ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                      opacity: isUnlocked ? 1 : 0.5,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        {isUnlocked ? <FiUnlock color="var(--color-success)" /> : <FiLock color="var(--text-muted)" />}
                        Level {level}: {levelTitles[i]}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                        {isUnlocked ? "Study the AI-generated guide and take the quiz." : "Locked. Pass previous level to access."}
                      </p>
                    </div>
                    <button 
                      className={`btn ${isCurrent ? 'btn-primary' : 'btn-ghost'}`}
                      disabled={!isUnlocked}
                      onClick={() => handleOpenLevel(level)}
                    >
                      <FiBookOpen /> {isUnlocked ? 'Read Guide' : 'Locked'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── VIEW: AI Notes ── */}
        {viewState === 'notes' && (
          <div className="notes-container" style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <button onClick={() => setViewState('path')} className="btn btn-ghost" style={{ padding: '8px' }}>
                <FiArrowLeft /> Back to Path
              </button>
              <button 
                onClick={() => handleOpenLevel(activeLevel, true)} 
                className="btn btn-ghost" 
                style={{ padding: '8px' }} 
                disabled={isGeneratingNotes}
              >
                <FiRotateCcw /> Regenerate Guide
              </button>
            </div>
            
            <div className="glass-card" style={{ padding: '40px' }}>
              {isGeneratingNotes ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="loader-spinner" style={{ width: '48px', height: '48px', margin: '0 auto 24px auto', borderColor: 'rgba(255,255,255,0.1)', borderTopColor: 'var(--color-primary-light)' }} />
                  <h3>Generating Level {activeLevel} Study Guide...</h3>
                  <p style={{ color: 'var(--text-muted)' }}>The AI is writing a highly detailed, 1000+ word explanation tailored to your skill level.</p>
                </div>
              ) : notesError ? (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '16px', borderRadius: '8px' }}>
                  <strong>Error:</strong> {notesError}
                  <br /><br />
                  <button className="btn btn-primary" onClick={() => handleOpenLevel(activeLevel)}>Try Again</button>
                </div>
              ) : (
                <>
                  <MarkdownRenderer content={notesContent} />
                  
                  <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <h2>Ready to Test Your Knowledge?</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                      Pass the quiz with an 80% or higher to {activeLevel === 5 ? "complete this topic" : "unlock the next mastery level"}.
                    </p>
                    <button className="btn btn-primary" onClick={() => setViewState('quiz')} style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
                      <FiZap /> Take Level {activeLevel} Quiz
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── VIEW: Quiz ── */}
        {viewState === 'quiz' && (
          <QuizSection 
            topic={activeTopic} 
            level={activeLevel} 
            onComplete={handleQuizComplete} 
            onBack={() => setViewState('path')}
          />
        )}

      </div>
    </div>
  );
}
