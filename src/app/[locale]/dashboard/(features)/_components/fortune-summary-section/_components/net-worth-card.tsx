'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePathname } from '@/i18n/navigation';
import { pathGenerators, paths } from '@/lib/paths';
import { cn } from '@/lib/utils';

export const NetWorthCard = ({
  title,
  icon,
  value,
  description,
  className
}: {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  description: string;
  className?: string;
}) => {
  const pathname = usePathname();
  const t = useTranslations('dashboard.fortune');

  return (
    <Card
      className={cn(
        'gap-0',
        pathname === paths.fortune && 'justify-center',
        className
      )}
    >
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-3 text-lg'>
          {icon}
          <div className='flex flex-col'>
            <h4 className='hidden text-2xl font-bold sm:block'>{title}</h4>
            <p className='hidden text-sm font-normal text-primary/70 sm:block'>
              <Calendar className='-mt-0.5 mr-1 inline-block h-3.5 w-3.5' />
              {description}
            </p>
            <h4 className='text-2xl font-bold sm:hidden'>{value}</h4>
            <p className='text-sm font-normal text-primary/70 sm:hidden'>
              {title}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          'flex flex-col justify-between',
          pathname !== paths.fortune && 'grow'
        )}
      >
        <div className='hidden grow text-2xl font-black text-primary sm:block md:text-[25px]'>
          {value}
        </div>
        {pathname !== paths.fortune && (
          <div className='flex justify-end sm:mt-4 2xl:hidden'>
            <Link
              className={cn(buttonVariants({ size: 'sm' }))}
              href={pathGenerators.fortune()}
            >
              {t('manageAssets')}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
