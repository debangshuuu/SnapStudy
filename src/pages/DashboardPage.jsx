import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiTarget, FiZap, FiAward, FiArrowRight, FiActivity } from 'react-icons/fi';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { topics } from '../data/topics';
import SEO from '../components/seo/SEO';
import './DashboardPage.css';

export default function DashboardPage() {
  // Aggregate data
  const { 
    subjectStats, 
    overallAverage, 
    eliteMasteries, 
    weakTopics,
    ringData,
    progressPercentage
  } = useMemo(() => {
    // 1. Group topics by subject and fetch scores
    const subjectMap = {};
    let totalScore = 0;
    let eliteCount = 0;
    const allScoredTopics = [];

    topics.forEach(topic => {
      const stored = localStorage.getItem(`snapstudy_mastery_${topic.id}`);
      const score = stored ? parseInt(stored, 10) : 1;
      
      if (!subjectMap[topic.subject]) {
        subjectMap[topic.subject] = { total: 0, count: 0, subject: topic.subject };
      }
      
      subjectMap[topic.subject].total += score;
      subjectMap[topic.subject].count += 1;
      totalScore += score;
      
      if (score === 5) eliteCount++;
      
      allScoredTopics.push({ ...topic, score });
    });

    // 2. Format for Radar Chart & Progress Bars
    const subjectStats = Object.values(subjectMap).map(s => {
      let shortName = s.subject;
      if (shortName === 'Mathematics (IA-1)') shortName = 'Math';
      if (shortName === 'Applied Chemistry') shortName = 'Chemistry';
      if (shortName === 'English & Communication') shortName = 'English';

      return {
        subject: shortName,
        fullSubject: s.subject,
        average: Number((s.total / s.count).toFixed(1)),
        max: 5
      };
    });

    // 3. Overall stats
    const overallAverage = Number((totalScore / topics.length).toFixed(1));

    // 4. Weak topics (sort by score ascending, then by title)
    const weakTopics = allScoredTopics
      .filter(t => t.score < 5)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    // 5. Progress Ring Data
    const progressPercentage = Math.round((totalScore / (topics.length * 5)) * 100);
    const ringData = [
      { name: 'Mastered', value: progressPercentage, color: '#6366F1' },
      { name: 'Remaining', value: 100 - progressPercentage, color: 'rgba(255, 255, 255, 0.05)' }
    ];

    return { subjectStats, overallAverage, eliteMasteries: eliteCount, weakTopics, ringData, progressPercentage };
  }, []);

  return (
    <div className="dashboard-page container fade-in">
      <SEO title="Dashboard" description="Analyze your learning progress and mastery." path="/dashboard" />
      
      <header className="dashboard-header">
        <h1>Your Progress Hub</h1>
      </header>

      {/* Top Stats */}
      <section className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon accent"><FiZap /></div>
          <div className="stat-content">
            <h3>Current Streak</h3>
            <p>3 Days</p>
          </div>
        </div>
        
        <div className="glass-card stat-card">
          <div className="stat-icon primary"><FiActivity /></div>
          <div className="stat-content">
            <h3>Overall Mastery</h3>
            <p>{overallAverage} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>/ 5.0</span></p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon success"><FiAward /></div>
          <div className="stat-content">
            <h3>Elite Masteries</h3>
            <p>{eliteMasteries} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>Topics</span></p>
          </div>
        </div>
      </section>

      {/* Main Charts */}
      <section className="charts-grid">
        {/* Mastery Web */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}><FiTarget /> Mastery Web</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={subjectStats}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                <Radar name="Mastery" dataKey="average" stroke="var(--color-primary-light)" fill="var(--color-primary)" fillOpacity={0.5} />
                <Tooltip contentStyle={{ background: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Progress Ring */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}><FiBarChart2 /> Completion</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ringData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={110}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {ringData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ background: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text in Donut */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1' }}>
                {progressPercentage}%
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mastered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Insights */}
      <section className="insights-grid">
        {/* Subject Progress Bars */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}><FiBarChart2 /> Subject Progress</h3>
          <div className="subject-progress-list" style={{ marginTop: '24px' }}>
            {subjectStats.map(stat => (
              <div key={stat.fullSubject} className="subject-progress-item">
                <div className="progress-label">
                  <span>{stat.fullSubject}</span>
                  <span style={{ color: 'var(--color-primary-light)' }}>{stat.average} / 5</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(stat.average / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics to Revise */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}><FiTarget style={{ color: '#EF4444' }} /> Weak Topics</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Focus your study sessions on these areas to boost your overall score.
          </p>
          <div className="weak-topics-list">
            {weakTopics.length > 0 ? (
              weakTopics.map(topic => (
                <div key={topic.id} className="weak-topic-card">
                  <div className="weak-topic-info">
                    <h4>{topic.icon} {topic.title}</h4>
                    <p>Level {topic.score} ({topic.subject})</p>
                  </div>
                  <Link 
                    to={`/study?subject=${encodeURIComponent(topic.subject)}`} 
                    className="btn btn-ghost"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    Revise <FiArrowRight />
                  </Link>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                You have mastered everything perfectly! 🎉
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
