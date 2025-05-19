import type { getTranslations } from 'next-intl/server';

import { pathGenerators } from '@/lib/paths';
import { TourStep } from '@/lib/tour/types';

export const getDashboardTourSteps = (
  t: Awaited<ReturnType<typeof getTranslations>>
): TourStep[] => [
  {
    title: t('dashboardFortuneCard.title'),
    content: t('dashboardFortuneCard.description'),
    redirectOnPrev: pathGenerators.fortune(),
    highlightSelectors: ['[data-tour="assets-cards"]']
  },
  {
    title: t('dashboardBudgetBalanceCard.title'),
    content: t('dashboardBudgetBalanceCard.description'),
    highlightSelectors: [
      '[data-tour="budget-balance-card"]',
      '[data-tour="manage-budget-button"]'
    ]
  },
  {
    title: t('dashboardHistoryOfFinancesCard.title'),
    content: t('dashboardHistoryOfFinancesCard.description'),
    highlightSelectors: [
      '[data-tour="history-of-finances-card"]',
      '[data-tour="see-history-of-finances-preview-button"]',
      '[data-tour="select-budget-button"]',
      '[data-tour="select-budget-dialog"]'
    ]
  },
  {
    title: t('dashboardGoalsCard.title'),
    content: t('dashboardGoalsCard.description'),
    highlightSelectors: [
      '[data-tour="goals-card"]',
      '[data-tour="manage-goals-button"]'
    ]
  },
  {
    title: t('dashboardFinancialCushionCard.title'),
    content: t('dashboardFinancialCushionCard.description'),
    highlightSelectors: [
      '[data-tour="financial-cushion-card"]',
      '[data-tour="manage-assets-button"]'
    ]
  }
];
