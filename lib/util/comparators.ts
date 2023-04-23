import type { Interval } from "luxon";

// Comparators return positive if a > b, negative if a < b, and 0 if a === b

/**
 * This comparator considers the UTC timestamp of the intervals.
 *
 * Algorithm:
 * 1. Set null starts to 0 and null ends to Infinity
 * 2. If the intervals are equal, return 0
 * 2. If the intervals don't overlap, return the difference between the start and end times (signed)
 * 3. If the intervals do overlap, return the difference between the start times (signed) if they are different
 * 4. Otherwise, return the difference between the end times (signed)
 *
 * @param a The first interval
 * @param b The second interval
 * @return A number representing the difference between the intervals
 */
export function intervalSorter(a: Interval, b: Interval): number {
  if (a.equals(b)) {
    return 0;
  }

  const aStart = a.start?.toMillis() ?? 0;
  const aEnd = a.end?.toMillis() ?? Number.POSITIVE_INFINITY;
  const bStart = b.start?.toMillis() ?? 0;
  const bEnd = b.end?.toMillis() ?? Number.POSITIVE_INFINITY;

  if (aEnd < bStart) {
    // If a ends before b starts, return by how much
    return bStart - aEnd;
  } else if (aStart > bEnd) {
    // If a starts after b ends, return by how much
    return bEnd - aStart;
  } else if (aStart !== bStart) {
    return bStart - aStart;
  } else {
    return bEnd - aEnd;
  }
}
