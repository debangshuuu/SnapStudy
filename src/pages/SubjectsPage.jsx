import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDebounce } from '../hooks/useDebounce';
import SEO from '../components/seo/SEO';
import './SubjectsPage.css';

// ── Database ──────────────────────────────────────
const MOCK_SUBJECTS_DB = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    filterCode: 'DSA',
    icon: '💻',
    topicsCount: 9,
    difficulty: 'Intermediate',
    description: 'Master the fundamentals of problem-solving, complexity analysis, complete search, sorting, binary search, and recursion.'
  },
  {
    id: 'wap',
    title: 'Web Advanced Programming',
    filterCode: 'WAP',
    icon: '🌐',
    topicsCount: 10,
    difficulty: 'Advanced',
    description: 'Deep dive into advanced JavaScript concepts, data types, control flow, array methods, objects, higher-order functions, and callbacks.'
  },
  {
    id: 'math',
    title: 'Mathematics (IA-1)',
    filterCode: 'Mathematics (IA-1)',
    icon: '📐',
    topicsCount: 5,
    difficulty: 'Hard',
    description: 'Counting & Combinatorics, Set Theory, Probability, Bayes Theorem, Calculus Revision, and Random Variables.'
  },
  {
    id: 'chem',
    title: 'Applied Chemistry',
    filterCode: 'Applied Chemistry',
    icon: '🧪',
    topicsCount: 23,
    difficulty: 'Intermediate',
    description: 'Organic semiconductors, memory devices, display systems, quantum dots, and polymers.'
  },
  {
    id: 'eng',
    title: 'English & Communication',
    filterCode: 'English & Communication',
    icon: '📝',
    topicsCount: 3,
    difficulty: 'Beginner',
    description: 'Sentence Structure, Tenses, Complex Sentences, Conjunctions, and Mock Interview Basics.'
  }
];

// Simulated API Call
const fetchSubjectsPage = async (page, limit = 9, query = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Filter by query
      const filteredDb = MOCK_SUBJECTS_DB.filter(subj => 
        subj.title.toLowerCase().includes(query.toLowerCase()) ||
        subj.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // 2. Paginate
      const start = (page - 1) * limit;
      const end = start + limit;
      resolve({
        data: filteredDb.slice(start, end),
        hasMore: end < filteredDb.length
      });
    }, 150); // slight simulated delay
  });
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Search State
  const [searchRaw, setSearchRaw] = useState('');
  const searchQuery = useDebounce(searchRaw, 350);

  // When search query changes, reset everything and fetch page 1
  useEffect(() => {
    let ignore = false;
    async function resetAndFetch() {
      setIsInitialLoad(true);
      const response = await fetchSubjectsPage(1, 9, searchQuery);
      if (!ignore) {
        setSubjects(response.data);
        setHasMore(response.hasMore);
        setPage(2); // Next page to load will be 2
        setIsInitialLoad(false);
      }
    }
    resetAndFetch();
    return () => { ignore = true; };
  }, [searchQuery]);

  // Load next page function (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (!hasMore || isInitialLoad) return;
    const response = await fetchSubjectsPage(page, 9, searchQuery);
    setSubjects(prev => [...prev, ...response.data]);
    setHasMore(response.hasMore);
    setPage(p => p + 1);
  }, [page, hasMore, isInitialLoad, searchQuery]);

  // Hook up infinite scroll
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !isInitialLoad);

  return (
    <div className="subjects-page container">
      <SEO 
        title="Browse Subjects" 
        description="Browse through the complete catalog of computer science and technology subjects available on SnapStudy." 
        path="/subjects" 
      />
      <header className="subjects-header">
        <span className="badge badge-primary">Course Catalog</span>
        <h1>All Subjects</h1>
        <p className="text-secondary">
          Browse through all available modules. Scroll down to load more subjects from the database.
        </p>
        
        {/* Added Search Bar */}
        <div className="subjects-search-container" style={{ marginTop: '24px', maxWidth: '400px', marginInline: 'auto' }}>
          <div className="sidebar-search-wrap" style={{ margin: 0 }}>
            <FiSearch className="sidebar-search-icon" aria-hidden="true" />
            <input
              id="global-subject-search"
              className="sidebar-search-input"
              type="search"
              placeholder="Search subjects (e.g., DSA, Web)..."
              value={searchRaw}
              onChange={e => setSearchRaw(e.target.value)}
              aria-label="Search subjects"
              autoComplete="off"
            />
            {searchRaw !== searchQuery && (
              <span className="sidebar-search-typing" aria-hidden="true" title="Filtering…">⏳</span>
            )}
          </div>
        </div>
      </header>

      <div className="subjects-grid" style={{ marginTop: '40px' }}>
        {subjects.length === 0 && !isInitialLoad && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No subjects match your search.
          </div>
        )}
        {subjects.map((subj) => (
          <article key={subj.id} className="glass-card subject-card">
            <div className="subject-card-icon" aria-hidden="true">
              {subj.icon}
            </div>
            <h3>{subj.title}</h3>
            <div className="subject-card-meta">
              {subj.topicsCount} topics &nbsp;·&nbsp; {subj.difficulty}
            </div>
            <p className="subject-card-desc">{subj.description}</p>
            <Link to={`/study?subject=${encodeURIComponent(subj.filterCode)}`} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
              View Course <FiArrowRight />
            </Link>
          </article>
        ))}
      </div>

      {/* Infinite Scroll Sentinel / Loading Indicator */}
      {hasMore && !isInitialLoad && (
        <div ref={sentinelRef} className="infinite-scroll-sentinel">
          <div className="loader-spinner" aria-label="Loading more subjects..." />
          <span>Loading more modules...</span>
        </div>
      )}
      
      {!hasMore && subjects.length > 0 && (
        <div className="end-of-list">
          You've reached the end of the catalog.
        </div>
      )}
    </div>
  );
}
