import { useTranslations } from 'next-intl';

export const BudgetHistoryChartLegend = () => {
  const t = useTranslations('dashboard.history');

  return (
    <ul className='mx-auto mt-1 flex justify-center gap-8'>
      <li className='flex items-center justify-center gap-2 text-primary/70'>
        {t('incomes')}
        <div className='rounded-xs size-2 bg-[#008236]' />
      </li>
      <li className='flex items-center justify-center gap-2 text-primary/70'>
        {t('outcomes')}
        <div className='rounded-xs size-2 bg-[#AF0000]' />
      </li>
      <li className='flex items-center justify-center gap-2 text-primary/70'>
        {t('balance')}
        <div className='rounded-xs size-2 bg-[#155CFC]' />
      </li>
    </ul>
  );
};
