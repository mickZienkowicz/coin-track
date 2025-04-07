import { ArrowDownCircle, ArrowUpCircle, CircleEqual } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const BudgetSummaryBadge = ({
  balance,
  className
}: {
  balance?: number;
  className?: string;
}) => {
  const t = useTranslations('budgetSummary');

  if (!balance) {
    return null;
  }

  return (
    <Badge
      className={cn(
        'text-md h-11 w-auto bg-yellow-700 px-4 py-2 font-bold tracking-tight text-white',
        className,
        balance > 0 && 'bg-green-700',
        balance < 0 && 'bg-red-700'
      )}
    >
      {t('balanceSummary')} {balance > 0 && '+'}
      <FormattedCurrency valueCents={balance} />
      {balance > 0 && (
        <ArrowUpCircle className='size-5! ml-2 shrink-0 text-white' />
      )}
      {balance < 0 && (
        <ArrowDownCircle className='size-5! ml-2 shrink-0 text-white' />
      )}
      {balance === 0 && (
        <CircleEqual className='size-5! ml-2 shrink-0 text-white' />
      )}
    </Badge>
  );
};
