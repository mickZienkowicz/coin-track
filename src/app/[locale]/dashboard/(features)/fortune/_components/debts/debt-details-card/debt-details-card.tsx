import { format } from 'date-fns';
import { ArrowDownCircle, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DebtWithAdditionalInfo } from '@/server/fortune/queries/get-forune-summary';

import { getPercentageOfWholeFortune } from '../../fortune-structure/utils';
import { DeleteDebtDialog } from '../delete-debt/delete-debt-dialog';
import { EditDebtDialog } from '../edit-debt/edit-debt-dialog';

export const DebtDetailsCard = ({
  debt,
  totalDebts
}: {
  debt: DebtWithAdditionalInfo;
  totalDebts: number;
}) => {
  const t = useTranslations('fortune.debts.debtDetailsCard');

  return (
    <Card className='pb-4! @container w-full gap-4' data-tour='debt-card'>
      <CardHeader
        className={cn(
          'mb-2 flex flex-col items-start justify-between gap-4 md:flex-row'
        )}
      >
        <div className='flex w-full flex-col gap-1.5'>
          <div className='flex w-full items-center justify-between gap-3'>
            <h3 className='overflow-hidden text-ellipsis break-words text-2xl font-semibold'>
              {debt.name}
            </h3>
          </div>
          <p className='text-sm text-primary/70'>
            <Calendar className='mr-1 inline-block h-3.5 w-3.5' />
            {t('lastUpdate')} {format(debt.updatedAt, 'dd.MM.yyyy')}
          </p>
        </div>
        <div className='flex shrink-0 items-center'>
          <div className='flex items-center rounded-full bg-blue-50 px-3 py-1'>
            <span className='text-xs font-medium text-blue-700'>
              {getPercentageOfWholeFortune(debt.valueCents, totalDebts)}%{' '}
              {t('yourDebts')}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <div className='flex flex-col justify-between gap-4'>
          <div className='-order-1 flex items-center md:order-1'>
            <div className='mr-3 flex size-12 items-center justify-center rounded-full bg-red-700/10'>
              <ArrowDownCircle className='size-6 text-red-700' />
            </div>
            <div>
              <p className='text-sm font-medium text-primary/70'>
                {t('amount')}
              </p>
              <p className='text-2xl font-bold'>
                <FormattedCurrency valueCents={debt.valueCents} />
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-4! mt-1 flex w-full items-center justify-end gap-4 border-t border-sidebar-border'>
        <EditDebtDialog debt={debt} />
        <DeleteDebtDialog debt={debt} />
      </CardFooter>
    </Card>
  );
};
