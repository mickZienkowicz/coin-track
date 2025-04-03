'use client';

import { useMemo } from 'react';
import { LayoutDashboard, Package, Target, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Link, usePathname } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

export const MobileMenu = () => {
  const t = useTranslations('menu');
  const pathname = usePathname();
  const mainNavItems = useMemo(
    () => [
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
      {
        value: pathGenerators.dashboard(),
        label: t('dashboard'),
        icon: LayoutDashboard
      },
      {
        value: pathGenerators.goals(),
        label: t('goals'),
        icon: Target
      }
    ],
    [t]
  );

  return (
    <>
      <div className='fixed bottom-0 left-0 right-0 z-40 border-t border-sidebar-border bg-sidebar min-[768px]:hidden'>
        <ul className='safe-area-fix-bottom flex items-center justify-center gap-4'>
          {mainNavItems.map((item) => {
            const isActive = pathname.endsWith(item.value);

            return (
              <li
                key={item.label}
                className={cn(
                  'relative border-sidebar transition-[scale,translate] duration-300',
                  isActive &&
                    'scale-115 origin-bottom -translate-y-1.5 rounded-xl border-[4px] border-sidebar bg-sidebar outline-1 outline-sidebar-border'
                )}
              >
                <Link
                  key={item.label}
                  href={item.value}
                  className={cn(
                    'relative z-50 flex size-11 flex-col items-center justify-center gap-1 rounded-xl text-xs',
                    isActive && 'bg-brand-primary text-white'
                  )}
                >
                  <span>
                    <item.icon className='size-5' />
                    <span className='sr-only'>{item.label}</span>
                  </span>
                </Link>
                <span
                  className={cn(
                    isActive &&
                      'absolute -left-[5px] -right-[5px] top-[8px] z-40 h-full bg-sidebar'
                  )}
                />
              </li>
            );
          })}
          <li className='flex size-12 flex-col items-center justify-center'>
            <SidebarTrigger className='[&>svg]:size-5! bg-transparent text-white hover:bg-transparent' />
          </li>
        </ul>
      </div>
    </>
  );
};
