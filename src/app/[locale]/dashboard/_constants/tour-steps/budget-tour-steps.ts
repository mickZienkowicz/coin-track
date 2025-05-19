import type { getTranslations } from 'next-intl/server';

import { pathGenerators } from '@/lib/paths';
import { TourStep } from '@/lib/tour/types';

export const getBudgetTourSteps = (
  t: Awaited<ReturnType<typeof getTranslations>>
): TourStep[] => [
  {
    title: t('budgetSettings.title'),
    redirectOnPrev: pathGenerators.settings(),
    content: t('budgetSettings.description'),
    highlightSelectors: [
      '[data-tour="budget-settings"]',
      '[data-tour="budget-settings-form"]'
    ]
  },
  {
    title: t('budgetItems.title'),
    content: t('budgetItems.description'),
    redirectOnNext: `${pathGenerators.budget()}?tab=budget-items`,
    highlightSelectors: ['[data-tour="budget-items-tab"]'],
    clickableSelector: '[data-tour="budget-items-tab"]'
  },
  {
    title: t('addIncome.title'),
    content: t('addIncome.description'),
    redirectOnPrev: `${pathGenerators.budget()}?tab=summary`,
    highlightSelectors: [
      '[data-tour="add-income-button"]',
      '[data-tour="add-income-dialog"]'
    ],
    clickableSelector: '[data-tour="add-income-button"]',
    requiredBeforeNext: {
      selector: '[data-tour="income-card"]',
      alert: t('addIncome.alert')
    }
  },
  {
    title: t('seeThisIncome.title'),
    content: t('seeThisIncome.description'),
    highlightSelectors: [
      '[data-tour="income-card"]',
      '[data-tour="edit-income-button"]',
      '[data-tour="edit-income-form"]',
      '[data-tour="remove-income-button"]',
      '[data-tour="remove-income-form"]'
    ]
  },
  {
    title: t('addOutcome.title'),
    content: t('addOutcome.description'),
    highlightSelectors: [
      '[data-tour="add-outcome-button"]',
      '[data-tour="add-outcome-dialog"]'
    ],
    clickableSelector: '[data-tour="add-outcome-button"]',
    requiredBeforeNext: {
      selector: '[data-tour="outcome-card"]',
      alert: t('addOutcome.alert')
    }
  },
  {
    title: t('seeThisOutcome.title'),
    content: t('seeThisOutcome.description'),
    highlightSelectors: [
      '[data-tour="outcome-card"]',
      '[data-tour="edit-outcome-button"]',
      '[data-tour="edit-outcome-form"]',
      '[data-tour="remove-outcome-button"]',
      '[data-tour="remove-outcome-form"]'
    ]
  },
  {
    title: t('addPouch.title'),
    content: t('addPouch.description'),
    highlightSelectors: [
      '[data-tour="add-pouch-button"]',
      '[data-tour="add-pouch-dialog"]'
    ],
    clickableSelector: '[data-tour="add-pouch-button"]',
    requiredBeforeNext: {
      selector: '[data-tour="pouch-card"]',
      alert: t('addPouch.alert')
    }
  },
  {
    title: t('seeThisPouch.title'),
    content: t('seeThisPouch.description'),
    highlightSelectors: [
      '[data-tour="pouch-card"]',
      '[data-tour="edit-pouch-card-button"]',
      '[data-tour="edit-pouch-card-form"]',
      '[data-tour="remove-pouch-card-button"]',
      '[data-tour="remove-pouch-card-form"]'
    ]
  },
  {
    title: t('goToBudgetSummary.title'),
    redirectOnNext: `${pathGenerators.budget()}?tab=summary`,
    content: t('goToBudgetSummary.description'),
    highlightSelectors: ['[data-tour="budget-summary-tab"]'],
    clickableSelector: '[data-tour="budget-summary-tab"]'
  },
  {
    title: t('seeBudgetTimeline.title'),
    redirectOnPrev: `${pathGenerators.budget()}?tab=budget-items`,
    content: t('seeBudgetTimeline.description'),
    highlightSelectors: ['[data-tour="budget-timeframe-title"]']
  },
  {
    title: t('seeBudgetBalance.title'),
    content: t('seeBudgetBalance.description'),
    highlightSelectors: ['[data-tour="budget-balance-card"]']
  },
  {
    title: t('budgetPouches.title'),
    content: t('budgetPouches.description'),
    highlightSelectors: ['[data-tour="budget-pouches-card"]']
  },
  {
    title: t('pouchOutcome.title'),
    content: t('pouchOutcome.description'),
    highlightSelectors: [
      '[data-tour="add-pouch-outcome-dialog"]',
      '[data-tour="pouch-card"]',
      '[data-tour="pouch-card-outcome-form"]'
    ],
    requiredBeforeNext: {
      selector: '[data-tour="pouch-card-expenses-button"]',
      alert: t('pouchOutcome.alert')
    }
  },
  {
    title: t('pouchOutcomesList.title'),
    content: t('pouchOutcomesList.description'),
    highlightSelectors: [
      '[data-tour="pouch-card-expenses-button"]',
      '[data-tour="pouch-card"]'
    ],
    requiredBeforeNext: {
      selector: '[data-tour="edit-pouch-card-outcome-button"]',
      alert: t('pouchOutcomesList.alert')
    }
  },
  {
    title: t('pouchOutcomeEdit.title'),
    content: t('pouchOutcomeEdit.description'),
    highlightSelectors: [
      '[data-tour="pouch-card"]',
      '[data-tour="edit-pouch-card-outcome-button"]',
      '[data-tour="edit-pouch-card-outcome-form"]',
      '[data-tour="remove-pouch-card-outcome-button"]',
      '[data-tour="remove-pouch-card-outcome-form"]'
    ]
  },
  {
    title: t('incomesList.title'),
    content: t('incomesList.description'),
    highlightSelectors: ['[data-tour="budget-incomes-section"]']
  },
  {
    title: t('outcomesList.title'),
    content: t('outcomesList.description'),
    highlightSelectors: ['[data-tour="budget-outcomes-section"]']
  },
  {
    title: t('goToGoalsPage.title'),
    content: t('goToGoalsPage.description'),
    highlightSelectors: ['[data-tour="goals-link"]'],
    redirectOnNext: pathGenerators.goals(),
    visibleSelectors: [
      '[data-tour="mobile-menu"]',
      '[data-tour="desktop-menu"]'
    ],
    clickableSelector: '[data-tour="goals-link"]'
  }
];
