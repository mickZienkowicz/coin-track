'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { SignedIn, SignOutButton, UserButton } from '@clerk/nextjs';
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
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Link, usePathname } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';

import { ChangeLanguageDialog } from '../change-language-dialog';

export function AppSidebar() {
  const t = useTranslations('menu');
  const pathname = usePathname();

  const mainNavItems = useMemo(
    () => [
      {
        value: pathGenerators.dashboard(),
        label: t('dashboard'),
        icon: LayoutDashboard
      },
      {
        value: pathGenerators.fortune(),
        label: t('fortune'),
        icon: Wallet
      },
      {
        value: pathGenerators.budget(),
        label: t('budget'),
        icon: Package
      },
      { value: pathGenerators.goals(), label: t('goals'), icon: Target }
    ],
    [t]
  );

  const bottomNavItems = useMemo(
    () => [
      {
        value: pathGenerators.settings(),
        label: t('settings'),
        icon: Settings
      }
    ],
    [t]
  );

  return (
    <>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <Image
            src='/logo-transparent-icon.svg'
            alt='logo'
            width={48}
            height={48}
            priority
            className='h-12 w-auto rounded-md'
          />
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.endsWith(item.value)}
                      tooltip={item.label}
                    >
                      <Link href={item.value}>
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

        <SidebarFooter>
          <SidebarMenu>
            <ChangeLanguageDialog>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={false}
                  tooltip={t('languageSwitcher.title')}
                >
                  <>
                    <Globe className='size-6' />
                    <span>{t('languageSwitcher.title')}</span>
                  </>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </ChangeLanguageDialog>
            {bottomNavItems.map((item) => (
              <SidebarMenuItem key={item.value}>
                <SidebarMenuButton
                  isActive={pathname.endsWith(item.value)}
                  tooltip={item.label}
                  asChild
                >
                  <Link href={item.value}>
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
                >
                  <LogOut className='h-5 w-5' />
                  <span>{t('logout')}</span>
                </SidebarMenuButton>
              </SignOutButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroup className='p-1'>
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
