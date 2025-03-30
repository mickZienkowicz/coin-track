'use client';

import { format } from 'date-fns';
import { ChevronsUpDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import type { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies';
import { getDateFnsLocaleFromLanguage } from '@/lib/locale/get-date-fns-locale-from-language';
import { cn } from '@/lib/utils';
import { PouchWithCurrentBudgetOccurance } from '@/server/budget/types';

import { AddPouchOutcomeDialog } from '../../../../pouch/add-pouch-outcome/add-pouch-outcome-dialog';
import { EditPouchOutcomeDialog } from '../../../../pouch/edit-pouch-outcome/edit-pouch-outcome-dialog';
import { PouchOutcomeProgressBar } from '../../../../pouch/pouch-outcome-progress-bar';
import { RemovePouchOutcomeDialog } from '../../../../pouch/remove-pouch-outcome/remove-pouch-outcome-dialog';

export const PouchDetailsCard = ({
  pouch,
  currency,
  pouches
}: {
  pouch: PouchWithCurrentBudgetOccurance;
  pouches: PouchWithCurrentBudgetOccurance[];
  currency: string;
}) => {
  const t = useTranslations('budget.pouch.budgetSummary');
  const locale = useLocale();

  const expensesSum = pouch.pouchExpenses.reduce(
    (acc, expense) => acc + expense.valueCents,
    0
  );

  const pouchFullCapacity = pouch.valueCents * pouch.occurrences.length;

  const pouchPercetageUsage =
    expensesSum <= 0 ? 0 : (expensesSum / pouchFullCapacity) * 100;

  return (
    <Card>
      <CardContent>
        <h3 className='mb-1 flex justify-between gap-2 text-2xl font-bold'>
          {pouch.name}
          <Badge
            className={cn(
              'bg-blue-600 font-bold tracking-tighter text-white',
              pouchPercetageUsage >= 100 && 'bg-red-700'
            )}
          >
            {pouchPercetageUsage.toFixed(0)}%
          </Badge>
        </h3>
        <p className='text-sm text-primary/60'>
          {t('occurrences')}
          <span className='font-semibold text-primary/70'>
            {pouch.occurrences.length}
          </span>
        </p>
        <div className='mb-2 mt-4 flex items-center justify-between gap-2'>
          <p className='flex flex-col'>
            <span className='text-xl font-bold'>
              {formatCurrency({
                cents: pouchFullCapacity,
                currency,
                language: locale as Language
              })}
            </span>
            <span className='text-sm text-primary/70'>{t('capacity')}</span>
          </p>
          <p className='flex flex-col'>
            <span
              className={cn(
                'text-right text-xl font-bold text-blue-500',
                pouchPercetageUsage >= 100 && 'text-red-700'
              )}
            >
              {formatCurrency({
                cents: expensesSum,
                currency,
                language: locale as Language
              })}
            </span>
            <span className='text-right text-sm text-primary/70'>
              {t('expensesSum')}
            </span>
          </p>
        </div>
        <PouchOutcomeProgressBar pouch={pouch} />
        <div>
          {pouch.pouchExpenses.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <h5 className='mt-7 flex w-full items-center justify-between gap-2 text-sm text-primary/80'>
                  {t('seeFullList')}
                  <Button variant='outline' size='iconSmall'>
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
                            {formatCurrency({
                              cents: expense.valueCents,
                              currency,
                              language: locale as Language
                            })}
                          </p>
                        </div>
                        <div className='flex flex-col gap-2'>
                          <div className='flex justify-end gap-2'>
                            <EditPouchOutcomeDialog
                              currency={currency}
                              pouchOutcome={expense}
                            />
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
        <div className='mt-5 flex items-center justify-end'>
          <AddPouchOutcomeDialog
            currency={currency}
            pouches={pouches}
            pouchId={pouch.id}
          />
        </div>
      </CardContent>
    </Card>
  );
};
