import { format } from 'date-fns';
import { ArrowDownCircle, PlusCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import type { OutcomeWithCurrentBudgetOccurance } from '@/server/budget/types';

import { AddOutcomeDialog } from '../../../outcome/add-outcome/add-outcome-dialog';

export const BudgetSummaryOutcomeList = ({
  currency,
  outcomesSum,
  outcomes
}: {
  currency: string;
  outcomesSum: number;
  outcomes: OutcomeWithCurrentBudgetOccurance[];
}) => {
  const locale = useLocale();
  const t = useTranslations('budget.outcomes');

  return (
    <div className='mb-12 flex flex-col gap-4'>
      <Card className='py-5! mb-2'>
        <CardContent>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-xl font-semibold'>
              <div className='mr-2 flex size-9  items-center justify-center rounded-full bg-red-600/20'>
                <ArrowDownCircle className='size-5 text-red-600' />
              </div>
              {t('budgetSummary.title')}
            </h2>
            <AddOutcomeDialog currency={currency}>
              <Button
                variant='secondary'
                size='iconSmall'
                aria-label={t('addOutcomeButton')}
              >
                <PlusCircle className='h-4 w-4' />
              </Button>
            </AddOutcomeDialog>
          </div>
        </CardContent>
      </Card>
      <Card className='py-4! mb-2'>
        <CardContent>
          <p className='flex flex-col'>
            <span className='flex items-center justify-between text-[26px] font-bold text-red-700'>
              {formatCurrency({
                cents: outcomesSum,
                currency,
                language: locale as Language
              })}
            </span>
            <span className='text-sm text-primary/50'>
              {t('budgetSummary.listOfOutcomes')}
            </span>
          </p>
        </CardContent>
      </Card>
      {outcomes.length > 0 && (
        <ul className='flex flex-col gap-3'>
          {outcomes.map((outcome) => (
            <li key={outcome.id}>
              <Card className='py-4!'>
                <CardContent>
                  <div className='flex items-center justify-between gap-2'>
                    <h3 className='text-xl font-semibold'>{outcome.name}</h3>
                    <p className='text-xl font-bold text-red-700'>
                      {formatCurrency({
                        cents: outcome.valueCents * outcome.occurrences.length,
                        currency,
                        language: locale as Language
                      })}
                    </p>
                  </div>
                  {outcome.occurrences.length > 1 ? (
                    <>
                      <p className='mt-4 flex justify-between text-sm text-primary/60'>
                        {t('budgetSummary.occurrences')}
                        <span className='font-semibold text-primary/70'>
                          {outcome.occurrences.length}
                        </span>
                      </p>
                      <p className='mt-1 flex justify-between text-sm text-primary/60'>
                        {t('budgetSummary.singleOccurrence')}
                        <span className='font-semibold text-primary/70'>
                          {formatCurrency({
                            cents: outcome.valueCents,
                            currency,
                            language: locale as Language
                          })}
                        </span>
                      </p>
                      <p className='mt-1 flex justify-between gap-1 text-sm text-primary/60'>
                        <span className='min-w-[160px]'>
                          {t('budgetSummary.datesOfOccurrences')}
                        </span>
                        <span className='text-end font-semibold text-primary/70'>
                          {outcome.occurrences.map((date, index) => (
                            <span key={date.toISOString()}>
                              {format(date, 'd MMMM', {
                                locale: getDateFnsLocaleFromLanguage(
                                  locale as Language
                                )
                              })}
                              {index < outcome.occurrences.length - 1 && ', '}
                            </span>
                          ))}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className='text-sm text-primary/70'>
                      {outcome.occurrences.map((date, index) => (
                        <span key={date.toISOString()}>
                          {format(date, 'd MMMM yyyy', {
                            locale: getDateFnsLocaleFromLanguage(
                              locale as Language
                            )
                          })}
                          {index < outcome.occurrences.length - 1 && ', '}
                        </span>
                      ))}
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
      {outcomes.length === 0 && (
        <Card className='w-full'>
          <CardContent className='flex flex-col items-center text-center'>
            <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
              <ArrowDownCircle className='h-8 w-8 text-red-600' />
            </div>
            <h2 className='mb-3 text-2xl font-semibold'>
              {t('noOutcomesCard.title')}
            </h2>
            <p className='mb-6 max-w-xl text-muted-foreground'>
              {t('noOutcomesCard.description')}
            </p>
            <AddOutcomeDialog currency={currency}>
              <Button variant='secondary' size='sm' className='mb-2'>
                <ArrowDownCircle className='h-4 w-4' />
                {t('addOutcomeButton')}
              </Button>
            </AddOutcomeDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
