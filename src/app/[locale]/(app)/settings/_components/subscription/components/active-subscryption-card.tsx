'use client';

import { Subscription, SubscriptionPlan } from '@prisma/client';
import { format } from 'date-fns';
import { Calendar, CreditCard } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';

import { useSubscriptionPortal } from '../hooks/use-subscription-portal';

export const ActiveSubscriptionCard = ({
  subscription,
  currency
}: {
  subscription: Subscription;
  currency: string;
}) => {
  const t = useTranslations('subscription.activeCard');
  const locale = useLocale();
  const { mutate: initiatePortal, isPending: isInitiatingPortal } =
    useSubscriptionPortal();

  return (
    <Card className='max-w-lg'>
      <CardContent className='space-y-4'>
        <h3 className='flex justify-between gap-2 text-xl font-semibold text-white'>
          {t('currentSubscription')}
          <Badge className='border-green-700 bg-green-900 text-green-300'>
            {t('active')}
          </Badge>
        </h3>
        <div className='space-y-2'>
          <div className='flex flex-col justify-between md:flex-row md:items-center'>
            <span className='text-primary/70'>{t('plan')}</span>
            <div className='flex items-center gap-2'>
              <CreditCard className='h-4 w-4 text-blue-400' />
              <span className='font-medium'>
                {subscription.plan === SubscriptionPlan.MONTHLY
                  ? t('monthly')
                  : t('yearly')}
              </span>
              <span className='text-sm text-primary/70'>
                (
                {subscription.plan === SubscriptionPlan.MONTHLY
                  ? t('monthlyPrice', {
                      price: formatCurrency({
                        cents: 999,
                        currency,
                        language: locale as Language
                      })
                    })
                  : t('yearlyPrice', {
                      price: formatCurrency({
                        cents: 9999,
                        currency,
                        language: locale as Language
                      })
                    })}
                )
              </span>
            </div>
          </div>

          <div className='flex flex-col justify-between md:flex-row md:items-center'>
            <span className='text-primary/70'>{t('currentPeriodEnds')}</span>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-orange-400' />
              <span className='font-medium'>
                {format(subscription.currentPeriodEnd, 'dd MMMM yyyy', {
                  locale: getDateFnsLocaleFromLanguage(locale as Language)
                })}
              </span>
            </div>
          </div>

          <div className='flex flex-col justify-between md:flex-row md:items-center'>
            <span className='text-primary/70'>{t('currentPeriodStarts')}</span>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-primary/70' />
              <span className='font-medium'>
                {format(subscription.currentPeriodStart, 'dd MMMM yyyy', {
                  locale: getDateFnsLocaleFromLanguage(locale as Language)
                })}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => initiatePortal()}
          loading={isInitiatingPortal}
          className='mt-2 w-full'
        >
          {t('manageSubscription')}
        </Button>
      </CardContent>
    </Card>
  );
};
