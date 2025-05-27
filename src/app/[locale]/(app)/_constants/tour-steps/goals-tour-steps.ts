import type { getTranslations } from 'next-intl/server';

import { pathGenerators } from '@/lib/paths';
import { TourStep } from '@/lib/tour/types';

export const getGoalsTourSteps = (
  t: Awaited<ReturnType<typeof getTranslations>>
): TourStep[] => [
  {
    title: t('addGoal.title'),
    content: t('addGoal.description'),
    redirectOnPrev: pathGenerators.budget(),
    highlightSelectors: [
      '[data-tour="add-goal-button"]',
      '[data-tour="add-goal-dialog"]'
    ],
    requiredBeforeNext: {
      selector: '[data-tour="goal-card"]',
      alert: t('addGoal.alert')
    }
  },
  {
    title: t('seeThisGoal.title'),
    content: t('seeThisGoal.description'),
    highlightSelectors: [
      '[data-tour="goal-card"]',
      '[data-tour="view-deposit-schedule-button"]',
      '[data-tour="view-deposit-schedule-modal"]'
    ]
  },
  {
    title: t('editGoal.title'),
    content: t('editGoal.description'),
    highlightSelectors: [
      '[data-tour="goal-card"]',
      '[data-tour="edit-goal-button"]',
      '[data-tour="edit-goal-form"]',
      '[data-tour="finish-goal-button"]',
      '[data-tour="finish-goal-form"]',

      '[data-tour="remove-goal-button"]',
      '[data-tour="remove-goal-form"]'
    ]
  },
  {
    title: t('goToFortunePage.title'),
    content: t('goToFortunePage.description'),
    highlightSelectors: ['[data-tour="fortune-link"]'],
    redirectOnNext: pathGenerators.fortune(),
    visibleSelectors: [
      '[data-tour="mobile-menu"]',
      '[data-tour="desktop-menu"]'
    ],
    clickableSelector: '[data-tour="fortune-link"]'
  }
];
