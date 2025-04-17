import { Interval, RecurrenceType } from '@prisma/client';

import { getGoalOutcomes } from './get-goal-outcomes';

describe('getGoalOutcomes', () => {
  const goalName = 'Test Goal';

  it('should split amount correctly for daily interval', async () => {
    const startDate = new Date('2024-04-14T12:00:00Z');
    const endDate = new Date('2024-04-22T12:00:00Z');
    const missingAmount = 800; // 8 days * 100 cents

    const outcomes = await getGoalOutcomes({
      goalName,
      startDate,
      endDate,
      savingInterval: Interval.DAY,
      missingAmount
    });

    expect(outcomes).toHaveLength(8);
    expect(outcomes[0].date).toEqual(endDate);
    expect(outcomes[7].date).toEqual(new Date('2024-04-15T12:00:00Z'));
    expect(outcomes[7].valueCents).toBe(100);
    expect(outcomes[0].name).toBe(goalName);
    expect(outcomes[0].recurrence).toBe(RecurrenceType.ONE_TIME);
  });

  it('should split amount correctly for weekly interval', async () => {
    const startDate = new Date('2024-04-14T12:00:00Z');
    const endDate = new Date('2024-05-05T12:00:00Z');
    const missingAmount = 1200; // 4 weeks * 300 cents

    const outcomes = await getGoalOutcomes({
      goalName,
      startDate,
      endDate,
      savingInterval: Interval.WEEK,
      missingAmount
    });

    expect(outcomes).toHaveLength(3);
    expect(outcomes[0].date).toEqual(endDate);
    expect(outcomes[2].date).toEqual(new Date('2024-04-21T12:00:00Z'));
    expect(outcomes[0].valueCents).toBe(400);
  });

  it('should split amount correctly for monthly interval', async () => {
    const startDate = new Date('2024-04-15T12:00:00Z');
    const endDate = new Date('2024-06-22T12:00:00Z');
    const missingAmount = 3000; // 3 months * 1000 cents

    const outcomes = await getGoalOutcomes({
      goalName,
      startDate,
      endDate,
      savingInterval: Interval.MONTH,
      missingAmount
    });

    expect(outcomes).toHaveLength(3);
    expect(outcomes[0].date).toEqual(endDate);
    expect(outcomes[2].date).toEqual(new Date('2024-04-22T12:00:00Z'));
    expect(outcomes[0].valueCents).toBe(1000);
  });

  it('should handle two months interval correctly', async () => {
    const startDate = new Date('2024-04-15T12:00:00Z');
    const endDate = new Date('2024-08-15T12:00:00Z');
    const missingAmount = 2000; // 2 intervals * 1000 cents

    const outcomes = await getGoalOutcomes({
      goalName,
      startDate,
      endDate,
      savingInterval: Interval.TWO_MONTHS,
      missingAmount
    });

    expect(outcomes).toHaveLength(2);
    expect(outcomes[0].date).toEqual(endDate);
    expect(outcomes[1].date).toEqual(new Date('2024-06-15T12:00:00Z'));
    expect(outcomes[0].valueCents).toBe(1000);
  });

  it('should handle quarter interval correctly', async () => {
    const startDate = new Date('2024-04-15T12:00:00Z');
    const endDate = new Date('2024-10-15T12:00:00Z');
    const endDateOneDayBefore = new Date('2024-10-14T12:00:00Z');
    const missingAmount = 3000;

    const outcomes = await getGoalOutcomes({
      goalName,
      startDate,
      endDate,
      savingInterval: Interval.QUARTER,
      missingAmount
    });

    expect(outcomes).toHaveLength(2);
    expect(outcomes[0].date).toEqual(endDate);
    expect(outcomes[1].date).toEqual(new Date('2024-07-15T12:00:00Z'));
    expect(outcomes[0].valueCents).toBe(1500);

    const outcomes2 = await getGoalOutcomes({
      goalName,
      startDate,
      endDate: endDateOneDayBefore,
      savingInterval: Interval.QUARTER,
      missingAmount
    });

    expect(outcomes2).toHaveLength(2);
    expect(outcomes2[0].date).toEqual(endDateOneDayBefore);
    expect(outcomes2[1].date).toEqual(new Date('2024-07-14T12:00:00.000Z'));
    expect(outcomes2[0].valueCents).toBe(1500);
  });

  it('should handle year interval correctly', async () => {
    const startDate = new Date('2024-04-15T12:00:00Z');
    const endDate = new Date('2026-04-15T12:00:00Z');
    const missingAmount = 3000; // 3 years * 1000 cents

    const outcomes = await getGoalOutcomes({
      goalName,
      startDate,
      endDate,
      savingInterval: Interval.YEAR,
      missingAmount
    });

    expect(outcomes).toHaveLength(2);
    expect(outcomes[0].date).toEqual(endDate);
    expect(outcomes[1].date).toEqual(new Date('2025-04-15T12:00:00Z'));
    expect(outcomes[0].valueCents).toBe(1500);
  });

  it('should handle two weeks interval correctly', async () => {
    const startDate = new Date('2025-04-14T12:00:00Z');
    const endDate = new Date('2025-05-12T12:00:00Z');
    const missingAmount = 1500; // 4 two-week periods * 500 cents

    const outcomes = await getGoalOutcomes({
      goalName,
      startDate,
      endDate,
      savingInterval: Interval.TWO_WEEKS,
      missingAmount
    });

    expect(outcomes).toHaveLength(2);
    expect(outcomes[0].date).toEqual(endDate);
    expect(outcomes[1].date).toEqual(new Date('2025-04-28T12:00:00Z'));
    expect(outcomes[0].valueCents).toBe(750);
  });

  it('should handle single interval correctly', async () => {
    const startDate = new Date('2024-04-14T12:00:00Z');
    const endDate = new Date('2024-04-15T12:00:00Z');
    const missingAmount = 1000;

    const outcomes = await getGoalOutcomes({
      goalName,
      startDate,
      endDate,
      savingInterval: Interval.DAY,
      missingAmount
    });

    expect(outcomes).toHaveLength(1);
    expect(outcomes[0].date).toEqual(endDate);
    expect(outcomes[0].valueCents).toBe(1000);
  });

  it('should handle uneven division of amount', async () => {
    const startDate = new Date('2024-04-14T12:00:00Z');
    const endDate = new Date('2024-04-17T12:00:00Z');
    const missingAmount = 100; // 3 days, uneven division

    const outcomes = await getGoalOutcomes({
      goalName,
      startDate,
      endDate,
      savingInterval: Interval.DAY,
      missingAmount
    });

    expect(outcomes).toHaveLength(3);
    expect(outcomes[0].valueCents).toBe(33);
    expect(outcomes[1].valueCents).toBe(33);
    expect(outcomes[2].valueCents).toBe(34);
  });
});
