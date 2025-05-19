'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SignedIn, SignOutButton, UserButton } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import {
  Globe,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Target,
  Wallet
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';
import { Link, usePathname } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';
import { getReceivedInvitations } from '@/server/invitation/queries/get-received-invitations';

import { ChangeLanguageDialog } from '../change-language-dialog';

export function AppSidebar() {
  const router = useRouter();
  const { data: receivedInvitations } = useQuery({
    queryKey: ['receivedInvitations'],
    queryFn: () => getReceivedInvitations()
  });
  const receivedInvitationsCount = receivedInvitations?.length ?? 0;
  const t = useTranslations('menu');
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const mainNavItems = useMemo(
    () => [
      {
        value: pathGenerators.dashboard(),
        label: t('dashboard'),
        icon: LayoutDashboard,
        'data-tour': 'dashboard-link'
      },
      {
        value: pathGenerators.fortune(),
        label: t('fortune'),
        icon: Wallet,
        'data-tour': 'fortune-link'
      },
      {
        value: pathGenerators.budget(),
        label: t('budget'),
        icon: Package,
        'data-tour': 'budget-link'
      },
      {
        value: pathGenerators.goals(),
        label: t('goals'),
        icon: Target,
        'data-tour': 'goals-link'
      }
    ],
    [t]
  );

  const bottomNavItems = useMemo(
    () => [
      {
        value: pathGenerators.settings(),

        label: t('settings'),
        icon: Settings,
        'data-tour': 'settings-link'
      }
    ],
    [t]
  );

  return (
    <>
      <Sidebar collapsible='icon' data-tour='desktop-menu'>
        <SidebarHeader className='hidden md:flex'>
          <Image
            src='/logo-transparent-icon.svg'
            alt='logo'
            width={48}
            height={48}
            priority
            className='h-12 w-auto rounded-md'
          />
        </SidebarHeader>

        <SidebarSeparator className='hidden md:block' />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className='gap-0 md:gap-2'>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem
                    key={item.value}
                    data-tour={item['data-tour']}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.endsWith(item.value)}
                      tooltip={item.label}
                      onClick={() => setOpenMobile(false)}
                      // data-tour={item['data-tour']}
                    >
                      <Link href={item.value} target='_self'>
                        <item.icon className='size-6' />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter className='pb-2'>
          <SidebarMenu className='gap-0 md:gap-2'>
            <ChangeLanguageDialog>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={false}
                  tooltip={t('languageSwitcher.title')}
                  data-tour='language-switcher'
                >
                  <>
                    <Globe className='size-6' />
                    <span>{t('languageSwitcher.title')}</span>
                  </>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </ChangeLanguageDialog>
            {bottomNavItems.map((item) => (
              <SidebarMenuItem
                key={item.value}
                onClick={() => setOpenMobile(false)}
                className={cn(
                  receivedInvitationsCount > 0 &&
                    `relative after:absolute after:-bottom-[3px] after:-right-[3px] after:h-2.5 after:w-2.5 after:rounded-full after:bg-yellow-600`
                )}
                data-tour={item['data-tour']}
              >
                <SidebarMenuButton
                  isActive={pathname.endsWith(item.value)}
                  tooltip={item.label}
                  asChild
                >
                  <Link href={item.value} target='_self'>
                    <item.icon className='size-6' />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem>
              <SignOutButton>
                <SidebarMenuButton
                  className='text-red-700 hover:bg-red-100 hover:text-red-600'
                  tooltip={t('logout')}
                  onClick={() => router.push(pathGenerators.home())}
                >
                  <LogOut className='h-5 w-5' />
                  <span>{t('logout')}</span>
                </SidebarMenuButton>
              </SignOutButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroup className='safe-area-fix-bottom mb-1 p-1 pb-0'>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </SidebarGroup>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
