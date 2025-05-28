import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test';

import {
  formatFilenameDate,
  getDateFilename,
  getTodayFilename,
  isToday,
  parseFilenameToDate,
} from './utils';

describe('date handling', () => {
  const OriginalDate = Date;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.Date = OriginalDate;
  });

  describe('getTodayFilename', () => {
    it('should return correct filename for today', () => {
      const mockDate = new Date('2025-01-15T10:00:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(getTodayFilename()).toBe('01-15-25.md');
    });

    it('should handle single digit months and days correctly', () => {
      const mockDate = new Date('2025-03-05T10:00:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(getTodayFilename()).toBe('03-05-25.md');
    });

    it('should handle double digit months and days correctly', () => {
      const mockDate = new Date('2025-12-25T10:00:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(getTodayFilename()).toBe('12-25-25.md');
    });

    it('should handle year transition correctly', () => {
      const mockDate = new Date('2030-01-01T10:00:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(getTodayFilename()).toBe('01-01-30.md');
    });

    it('should handle leap year correctly', () => {
      const mockDate = new Date('2024-02-29T10:00:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(getTodayFilename()).toBe('02-29-24.md');
    });
  });

  describe('getDateFilename', () => {
    it('should convert Date to correct filename format', () => {
      expect(getDateFilename(new Date('2025-01-15T10:00:00Z'))).toBe(
        '01-15-25.md'
      );
    });

    it('should handle single digit months and days', () => {
      expect(getDateFilename(new Date('2025-03-05T10:00:00Z'))).toBe(
        '03-05-25.md'
      );
    });

    it('should handle end of year dates', () => {
      expect(getDateFilename(new Date('2025-12-31T10:00:00Z'))).toBe(
        '12-31-25.md'
      );
    });

    it('should handle beginning of year dates', () => {
      expect(getDateFilename(new Date('2025-01-01T10:00:00Z'))).toBe(
        '01-01-25.md'
      );
    });

    it('should handle leap year dates', () => {
      expect(getDateFilename(new Date('2024-02-29T10:00:00Z'))).toBe(
        '02-29-24.md'
      );
    });

    it('should handle different years correctly', () => {
      expect(getDateFilename(new Date('2030-06-15T10:00:00Z'))).toBe(
        '06-15-30.md'
      );

      expect(getDateFilename(new Date('2099-12-31T10:00:00Z'))).toBe(
        '12-31-99.md'
      );
    });
  });

  describe('parseFilenameToDate', () => {
    it('should parse filename to correct Date object', () => {
      const result = parseFilenameToDate('01-15-25.md');
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January is 0
      expect(result.getDate()).toBe(15);
    });

    it('should handle filename without .md extension', () => {
      const result = parseFilenameToDate('03-05-25');
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(2); // March is 2
      expect(result.getDate()).toBe(5);
    });

    it('should handle end of year dates', () => {
      const result = parseFilenameToDate('12-31-25.md');
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(11); // December is 11
      expect(result.getDate()).toBe(31);
    });

    it('should handle leap year dates', () => {
      const result = parseFilenameToDate('02-29-24.md');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1); // February is 1
      expect(result.getDate()).toBe(29);
    });

    it('should handle different year formats', () => {
      expect(parseFilenameToDate('06-15-30.md').getFullYear()).toBe(2030);
      expect(parseFilenameToDate('12-31-99.md').getFullYear()).toBe(2099);
    });

    it('should be reversible with getDateFilename', () => {
      const originalDate = new Date('2025-07-04T10:00:00Z');
      const filename = getDateFilename(originalDate);
      const parsedDate = parseFilenameToDate(filename);
      expect(parsedDate.getFullYear()).toBe(originalDate.getFullYear());
      expect(parsedDate.getMonth()).toBe(originalDate.getMonth());
      expect(parsedDate.getDate()).toBe(originalDate.getDate());
    });
  });

  describe('formatFilenameDate', () => {
    it('should format filename with default options', () => {
      expect(formatFilenameDate('01-15-25.md')).toMatch(
        /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), Jan 15, 2025$/
      );
    });

    it('should format filename with custom options', () => {
      expect(
        formatFilenameDate('01-15-25.md', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      ).toBe('January 15, 2025');
    });

    it('should handle different date formats', () => {
      expect(
        formatFilenameDate('12-31-25.md', {
          month: 'short',
          day: 'numeric',
        })
      ).toBe('Dec 31');
    });

    it('should handle leap year dates', () => {
      expect(
        formatFilenameDate('02-29-24.md', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      ).toBe('February 29, 2024');
    });

    it('should handle various formatting options', () => {
      const filename = '07-04-25.md';

      expect(
        formatFilenameDate(filename, {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        })
      ).toBe('7/4/2025');

      expect(
        formatFilenameDate(filename, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      ).toMatch(
        /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), July 4, 2025$/
      );
    });
  });

  describe('isToday', () => {
    it("should return true for today's filename", () => {
      const mockDate = new Date('2025-01-15T10:00:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(isToday('01-15-25.md')).toBe(true);
    });

    it("should return false for yesterday's filename", () => {
      const mockDate = new Date('2025-01-15T10:00:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(isToday('01-14-25.md')).toBe(false);
    });

    it("should return false for tomorrow's filename", () => {
      const mockDate = new Date('2025-01-15T10:00:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(isToday('01-16-25.md')).toBe(false);
    });

    it('should return false for different year', () => {
      const mockDate = new Date('2025-01-15T10:00:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(isToday('01-15-24.md')).toBe(false);
    });

    it('should handle edge cases around midnight', () => {
      const mockDate = new Date('2025-01-15T23:59:59Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(isToday('01-15-25.md')).toBe(true);
    });

    it('should be consistent with getTodayFilename', () => {
      const mockDate = new Date('2025-07-04T15:30:00Z');

      const MockDate = jest.fn(() => mockDate) as jest.Mock & DateConstructor;
      MockDate.now = jest.fn(() => mockDate.getTime());
      global.Date = MockDate;

      expect(isToday(getTodayFilename())).toBe(true);
    });
  });
});
