'use client';

import { Suspense } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentFamily } from '@/hooks/use-current-family';
import { Link, usePathname } from '@/i18n/navigation';
import { pathGenerators, paths } from '@/lib/paths';
import { cn } from '@/lib/utils';

import { AddFamilyDialog } from '../../../settings/_components/family-card/components/add-family/add-family-dialog';
import { LoadingCard } from '../loading-card/loading-card';

export const NoFamilyCardFallback = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const t = useTranslations('budget');
  const family = useCurrentFamily();

  return (
    <Suspense fallback={<LoadingCard className='mt-6' />}>
      {!family ? (
        <Card className='mt-6 w-full'>
          <CardContent className='flex flex-col items-center px-8 pb-6 pt-10 text-center'>
            <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
              <PlusCircle className='h-8 w-8 text-muted-foreground' />
            </div>
            <h2 className='mb-3 text-2xl font-semibold'>
              {t('noFamilyCard.title')}
            </h2>
            <p className='mb-6 max-w-xl text-muted-foreground'>
              {t('noFamilyCard.description')}
            </p>
            {pathname === paths.settings ? (
              <AddFamilyDialog />
            ) : (
              <Link
                href={pathGenerators.settings()}
                className={cn(buttonVariants())}
              >
                {t('noFamilyCard.addFamilyButton')}
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        children
      )}
    </Suspense>
  );
};
