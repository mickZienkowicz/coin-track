'use client';

import { LayoutDashboard, Package, Target, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, usePathname } from '@/i18n/navigation';
import { pathGenerators, paths } from '@/lib/paths';
import { cn } from '@/lib/utils';

export function FeaturesTabs({ className }: { className?: string }) {
  const t = useTranslations('menu');
  const pathname = usePathname();

  return (
    <Tabs value={pathname} className={cn('w-full', className)}>
      <TabsList className='w-full'>
        <TabsTrigger
          value={paths.dashboard}
          className='flex items-center gap-2'
          asChild
        >
          <Link href={pathGenerators.dashboard()}>
            <LayoutDashboard className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('dashboard')}</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger
          value={paths.fortune}
          className='flex items-center gap-2'
          asChild
        >
          <Link href={pathGenerators.fortune()}>
            <Wallet className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('fortune')}</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger
          value={paths.budget}
          className='flex items-center gap-2'
          asChild
        >
          <Link href={pathGenerators.budget()}>
            <Package className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('budget')}</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger
          value={paths.goals}
          className='flex items-center gap-2'
          asChild
        >
          <Link href={pathGenerators.goals()}>
            <Target className='h-4 w-4' />
            <span className='hidden sm:inline'>{t('goals')}</span>
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
