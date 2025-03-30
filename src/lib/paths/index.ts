export const paths = {
  home: '/',
  dashboard: '/dashboard',
  fortune: '/dashboard/fortune',
  budget: '/dashboard/budget',
  goals: '/dashboard/goals',
  settings: '/dashboard/settings'
};

export const pathGenerators = {
  home: () => paths.home,
  dashboard: () => paths.dashboard,
  fortune: () => paths.fortune,
  budget: () => paths.budget,
  goals: () => paths.goals,
  settings: () => paths.settings
};

export const protectedPaths = [
  paths.dashboard,
  paths.fortune,
  paths.budget,
  paths.goals,
  paths.settings
];
