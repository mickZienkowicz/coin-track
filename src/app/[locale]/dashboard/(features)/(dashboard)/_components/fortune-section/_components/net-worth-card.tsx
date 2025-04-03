import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

export const NetWorthCard = async ({
  title,
  icon,
  value,
  description,
  className
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  description: string;
  className?: string;
}) => {
  const t = await getTranslations('dashboard.fortune');

  return (
    <Card className={cn('gap-0', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-3 text-lg'>
          {icon}
          <div className='flex flex-col'>
            <h4 className='hidden text-2xl font-bold sm:block'>{title}</h4>
            <p className='hidden text-sm font-normal text-primary/70 sm:block'>
              {description}
            </p>
            <h4 className='text-2xl font-bold sm:hidden'>{value}</h4>
            <p className='text-sm font-normal text-primary/70 sm:hidden'>
              {title}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex grow flex-col justify-between'>
        <div className='hidden text-2xl font-black text-primary sm:block md:text-[25px]'>
          {value}
        </div>
        <div className='flex justify-end sm:mt-4 2xl:hidden'>
          <Link
            className={cn(buttonVariants({ size: 'sm' }))}
            href={pathGenerators.fortune()}
          >
            {t('manageAssets')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
