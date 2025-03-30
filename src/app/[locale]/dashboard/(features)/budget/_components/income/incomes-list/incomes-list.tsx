import { ArrowUpCircle, PlusCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getIncomes } from '@/server/income/queries/get-incomes';

import { AddIncomeDialog } from '../add-income/add-income-dialog';
import { IncomeCard } from '../income-card/income-card';

export const IncomesList = async ({ currency }: { currency: string }) => {
  const t = await getTranslations('budget.incomes');
  const incomes = await getIncomes();

  return (
    <div className='mb-12 flex flex-col gap-4'>
      <Card className='py-5! mb-2'>
        <CardContent>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-xl font-semibold'>
              <div className='mr-2 flex size-9  items-center justify-center rounded-full bg-green-600/20'>
                <ArrowUpCircle className='size-5 text-green-600' />
              </div>
              {t('title')}
            </h2>
            <AddIncomeDialog currency={currency}>
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
      <ul className='flex flex-col gap-4'>
        {incomes.map((income) => (
          <li key={income.id}>
            <IncomeCard income={income} currency={currency} />
          </li>
        ))}
        {incomes.length === 0 && (
          <li>
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
                <AddIncomeDialog currency={currency}>
                  <Button variant='secondary' size='sm' className='mb-2'>
                    <ArrowUpCircle className='h-4 w-4' />
                    {t('addIncomeButton')}
                  </Button>
                </AddIncomeDialog>
              </CardContent>
            </Card>
          </li>
        )}
      </ul>
    </div>
  );
};
