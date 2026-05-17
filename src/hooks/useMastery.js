import { useState, useEffect } from 'react';

/**
 * Custom hook to track a user's mastery score for a specific topic.
 * Mastery ranges from 1 (Novice) to 5 (Expert).
 * Uses localStorage to persist data across sessions.
 */
export function useMastery(topicId) {
  const [mastery, setMastery] = useState(() => {
    try {
      const stored = localStorage.getItem(`snapstudy_mastery_${topicId}`);
      return stored ? parseInt(stored, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Explicitly resync state when topicId changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`snapstudy_mastery_${topicId}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMastery(stored ? parseInt(stored, 10) : 1);
    } catch {
      setMastery(1);
    }
  }, [topicId]);

  /**
   * Updates mastery based on quiz performance.
   * @param {number} score - The number of correct answers
   * @param {number} total - The total number of questions
   */
  const updateMastery = (score, total) => {
    const percentage = score / total;
    setMastery(prev => {
      let newMastery = prev;
      
      if (percentage >= 0.8) {
        // Great performance, increase mastery (max 5)
        newMastery = Math.min(5, prev + 1);
      } else if (percentage < 0.5) {
        // Poor performance, decrease mastery (min 1)
        newMastery = Math.max(1, prev - 1);
      }
      
      // Persist the new mastery to local storage immediately
      try {
        localStorage.setItem(`snapstudy_mastery_${topicId}`, newMastery);
      } catch {
        console.warn("Could not save to localStorage");
      }
      
      return newMastery;
    });
  };

  /**
   * Resets the mastery score back to 1.
   */
  const resetMastery = () => {
    setMastery(1);
    try {
      localStorage.setItem(`snapstudy_mastery_${topicId}`, 1);
    } catch {
      console.warn("Could not save to localStorage");
    }
  };

  return { mastery, updateMastery, resetMastery };
}
