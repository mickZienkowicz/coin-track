import { getLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { checkSubscription } from '@/server/subscription/queries/check-subscription';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { success } = await checkSubscription();
  const locale = await getLocale();

  if (!success) {
    await redirect({
      href: `${pathGenerators.settings()}?chooseSubscription=true`,
      locale
    });
  }

  return children;
}
