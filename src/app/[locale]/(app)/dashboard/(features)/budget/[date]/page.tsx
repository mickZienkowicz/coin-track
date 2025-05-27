import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { isAfter, isValid, parse } from 'date-fns';
import { Package } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

import { BudgetSummary } from '../_components/budget-summary/budget-summary';
import { LoadingCard } from '../../../_components/loading-card/loading-card';
import { NoFamilyCardFallback } from '../../../_components/no-family-card-fallback';

export default async function BudgetPage({
  params
}: {
  params: Promise<{ date: string }>;
}) {
  const t = await getTranslations('budgetHistory');
  const { date } = await params;
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date());

  if (!isValid(parsedDate)) {
    return notFound();
  }

  if (isAfter(parsedDate, new Date())) {
    return notFound();
  }

  return (
    <div>
      <div className='@container relative mr-14 flex items-center justify-between gap-4 lg:mr-0 2xl:mt-2'>
        <div className='@xl:flex-row @xl:items-center @xl:justify-between flex w-full flex-col gap-6'>
          <h1 className='@xl:w-auto flex min-h-11 w-full items-center text-start text-3xl font-semibold'>
            {t('title')}
          </h1>
          <Link
            href={pathGenerators.budget()}
            className={cn(buttonVariants({ variant: 'secondary' }), 'w-fit')}
          >
            <Package className='size-4' />
            {t('backToCurrentBudget')}
          </Link>
        </div>
      </div>

      <NoFamilyCardFallback>
        <Suspense fallback={<LoadingCard className='mt-6' />}>
          <BudgetSummary date={parsedDate} isPreview={true} />
        </Suspense>
      </NoFamilyCardFallback>
    </div>
  );
}
