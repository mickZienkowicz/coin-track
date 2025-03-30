import { Interval, RecurrenceType } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { getUtcMiddayDateOfGivenDate } from '../get-utc-midday-date-of-given-date';
import { getOccurrencesInTimeframe } from './get-occurances-in-timeframe';

describe('getOccurrencesInTimeframe', () => {
  describe('ONE_TIME items', () => {
    it('should return single occurrence for ONE_TIME item within timeframe', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-03-15')),
          recurrence: RecurrenceType.ONE_TIME
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-03-31')),
        items
      );

      expect(result[0].occurrences).toEqual([
        getUtcMiddayDateOfGivenDate(new Date('2024-03-15'))
      ]);
    });

    it('should return empty occurrences for ONE_TIME item outside timeframe', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-04-15')),
          recurrence: RecurrenceType.ONE_TIME
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-03-31')),
        items
      );

      expect(result[0].occurrences).toEqual([]);
    });

    it('should not include occurrence if item is stopped before occurrence date', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-03-15')),
          recurrence: RecurrenceType.ONE_TIME,
          stoppedAt: getUtcMiddayDateOfGivenDate(new Date('2024-03-14'))
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-03-31')),
        items
      );

      expect(result[0].occurrences).toEqual([]);
    });
  });

  describe('MULTIPLE items', () => {
    it('should return correct occurrences for MULTIPLE item with repeatCount', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-01-15')),
          recurrence: RecurrenceType.MULTIPLE,
          repeatCount: 3,
          repeatEvery: Interval.MONTH
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-12-31')),
        items
      );

      expect(result[0].occurrences).toEqual([
        getUtcMiddayDateOfGivenDate(new Date('2024-01-15')),
        getUtcMiddayDateOfGivenDate(new Date('2024-02-15')),
        getUtcMiddayDateOfGivenDate(new Date('2024-03-15'))
      ]);
    });

    it('should respect timeframe boundaries for MULTIPLE items', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-01-15')),
          recurrence: RecurrenceType.MULTIPLE,
          repeatCount: 6,
          repeatEvery: Interval.MONTH
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-05-31')),
        items
      );

      expect(result[0].occurrences).toEqual([
        getUtcMiddayDateOfGivenDate(new Date('2024-03-15')),
        getUtcMiddayDateOfGivenDate(new Date('2024-04-15')),
        getUtcMiddayDateOfGivenDate(new Date('2024-05-15'))
      ]);
    });
  });

  describe('INFINITE items', () => {
    it('should return all occurrences within timeframe for INFINITE item', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-01-15')),
          recurrence: RecurrenceType.INFINITE,
          repeatEvery: Interval.MONTH
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-05-31')),
        items
      );

      expect(result[0].occurrences).toEqual([
        getUtcMiddayDateOfGivenDate(new Date('2024-03-15')),
        getUtcMiddayDateOfGivenDate(new Date('2024-04-15')),
        getUtcMiddayDateOfGivenDate(new Date('2024-05-15'))
      ]);
    });

    it('should respect stoppedAt date for INFINITE items', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-01-15')),
          recurrence: RecurrenceType.INFINITE,
          repeatEvery: Interval.MONTH,
          stoppedAt: getUtcMiddayDateOfGivenDate(new Date('2024-04-01'))
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-05-31')),
        items
      );

      expect(result[0].occurrences).toEqual([
        getUtcMiddayDateOfGivenDate(new Date('2024-03-15'))
      ]);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty items array', () => {
      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-03-31')),
        []
      );

      expect(result).toEqual([]);
    });

    it('should handle items without repeatEvery for MULTIPLE/INFINITE', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-03-15')),
          recurrence: RecurrenceType.MULTIPLE
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-03-31')),
        items
      );

      expect(result[0].occurrences).toEqual([]);
    });

    it('should handle different interval types', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
          recurrence: RecurrenceType.INFINITE,
          repeatEvery: Interval.DAY
        },
        {
          id: '2',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
          recurrence: RecurrenceType.INFINITE,
          repeatEvery: Interval.WEEK
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-03-05')),
        items
      );

      expect(result[0].occurrences.length).toBe(5); // Daily occurrences
      expect(result[1].occurrences.length).toBe(1); // Weekly occurrences
    });

    it('should preserve original item properties', () => {
      const items = [
        {
          id: '1',
          date: getUtcMiddayDateOfGivenDate(new Date('2024-03-15')),
          recurrence: RecurrenceType.ONE_TIME,
          customProperty: 'test'
        }
      ];

      const result = getOccurrencesInTimeframe(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01')),
        getUtcMiddayDateOfGivenDate(new Date('2024-03-31')),
        items
      );

      expect(result[0]).toEqual({
        ...items[0],
        occurrences: [getUtcMiddayDateOfGivenDate(new Date('2024-03-15'))]
      });
    });
  });
});
