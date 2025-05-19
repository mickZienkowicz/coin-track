import { getTranslations } from 'next-intl/server';

import { TourStep } from '@/lib/tour/types';

import { getBudgetTourSteps } from './budget-tour-steps';
import { getDashboardTourSteps } from './dashboard-tour-steps';
import { getFortuneTourSteps } from './fortune-tour-steps';
import { getGoalsTourSteps } from './goals-tour-steps';
import { getSettingsTourSteps } from './settings-tour-steps';

export const getTourSteps = (
  t: Awaited<ReturnType<typeof getTranslations>>
): TourStep[] =>
  [
    ...getSettingsTourSteps(t),
    ...getBudgetTourSteps(t),
    ...getGoalsTourSteps(t),
    ...getFortuneTourSteps(t),
    ...getDashboardTourSteps(t)
  ] satisfies TourStep[];
