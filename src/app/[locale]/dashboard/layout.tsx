import { ShoppingCart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CurrentFamilyProvider } from '@/hooks/use-current-family';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';

import { AppSidebar } from './_components/app-sidebar';
import { MobileMenu } from './_components/mobile-menu';
import { AddPouchOutcomeDialog } from './(features)/budget/_components/budget-configuration/_components/pouch/add-pouch-outcome/add-pouch-outcome-dialog';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [family, t] = await Promise.all([
    getSelectedFamily(),
    getTranslations('budget.pouch.pouchCard.addPouchOutcome')
  ]);

  return (
    <div className='w-full'>
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
      </SidebarProvider>
    </div>
  );
}
