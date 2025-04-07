import { format } from 'date-fns';
import { ArrowUpCircle, PlusCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Language } from '@/i18n/routing';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import type { IncomeWithCurrentBudgetOccurance } from '@/server/budget/types';

import { AddIncomeDialog } from '../../../budget-configuration/_components/income/add-income/add-income-dialog';

export const BudgetSummaryIncomeList = ({
  incomes,
  incomesSum
}: {
  incomes: IncomeWithCurrentBudgetOccurance[];
  incomesSum: number;
}) => {
  const locale = useLocale();
  const t = useTranslations('budget.incomes');

  return (
    <div className='mb-12 flex flex-col gap-4'>
      <Card className='py-5! mb-2'>
        <CardContent>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-xl font-semibold'>
              <div className='mr-2 flex size-9  items-center justify-center rounded-full bg-green-600/20'>
                <ArrowUpCircle className='size-5 text-green-600' />
              </div>
              {t('budgetSummary.title')}
            </h2>
            <AddIncomeDialog>
              <Button
                variant='secondary'
                size='iconSmall'
                aria-label={t('addIncomeButton')}
              >
                <PlusCircle className='h-4 w-4' />
              </Button>
            </AddIncomeDialog>
          </div>
        </CardContent>
      </Card>
      {incomesSum > 0 && (
        <Card className='py-4! mb-2'>
          <CardContent>
            <p className='flex flex-col'>
              <span className='flex items-center justify-between text-[26px] font-bold text-green-600'>
                <FormattedCurrency valueCents={incomesSum} />
              </span>
              <span className='text-sm text-primary/70'>
                {t('budgetSummary.listOfIncomes')}
              </span>
            </p>
          </CardContent>
        </Card>
      )}
      {incomes.length > 0 && (
        <ul className='flex flex-col gap-3'>
          {incomes.map((income) => (
            <li key={income.id}>
              <Card className='py-4!'>
                <CardContent>
                  <div className='flex items-center justify-between gap-3'>
                    <h3 className='overflow-hidden text-ellipsis break-words text-xl font-semibold'>
                      {income.name}
                    </h3>
                    <p className='text-xl font-bold text-green-600'>
                      <FormattedCurrency
                        valueCents={
                          income.valueCents * income.occurrences.length
                        }
                      />
                    </p>
                  </div>
                  {income.occurrences.length > 1 ? (
                    <>
                      <p className='mt-4 flex justify-between text-sm text-primary/70'>
                        {t('budgetSummary.occurrences')}
                        <span className='font-semibold text-primary/70'>
                          {income.occurrences.length}
                        </span>
                      </p>
                      <p className='mt-1 flex justify-between text-sm text-primary/70'>
                        {t('budgetSummary.singleOccurrence')}
                        <span className='font-semibold text-primary/70'>
                          <FormattedCurrency valueCents={income.valueCents} />
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className='mt-1 text-sm text-primary/70'>
                      {income.occurrences.map((date, index) => (
                        <span key={date.toISOString()}>
                          {format(date, 'd MMMM yyyy', {
                            locale: getDateFnsLocaleFromLanguage(
                              locale as Language
                            )
                          })}
                          {index < income.occurrences.length - 1 && ', '}
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
      {incomes.length === 0 && (
        <Card className='w-full'>
          <CardContent className='flex flex-col items-center text-center'>
            <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
              <ArrowUpCircle className='h-8 w-8 text-green-600' />
            </div>
            <h2 className='mb-3 text-2xl font-semibold'>
              {t('noIncomesCard.title')}
            </h2>
            <p className='mb-6 max-w-xl text-muted-foreground'>
              {t('noIncomesCard.description')}
            </p>
            <AddIncomeDialog>
              <Button variant='secondary' size='sm' className='mb-2'>
                <ArrowUpCircle className='h-4 w-4' />
                {t('addIncomeButton')}
              </Button>
            </AddIncomeDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
