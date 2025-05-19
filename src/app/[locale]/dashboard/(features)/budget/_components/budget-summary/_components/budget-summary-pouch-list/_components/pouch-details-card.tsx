'use client';

import { RecurrenceType } from '@prisma/client';
import { format } from 'date-fns';
import { ChevronsUpDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import type { Language } from '@/i18n/routing';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import { cn } from '@/lib/utils';
import { PouchWithCurrentBudgetOccurance } from '@/server/budget/types';

import { AddPouchOutcomeDialog } from '../../../../budget-configuration/_components/pouch/add-pouch-outcome/add-pouch-outcome-dialog';
import { EditPouchOutcomeDialog } from '../../../../budget-configuration/_components/pouch/edit-pouch-outcome/edit-pouch-outcome-dialog';
import { PouchOutcomeProgressBar } from '../../../../budget-configuration/_components/pouch/pouch-outcome-progress-bar';
import { RemovePouchOutcomeDialog } from '../../../../budget-configuration/_components/pouch/remove-pouch-outcome/remove-pouch-outcome-dialog';

export const PouchDetailsCard = ({
  pouch,
  pouches,
  isTransferingPouchesBalance,
  isPreview
}: {
  pouch: PouchWithCurrentBudgetOccurance;
  pouches: PouchWithCurrentBudgetOccurance[];
  isTransferingPouchesBalance: boolean;
  isPreview: boolean;
}) => {
  const t = useTranslations('budget.pouch.budgetSummary');
  const locale = useLocale();

  const expensesSum = pouch.pouchExpenses.reduce(
    (acc, expense) => acc + expense.valueCents,
    0
  );

  const pouchFullCapacity =
    pouch.valueCents +
    pouch.eachOccuranceValueCents * (pouch.occurrences.length - 1);

  const pouchPercetageUsage =
    expensesSum <= 0 ? 0 : (expensesSum / pouchFullCapacity) * 100;

  const thisPeriodPouchCapacity =
    pouch.eachOccuranceValueCents * pouch.occurrences.length;

  return (
    <Card className='pb-4! w-full gap-4' data-tour='pouch-card'>
      <CardContent>
        <h3 className='mb-1 flex items-center justify-between gap-2 text-2xl font-bold'>
          <span className='overflow-hidden text-ellipsis break-words'>
            {pouch.name}
          </span>
          <Badge
            className={cn(
              'bg-blue-600 font-bold tracking-tighter text-white',
              pouchPercetageUsage > 100 && 'bg-red-700'
            )}
          >
            {pouchPercetageUsage.toFixed(0)}%
          </Badge>
        </h3>
        <p className='text-sm text-primary/70'>
          {t('capacity')}:{' '}
          <span className='font-semibold text-primary/70'>
            <FormattedCurrency valueCents={thisPeriodPouchCapacity} />
          </span>
          {pouch.recurrence !== RecurrenceType.ONE_TIME &&
            isTransferingPouchesBalance && (
              <span> ({t('withoutTransfers')})</span>
            )}
        </p>
        {pouch.valueCents - thisPeriodPouchCapacity !== 0 && (
          <p className='mt-1 text-sm text-primary/70'>
            {t('transferredFromPreviousPeriods')}:{' '}
            <span className='font-semibold text-primary/70'>
              <FormattedCurrency
                valueCents={pouch.valueCents - thisPeriodPouchCapacity}
              />
            </span>
          </p>
        )}
        <div className='mb-2 mt-4 flex items-center justify-between gap-2'>
          <p className='flex flex-col'>
            <span
              className={cn(
                'text-left text-xl font-bold text-blue-500',
                pouchPercetageUsage > 100 && 'text-red-700'
              )}
            >
              <FormattedCurrency valueCents={expensesSum} />
            </span>
            <span className='text-left text-sm text-primary/70'>
              {t('expensesSum')}
            </span>
          </p>
          <p className='flex flex-col'>
            <span className='text-right text-xl font-bold'>
              <FormattedCurrency valueCents={pouchFullCapacity - expensesSum} />
            </span>
            <span className='text-right text-sm text-primary/70'>
              {!isPreview ? t('leftCapacity') : t('unusedCapacity')}
            </span>
          </p>
        </div>
        <PouchOutcomeProgressBar pouch={pouch} />
        <div>
          {pouch.pouchExpenses.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <h5 className='mt-7 flex w-full items-center justify-between gap-2 text-sm text-primary/70'>
                  {t('seeFullList')}
                  <Button
                    variant='outline'
                    size='iconSmall'
                    data-tour='pouch-card-expenses-button'
                  >
                    <ChevronsUpDown className='h-4 w-4' />
                    <span className='sr-only'>{t('toggleList')}</span>
                  </Button>
                </h5>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className='mt-3 flex flex-col gap-3'>
                  {pouch.pouchExpenses.map((expense) => (
                    <li key={expense.id} className='flex justify-between'>
                      <Card className='px-4! py-3.5! flex w-full flex-row justify-between gap-1'>
                        <div className='flex flex-col justify-center gap-[2px] text-primary/90'>
                          <p className='text-lg font-semibold'>
                            {expense.name}
                          </p>
                          <p className='text-sm text-primary/70'>
                            {format(expense.date, 'd MMMM yyyy', {
                              locale: getDateFnsLocaleFromLanguage(
                                locale as Language
                              )
                            })}
                          </p>
                          <p className='mt-1 text-xl font-bold'>
                            <FormattedCurrency
                              valueCents={expense.valueCents}
                            />
                          </p>
                        </div>
                        <div className='flex flex-col gap-2'>
                          <div className='flex justify-end gap-2'>
                            <EditPouchOutcomeDialog pouchOutcome={expense} />
                            <RemovePouchOutcomeDialog
                              pouchOutcomeId={expense.id}
                            />
                          </div>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
      {!isPreview && (
        <CardFooter className='pt-4! flex w-full items-center justify-end gap-4 border-t border-sidebar-border'>
          <AddPouchOutcomeDialog pouches={pouches} pouchId={pouch.id} />
        </CardFooter>
      )}
    </Card>
  );
};
