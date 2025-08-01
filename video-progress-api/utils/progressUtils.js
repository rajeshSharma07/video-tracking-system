/**
 * Merge overlapping intervals
 * @param {Array} intervals - Array of intervals with start and end times
 * @returns {Array} - Merged intervals
 */
exports.mergeIntervals = (intervals) => {
  if (!intervals || intervals.length === 0) return [];

  // Sort intervals by start time
  const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);

  const result = [sortedIntervals[0]];

  for (let i = 1; i < sortedIntervals.length; i++) {
    const current = sortedIntervals[i];
    const lastMerged = result[result.length - 1];

    // If current interval overlaps with the last merged interval, merge them
    if (current.start <= lastMerged.end + 1) {
      lastMerged.end = Math.max(lastMerged.end, current.end);
    } else {
      // Otherwise, add the current interval to the result
      result.push(current);
    }
  }

  return result;
};

/**
 * Calculate total unique watched time from intervals
 * @param {Array} intervals - Array of merged intervals with start and end times
 * @returns {Number} - Total unique watched time in seconds
 */
exports.calculateUniqueWatchedTime = (intervals) => {
  if (!intervals || intervals.length === 0) return 0;

  return intervals.reduce((total, interval) => {
    return total + (interval.end - interval.start + 1);
  }, 0);
};

/**
 * Check if a specific time has been watched
 * @param {Array} intervals - Array of watched intervals
 * @param {Number} time - Time to check
 * @returns {Boolean} - Whether the time has been watched
 */
exports.isTimeWatched = (intervals, time) => {
  if (!intervals || intervals.length === 0) return false;

  return intervals.some(interval => time >= interval.start && time <= interval.end);
};

/**
 * Get unwatched segments
 * @param {Array} intervals - Array of watched intervals
 * @param {Number} duration - Total video duration
 * @returns {Array} - Array of unwatched segments
 */
exports.getUnwatchedSegments = (intervals, duration) => {
  if (!intervals || intervals.length === 0) {
    return [{ start: 0, end: duration - 1 }];
  }

  const mergedIntervals = exports.mergeIntervals(intervals);
  const unwatched = [];

  // Check if there's an unwatched segment at the beginning
  if (mergedIntervals[0].start > 0) {
    unwatched.push({ start: 0, end: mergedIntervals[0].start - 1 });
  }

  // Check for unwatched segments between watched intervals
  for (let i = 0; i < mergedIntervals.length - 1; i++) {
    if (mergedIntervals[i].end + 1 < mergedIntervals[i + 1].start) {
      unwatched.push({
        start: mergedIntervals[i].end + 1,
        end: mergedIntervals[i + 1].start - 1
      });
    }
  }

  // Check if there's an unwatched segment at the end
  const lastInterval = mergedIntervals[mergedIntervals.length - 1];
  if (lastInterval.end < duration - 1) {
    unwatched.push({ start: lastInterval.end + 1, end: duration - 1 });
  }

  return unwatched;
};