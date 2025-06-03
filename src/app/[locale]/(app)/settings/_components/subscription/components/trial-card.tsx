import { differenceInDays, format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Language } from '@/i18n/routing';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import { cn } from '@/lib/utils';

import { ChooseSubscriptionDialog } from './choose-subscription-dialog';

export const TrialCard = ({
  trialEndsAt,
  currency
}: {
  trialEndsAt: Date;
  currency: string;
}) => {
  const t = useTranslations('subscription');
  const locale = useLocale();
  const daysRemaining = differenceInDays(trialEndsAt, new Date());
  const progress = ((7 - daysRemaining) / 7) * 100;

  return (
    <Card className='max-w-lg'>
      <CardContent>
        <div className='space-y-4'>
          <div className='mb-5 flex items-center gap-3'>
            <Clock className='h-6 w-6 text-brand-primary' />
            <h3 className='text-xl font-bold'>{t('trial')}</h3>
          </div>

          <div className='mt-2 space-y-2'>
            <div className='mt-2 flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-primary/70' />
              <p className='text-base text-gray-300'>
                {t('trialDescription', {
                  date: format(trialEndsAt, 'd MMMM yyyy', {
                    locale: getDateFnsLocaleFromLanguage(locale as Language)
                  })
                })}
              </p>
            </div>
          </div>

          <div>
            <p className='mb-1 text-base font-semibold text-primary/70'>
              {t('trialDaysRemaining')}
              <span
                className={cn(
                  'text-lg font-black text-brand-primary',
                  progress >= 60 && 'text-orange-400',
                  progress >= 80 && 'text-red-400'
                )}
              >
                {daysRemaining + 1}
              </span>
            </p>
            <Progress
              value={progress}
              progressBarClassName={cn(
                'bg-brand-primary',
                progress >= 60 && 'bg-orange-600',
                progress >= 80 && 'bg-red-600'
              )}
            />
          </div>
        </div>
        <div className='mt-4 flex justify-end'>
          <ChooseSubscriptionDialog
            currency={currency}
            buttonText={t('trialChooseSubscriptionButton')}
          />
        </div>
      </CardContent>
    </Card>
  );
};
