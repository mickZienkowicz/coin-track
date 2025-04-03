import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';
import { getReceivedInvitations } from '@/server/invitation/queries/get-received-invitations';

import { AppSidebar } from './_components/app-sidebar';
import { MobileMenu } from './_components/mobile-menu';
import { AddPouchOutcomeDialog } from './(features)/budget/_components/pouch/add-pouch-outcome/add-pouch-outcome-dialog';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [family, receivedInvitations] = await Promise.all([
    getSelectedFamily(),
    getReceivedInvitations()
  ]);

  return (
    <div className='w-full'>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar
          receivedInvitationsCount={receivedInvitations?.length ?? 0}
        />
        <div className='relative flex min-h-screen w-full flex-col items-center p-5 pb-32 pt-8 lg:p-8 lg:pb-8'>
          {family?.currency && (
            <AddPouchOutcomeDialog currency={family.currency}>
              <Button
                variant='secondary'
                size='iconSmall'
                className='fixed right-5 top-8 z-50 size-11 lg:hidden'
              >
                <ShoppingCart />
              </Button>
            </AddPouchOutcomeDialog>
          )}
          {children}
        </div>
        <MobileMenu />
      </SidebarProvider>
    </div>
  );
}
