import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

const CardItem = ({
  icon,
  title,
  value
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className='flex items-center gap-3 text-lg'>
    {icon}
    <div className='flex flex-col'>
      <h4 className='text-[22px] font-black leading-6 2xl:hidden '>{value}</h4>
      <p className='text-sm font-normal text-primary/70 2xl:hidden'>{title}</p>
    </div>
  </div>
);

export const MobileFortuneCard = ({
  netWorth,
  assetsCount,
  debtsCount,
  lastUpdateDate
}: {
  netWorth: string;
  assetsCount: string;
  debtsCount: string;
  lastUpdateDate: string;
}) => {
  const t = useTranslations('dashboard.fortune');

  return (
    <Card className='gap-3'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between '>
          <div className='order-2 flex items-center gap-3 xl:order-1'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
              <Wallet className='size-5 text-blue-600 md:size-6' />
            </div>

            <div className='flex flex-col'>
              <h2 className='text-2xl font-bold'>{t('cardTitle')}</h2>
              <p className='text-sm font-normal text-primary/70 '>{`${t('assetsDescription')} ${lastUpdateDate}`}</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          <CardItem
            icon={
              <div className='flex size-7  shrink-0 items-center justify-center rounded-full bg-green-600/20'>
                <TrendingUp className='size-4.5 text-green-600' />
              </div>
            }
            title={t('assets')}
            value={assetsCount}
          />
          <CardItem
            icon={
              <div className='flex size-7  shrink-0 items-center justify-center rounded-full bg-red-600/20'>
                <TrendingDown className='size-4.5 text-red-600' />
              </div>
            }
            title={t('debts')}
            value={debtsCount}
          />
          <CardItem
            icon={
              <div className='flex size-7  shrink-0 items-center justify-center rounded-full bg-blue-600/20'>
                <Wallet className='size-4.5 text-blue-600' />
              </div>
            }
            title={t('netWorth')}
            value={netWorth}
          />
        </div>
        <div className='mt-4 flex justify-end'>
          <Link
            className={cn(buttonVariants({ size: 'sm' }))}
            href={pathGenerators.fortune()}
          >
            {t('manageAssets')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
