'use client';

import { SubscriptionPlan } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';

import { useSubscriptionCheckout } from '../hooks/use-subscription-checkout';

const monthlyPrice = 999;
const yearlyPrice = 9999;
const yearlySavings = 1998;
const yearlyTotal = 11988;

export const NoActiveSubscriptionCard = ({
  currency
}: {
  currency: string;
}) => {
  const t = useTranslations('subscription');
  const locale = useLocale();
  const { mutate: initiateCheckout, isPending: isInitiatingCheckout } =
    useSubscriptionCheckout();

  return (
    <div className='flex w-full flex-col gap-6 md:flex-row md:gap-8'>
      <Card className='relative flex max-w-lg grow flex-col items-center justify-center gap-2'>
        <CardHeader className='w-full pb-4 text-center'>
          <h3 className='text-3xl font-bold'>{t('monthly')}</h3>
          <p className='text-base text-primary/70'>{t('monthlyDescription')}</p>
          <div className='mt-4'>
            <span className='text-4xl font-black tracking-tighter  text-brand-primary'>
              {formatCurrency({
                cents: monthlyPrice,
                currency,
                language: locale as Language
              })}
            </span>
            <span className='text-md ml-1 text-primary/70'>
              {t('monthlyPriceSuffix')}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            className='w-full font-bold'
            onClick={() => initiateCheckout(SubscriptionPlan.MONTHLY)}
            loading={isInitiatingCheckout}
          >
            {t('monthlyButton')}
          </Button>
        </CardContent>
      </Card>

      <Card className='relative flex max-w-lg grow flex-col items-center justify-center gap-2 border-2 border-green-500'>
        <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 transform bg-green-600 text-sm font-semibold text-white'>
          {t('yearlySavings', {
            savings: formatCurrency({
              cents: yearlySavings,
              currency,
              language: locale as Language
            })
          })}
        </Badge>
        <CardHeader className='w-full pb-4 pt-6 text-center'>
          <h3 className='text-3xl font-bold'>{t('yearly')}</h3>
          <p className='text-base text-primary/70'>{t('yearlyDescription')}</p>
          <div className='mt-4'>
            <span className='text-4xl font-black tracking-tighter text-green-600'>
              {formatCurrency({
                cents: yearlyPrice,
                currency,
                language: locale as Language
              })}
            </span>
            <span className='text-md ml-1 text-primary/70'>
              {t('yearlyPriceSuffix')}
            </span>
          </div>
          <div className='text-sm text-primary/70'>
            <span className='line-through'>
              {formatCurrency({
                cents: yearlyTotal,
                currency,
                language: locale as Language
              })}
            </span>
            <span className='ml-2 font-medium text-green-600'>
              {t('yearlySavings', {
                savings: formatCurrency({
                  cents: yearlySavings,
                  currency,
                  language: locale as Language
                })
              })}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            className='mb-6 w-full bg-green-600 font-bold hover:bg-green-700'
            onClick={() => initiateCheckout(SubscriptionPlan.YEARLY)}
            loading={isInitiatingCheckout}
          >
            {t('yearlyButton')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
