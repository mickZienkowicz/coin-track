import { Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';
import { getFortuneSummary } from '@/server/fortune/queries/get-forune-summary';

export const FinancialCushionCard = async () => {
  const t = await getTranslations('dashboard.balance.financialCushion');
  const fortuneSummary = await getFortuneSummary();

  const currentFinancialCushionPercentage =
    (fortuneSummary.financialCushionAssetsValueSum /
      (fortuneSummary.monthlyOutcomesSum * 6)) *
    100;

  return (
    <Card className='gap-0'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2 md:items-center'>
          <CardTitle className='flex items-center gap-3 text-lg'>
            <div className='flex size-9 shrink-0 items-center  justify-center rounded-full bg-blue-600/20 md:size-11'>
              <Shield className='size-5 text-blue-600 md:size-6' />
            </div>
            <div className='flex flex-col'>
              <h4 className='text-2xl font-bold'>{t('title')}</h4>
              <p className='text-sm font-normal text-primary/70'>
                {t('recommendation')}{' '}
                <span className='font-bold'>
                  <FormattedCurrency
                    valueCents={fortuneSummary.monthlyOutcomesSum * 3}
                  />
                </span>{' '}
                -{' '}
                <span className='font-bold'>
                  <FormattedCurrency
                    valueCents={fortuneSummary.monthlyOutcomesSum * 6}
                  />
                </span>
              </p>
            </div>
          </CardTitle>
          <Badge
            className={cn(
              'mt-[2px] hidden bg-blue-600 font-bold tracking-tighter text-white sm:flex md:mt-0',
              currentFinancialCushionPercentage < 50 && 'bg-red-700'
            )}
          >
            {currentFinancialCushionPercentage.toFixed(0)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className='mb-6 mt-3 text-sm text-primary/70 md:text-base'>
          {t('description1')}
          <span className='font-bold'>
            <FormattedCurrency
              valueCents={fortuneSummary.financialCushionAssetsValueSum}
            />
          </span>
          {t('description2')}
          <span className='font-bold'>
            {currentFinancialCushionPercentage.toFixed(0)}%
          </span>
          {t('description3')}
        </p>
        <div className='mb-2'>
          <div className='mt-1 flex items-center justify-between gap-1'>
            <p className='flex flex-col items-start gap-1 text-sm text-primary/70 sm:flex-row sm:items-center'>
              {t('current')}
              <span className='font-bold'>
                <FormattedCurrency
                  valueCents={fortuneSummary.financialCushionAssetsValueSum}
                />
              </span>
            </p>
            <p className='flex flex-col items-end gap-1 text-sm text-primary/70 sm:flex-row sm:items-center'>
              {t('recommendation')}
              <span className='font-bold'>
                <FormattedCurrency
                  valueCents={fortuneSummary.monthlyOutcomesSum * 6}
                />
              </span>
            </p>
          </div>
        </div>

        <Progress
          value={currentFinancialCushionPercentage}
          className='h-2'
          progressBarClassName={cn(
            'bg-blue-600',
            currentFinancialCushionPercentage < 50 && 'bg-red-700'
          )}
          excessBarClassName='bg-primary/30'
          excess={50}
        />

        <div className='mt-4 flex justify-end'>
          <Link
            href={pathGenerators.fortune()}
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            {t('manageAssets')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
