import { Interval } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { getUtcMiddayDateOfGivenDate } from '../get-utc-midday-date-of-given-date';
import { getCurrentBudgetPeriod } from './get-current-budget-period';

describe('getCurrentBudgetPeriod', () => {
  describe('Daily intervals', () => {
    it('should calculate correct daily period when budget starts in the past', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-01-26'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2024-01-24')
      );

      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.DAY,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-26'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-26'))
      );
    });
  });

  describe('Weekly intervals', () => {
    it('should calculate correct weekly period', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-01-26'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2024-01-15')
      );

      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.WEEK,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-22'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-28'))
      );
    });
  });

  describe('Two weeks intervals', () => {
    it('should calculate correct two-week period', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-01-26'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2024-01-01')
      );

      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.TWO_WEEKS,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-15'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-28'))
      );
    });
  });

  describe('Monthly intervals', () => {
    it('should calculate correct monthly period', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-01-26'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2023-12-15')
      );

      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.MONTH,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-15'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-02-14'))
      );
    });

    it('should handle month transitions correctly', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2025-03-15'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2025-01-20')
      );

      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.MONTH,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2025-02-20'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2025-03-19'))
      );
    });
  });

  describe('Two months intervals', () => {
    it('should calculate correct two-month period', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-03-15'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2024-01-01')
      );

      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.TWO_MONTHS,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-01'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-04-30'))
      );
    });
  });

  describe('Quarterly intervals', () => {
    it('should calculate correct quarter period', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-02-15'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2024-01-01')
      );

      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.QUARTER,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-01'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-03-31'))
      );
    });
  });

  describe('Yearly intervals', () => {
    it('should calculate correct yearly period', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-06-15'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2024-01-01')
      );

      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.YEAR,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-01'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-12-31'))
      );
    });

    it('should handle leap years correctly', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-02-29'));

      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2024-02-29')
      );
      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.YEAR,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-02-29'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2025-02-27'))
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle same start and current date', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-01-01'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2024-01-01')
      );

      const result = getCurrentBudgetPeriod(
        budgetStartDate,
        Interval.MONTH,
        mockToday
      );

      expect(result.startDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-01'))
      );
      expect(result.endDate).toEqual(
        getUtcMiddayDateOfGivenDate(new Date('2024-01-31'))
      );
    });

    it('should throw error for invalid interval', () => {
      const mockToday = getUtcMiddayDateOfGivenDate(new Date('2024-01-01'));
      const budgetStartDate = getUtcMiddayDateOfGivenDate(
        new Date('2024-01-01')
      );
      expect(() => {
        getCurrentBudgetPeriod(
          budgetStartDate,
          'INVALID' as Interval,
          mockToday
        );
      }).toThrow('Invalid interval');
    });
  });
});
