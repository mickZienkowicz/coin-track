export const paths = {
  home: '/',
  dashboard: '/dashboard',
  fortune: '/dashboard/fortune',
  budget: '/dashboard/budget',
  goals: '/dashboard/goals',
  settings: '/settings',
  budgetFromDate: '/dashboard/budget/:date',
  termsOfService: '/terms-of-service',
  privacyPolicy: '/privacy-policy'
};

export const pathGenerators = {
  home: () => paths.home,
  dashboard: () => paths.dashboard,
  fortune: () => paths.fortune,
  budget: () => paths.budget,
  budgetFromDate: (date: string) => paths.budgetFromDate.replace(':date', date),
  goals: () => paths.goals,
  settings: () => paths.settings,
  termsOfService: () => paths.termsOfService,
  privacyPolicy: () => paths.privacyPolicy
};

export const protectedPaths = [
  paths.dashboard,
  paths.fortune,
  paths.budget,
  paths.goals,
  paths.settings
];
