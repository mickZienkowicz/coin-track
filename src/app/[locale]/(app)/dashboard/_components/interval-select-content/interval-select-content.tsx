import { Interval } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { SelectContent, SelectItem } from '@/components/ui/select';

export const IntervalSelectContent = () => {
  const t = useTranslations('interval');

  return (
    <SelectContent>
      <SelectItem value={Interval.DAY}>{t('day')}</SelectItem>
      <SelectItem value={Interval.WEEK}>{t('week')}</SelectItem>
      <SelectItem value={Interval.TWO_WEEKS}>{t('twoWeeks')}</SelectItem>
      <SelectItem value={Interval.MONTH}>{t('month')}</SelectItem>
      <SelectItem value={Interval.TWO_MONTHS}>{t('twoMonths')}</SelectItem>
      <SelectItem value={Interval.QUARTER}>{t('quarter')}</SelectItem>
      <SelectItem value={Interval.YEAR}>{t('year')}</SelectItem>
    </SelectContent>
  );
};
