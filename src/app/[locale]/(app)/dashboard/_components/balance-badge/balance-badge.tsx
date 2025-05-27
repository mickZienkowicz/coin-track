import { ArrowDownCircle, ArrowUpCircle, CircleEqual } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const BalanceBadge = ({
  balanceSum,
  className
}: {
  balanceSum: number;
  className?: string;
}) => {
  const t = useTranslations('budgetSummary');

  return (
    <Badge
      className={cn(
        '@sm:order-1 @sm:mb-0 -order-1 mb-2 bg-yellow-700 font-bold tracking-tighter text-white',
        balanceSum > 0 && 'bg-green-700 text-white',
        balanceSum < 0 && 'bg-red-800 text-white',
        className
      )}
    >
      {balanceSum > 0 && (
        <>
          {t('positiveBalance')}
          <ArrowUpCircle className='size-4! text-white' />
        </>
      )}
      {balanceSum < 0 && (
        <>
          {t('negativeBalance')}
          <ArrowDownCircle className='size-4! text-white' />
        </>
      )}
      {balanceSum === 0 && (
        <>
          {t('neutralBalance')}
          <CircleEqual className='size-4! text-white' />
        </>
      )}
    </Badge>
  );
};
