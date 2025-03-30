import { ArrowDownCircle, ArrowUpCircle, CircleEqual } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Language } from '@/i18n/routing';
import { formatCurrency } from '@/lib/currencies/format-currency';
import { cn } from '@/lib/utils';

export const BudgetSummaryBadge = ({
  balance,
  currency
}: {
  balance?: number;
  currency?: string;
}) => {
  const t = useTranslations('budgetSummary');
  const locale = useLocale();

  if (!balance || !currency) {
    return null;
  }

  return (
    <Badge
      className={cn(
        'text-md @xl:w-auto h-11 w-full bg-yellow-700 px-4 py-2 font-bold tracking-tight text-white',
        balance > 0 && 'bg-green-700',
        balance < 0 && 'bg-red-700'
      )}
    >
      {t('balanceSummary')} {balance > 0 && '+'}
      {formatCurrency({
        cents: balance,
        currency,
        language: locale as Language
      })}
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
