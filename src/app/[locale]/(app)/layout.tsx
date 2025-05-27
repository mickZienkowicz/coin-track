import { ShoppingCart } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CurrentFamilyProvider } from '@/hooks/use-current-family';
import { redirect } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { TourProvider } from '@/lib/tour/tour-provider';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { checkSubscription } from '@/server/subscription/queries/check-subscription';

import { AppSidebar } from './_components/app-sidebar';
import { MobileMenu } from './_components/mobile-menu';
import { TourDialog } from './_components/tour-dialog';
import { getTourSteps } from './_constants/tour-steps';
import { AddPouchOutcomeDialog } from './dashboard/(features)/budget/_components/budget-configuration/_components/pouch/add-pouch-outcome/add-pouch-outcome-dialog';

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const hasValidSubscription = await checkSubscription();
  const locale = await getLocale();

  if (!hasValidSubscription) {
    await redirect({
      href: pathGenerators.settings(),
      locale
    });
  }

  const [family, t, tourStepsTranslations] = await Promise.all([
    getSelectedFamily(),
    getTranslations('budget.pouch.pouchCard.addPouchOutcome'),
    getTranslations('tourSteps')
  ]);

  const tourSteps = getTourSteps(tourStepsTranslations);

  return (
    <div className='w-full'>
      <TourProvider steps={tourSteps}>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <div className='relative flex min-h-screen w-full flex-col items-center p-5 pb-32 pt-8 lg:p-8 lg:pb-8'>
            <AddPouchOutcomeDialog>
              <Button
                variant='secondary'
                size='iconSmall'
                className='fixed right-5 top-8 z-50 size-11 lg:hidden'
                aria-label={t('button')}
              >
                <ShoppingCart />
              </Button>
            </AddPouchOutcomeDialog>
            <CurrentFamilyProvider family={family}>
              {children}
            </CurrentFamilyProvider>
          </div>
          <MobileMenu />
          <TourDialog />
        </SidebarProvider>
      </TourProvider>
    </div>
  );
}
