import type { getTranslations } from 'next-intl/server';

import { pathGenerators } from '@/lib/paths';
import { TourStep } from '@/lib/tour/types';

export const getFortuneTourSteps = (
  t: Awaited<ReturnType<typeof getTranslations>>
): TourStep[] => [
  {
    title: t('addFirstAsset.title'),
    content: t('addFirstAsset.description'),
    highlightSelectors: [
      '[data-tour="add-asset-button"]',
      '[data-tour="add-asset-dialog"]'
    ],
    requiredBeforeNext: {
      selector: '[data-tour="asset-card"]',
      alert: t('addFirstAsset.alert')
    }
  },
  {
    title: t('seeThisAsset.title'),
    content: t('seeThisAsset.description'),
    highlightSelectors: [
      '[data-tour="asset-card"]',
      '[data-tour="edit-asset-button"]',
      '[data-tour="edit-asset-dialog"]',
      '[data-tour="delete-asset-button"]',
      '[data-tour="delete-asset-dialog"]'
    ]
  },
  {
    title: t('addFirstDebt.title'),
    content: t('addFirstDebt.description'),
    highlightSelectors: [
      '[data-tour="add-debt-button"]',
      '[data-tour="add-debt-dialog"]'
    ],
    requiredBeforeNext: {
      selector: '[data-tour="debt-card"]',
      alert: t('addFirstDebt.alert')
    }
  },
  {
    title: t('seeThisDebt.title'),
    content: t('seeThisDebt.description'),
    highlightSelectors: [
      '[data-tour="debt-card"]',
      '[data-tour="edit-debt-button"]',
      '[data-tour="edit-debt-dialog"]',
      '[data-tour="delete-debt-button"]',
      '[data-tour="delete-debt-dialog"]'
    ]
  },
  {
    title: t('seeAssetsCountCard.title'),
    content: t('seeAssetsCountCard.description'),
    highlightSelectors: ['[data-tour="assets-count-card"]']
  },
  {
    title: t('seeDebtsCountCard.title'),
    content: t('seeDebtsCountCard.description'),
    highlightSelectors: ['[data-tour="debts-count-card"]']
  },
  {
    title: t('seeNetWorthCard.title'),
    content: t('seeNetWorthCard.description'),
    highlightSelectors: ['[data-tour="net-worth-card"]']
  },
  {
    title: t('financialCushionCard.title'),
    content: t('financialCushionCard.description'),
    highlightSelectors: [
      '[data-tour="financial-cushion-card"], [data-tour="financial-cushion-card-additional-badge"]'
    ]
  },
  {
    title: t('livingAssetsCard.title'),
    content: t('livingAssetsCard.description'),
    highlightSelectors: ['[data-tour="living-assets-card"]']
  },
  {
    title: t('investmentsCard.title'),
    content: t('investmentsCard.description'),
    highlightSelectors: ['[data-tour="investments-card"]']
  },
  {
    title: t('othersAssetsCard.title'),
    content: t('othersAssetsCard.description'),
    highlightSelectors: ['[data-tour="other-assets-card"]']
  },
  {
    title: t('goToDashboardPage.title'),
    content: t('goToDashboardPage.description'),
    highlightSelectors: ['[data-tour="dashboard-link"]'],
    redirectOnNext: pathGenerators.dashboard(),
    visibleSelectors: [
      '[data-tour="mobile-menu"]',
      '[data-tour="desktop-menu"]'
    ],
    clickableSelector: '[data-tour="dashboard-link"]'
  }
];
