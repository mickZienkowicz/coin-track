import type { getTranslations } from 'next-intl/server';

import { pathGenerators } from '@/lib/paths';
import { TourStep } from '@/lib/tour/types';

export const getSettingsTourSteps = (
  t: Awaited<ReturnType<typeof getTranslations>>
): TourStep[] => [
  {
    title: t('addFamily.title'),
    content: t('addFamily.description'),
    highlightSelectors: [
      '[data-tour="add-family-btn"]',
      '[data-tour="add-family-dialog"]',
      '[data-tour="add-family-save-button"]'
    ],
    requiredBeforeNext: {
      selector: '[data-tour="active-family-card"]',
      alert: t('addFamily.alert')
    }
  },
  {
    title: t('families.title'),
    content: t('families.description'),
    highlightSelectors: [
      '[data-tour="active-family-card"]',
      '[data-tour="invite-to-family-button"]'
    ]
  },
  {
    title: t('familyEdit.title'),
    content: t('familyEdit.description'),
    highlightSelectors: [
      '[data-tour="active-family-card-edit-button"]',
      '[data-tour="active-family-card-edit-dialog"]',
      '[data-tour="active-family-card"]'
    ]
  },
  {
    title: t('familyDelete.title'),
    content: t('familyDelete.description'),
    highlightSelectors: [
      '[data-tour="active-family-card-delete-button"]',
      '[data-tour="active-family-card-delete-dialog"]',
      '[data-tour="active-family-card"]'
    ]
  },
  // {
  //   title: t('inviteUserToFamily.title'),
  //   content: t('inviteUserToFamily.description'),
  //   highlightSelectors: [
  //     '[data-tour="active-family-card-invite-user-button"]',
  //     '[data-tour="active-family-card-invite-user-dialog"]',
  //     '[data-tour="active-family-card"]'
  //   ]
  // },
  {
    title: t('familyInvitations.title'),
    content: t('familyInvitations.description'),
    highlightSelectors: ['[data-tour="family-invitations"]']
  },
  {
    title: t('yourFamilyInvitations.title'),
    content: t('yourFamilyInvitations.description'),
    highlightSelectors: ['[data-tour="family-sent-invitations"]']
  },
  {
    title: t('goToBudgetPage.title'),
    content: t('goToBudgetPage.description'),
    highlightSelectors: ['[data-tour="budget-link"]'],
    redirectOnNext: pathGenerators.budget(),
    visibleSelectors: [
      '[data-tour="mobile-menu"]',
      '[data-tour="desktop-menu"]'
    ],
    clickableSelector: '[data-tour="budget-link"]'
  }
];
