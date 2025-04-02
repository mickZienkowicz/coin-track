import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { AppSidebar } from './_components/app-sidebar';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full'>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <div className='relative flex min-h-screen w-full flex-col items-center p-5 pb-8 pt-20 lg:p-8 lg:pt-8'>
          <SidebarTrigger className='absolute left-4 top-4 size-12 bg-muted lg:hidden' />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
