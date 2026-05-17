import { useState, useEffect, useRef } from 'react';

/**
 * useThrottle — limits the rate at which a function or state updates.
 * Guarantees that the value updates at most once every `limit` milliseconds.
 *
 * @param {any}    value  - The value to throttle
 * @param {number} limit  - The minimum time between updates in milliseconds
 * @returns {any}           The throttled value
 */
export function useThrottle(value, limit = 200) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(null);

  useEffect(() => {
    const now = Date.now();
    if (lastUpdated.current === null) {
      lastUpdated.current = now;
    }
    
    // If enough time has passed, update immediately
    if (now - lastUpdated.current >= limit) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      // Otherwise, schedule an update for the end of the window
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, limit - (now - lastUpdated.current));
      
      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}
