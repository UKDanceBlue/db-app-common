import { describe, expect, test } from "@jest/globals";
import { DateTime, Interval } from "luxon";

import { intervalSorter } from "../../lib/util/comparators";

describe("intervalSorter", () => {
  test("should return 0 if the intervals are the same", () => {
    const interval = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2021, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2021, month: 1, day: 2 })
    );
    expect(intervalSorter(interval, interval)).toBe(0);
  });

  test("should return a positive number if the first interval is after the second", () => {
    const interval1 = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2021, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2021, month: 1, day: 2 })
    );
    const interval2 = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2021, month: 1, day: 2 }),
      DateTime.fromObject({ year: 2021, month: 1, day: 3 })
    );
    expect(intervalSorter(interval1, interval2)).toBeGreaterThan(0);
  });

  test("should return a negative number if the first interval is before the second", () => {
    const interval1 = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2021, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2021, month: 1, day: 2 })
    );
    const interval2 = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2021, month: 1, day: 2 }),
      DateTime.fromObject({ year: 2021, month: 1, day: 3 })
    );
    expect(intervalSorter(interval2, interval1)).toBeLessThan(0);
  });

  test("should return a positive number if the first interval starts after the second", () => {
    const interval1 = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2021, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2021, month: 1, day: 2 })
    );
    const interval2 = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2021, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2021, month: 1, day: 3 })
    );
    expect(intervalSorter(interval1, interval2)).toBeGreaterThan(0);
  });

  test("should return a negative number if the first interval starts before the second", () => {
    const interval1 = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2021, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2021, month: 1, day: 2 })
    );
    const interval2 = Interval.fromDateTimes(
      DateTime.fromObject({ year: 2021, month: 1, day: 1 }),
      DateTime.fromObject({ year: 2021, month: 1, day: 3 })
    );
    expect(intervalSorter(interval2, interval1)).toBeLessThan(0);
  });
});
