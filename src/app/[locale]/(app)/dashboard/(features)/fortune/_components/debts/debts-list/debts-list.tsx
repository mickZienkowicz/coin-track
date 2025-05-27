import { PlusCircle, TrendingDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { AdditionalInfoTooltip } from '@/components/additional-info-tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DebtWithAdditionalInfo } from '@/server/fortune/queries/get-forune-summary';

import { AddDebtDialog } from '../add-debt/add-debt-dialog';
import { DebtDetailsCard } from '../debt-details-card';

export const DebtsList = async ({
  debts,
  totalDebts
}: {
  debts: DebtWithAdditionalInfo[];
  totalDebts: number;
}) => {
  const t = await getTranslations('fortune.debts');

  return (
    <div className='mb-12 flex flex-col gap-4'>
      <Card className='py-5! mb-2'>
        <CardContent>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-xl font-semibold'>
              <div className='mr-2 flex size-9  items-center justify-center rounded-full bg-red-700/20'>
                <TrendingDown className='size-5 text-red-700' />
              </div>
              {t('title')}
              <AdditionalInfoTooltip text='Pasywa to wszystkie Twoje zobowiązania finansowe, np. Pozostała do spłaty kwota kredytu razem z odsetkami.' />
            </h2>
            <AddDebtDialog>
              <Button
                variant='secondary'
                size='iconSmall'
                aria-label={t('addDebtButton')}
                data-tour='add-debt-button'
              >
                <PlusCircle className='h-4 w-4' />
              </Button>
            </AddDebtDialog>
          </div>
        </CardContent>
      </Card>
      <ul className='flex flex-col gap-4'>
        {debts.map((debt) => (
          <li key={debt.id}>
            <DebtDetailsCard debt={debt} totalDebts={totalDebts} />
          </li>
        ))}
        {debts.length === 0 && (
          <li>
            <Card className='w-full'>
              <CardContent className='flex flex-col items-center text-center'>
                <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                  <TrendingDown className='h-8 w-8 text-red-700' />
                </div>
                <h2 className='mb-3 text-2xl font-semibold'>
                  {t('noDebtsCard.title')}
                </h2>
                <p className='mb-6 max-w-xl text-muted-foreground'>
                  {t('noDebtsCard.description')}
                </p>
                <AddDebtDialog>
                  <Button variant='secondary' size='sm' className='mb-2'>
                    <TrendingDown className='h-4 w-4' />
                    {t('addDebtButton')}
                  </Button>
                </AddDebtDialog>
              </CardContent>
            </Card>
          </li>
        )}
      </ul>
    </div>
  );
};
