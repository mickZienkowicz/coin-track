import { RecurrenceType } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { SelectContent, SelectItem } from '@/components/ui/select';

export const RecurrenceSelectContent = () => {
  const t = useTranslations('recurrence');

  return (
    <SelectContent>
      <SelectItem value={RecurrenceType.ONE_TIME}>{t('oneTime')}</SelectItem>
      <SelectItem value={RecurrenceType.INFINITE}>{t('infinite')}</SelectItem>
      <SelectItem value={RecurrenceType.MULTIPLE}>{t('multiple')}</SelectItem>
    </SelectContent>
  );
};
