'use client';

import { ReactNode } from 'react';
import {
  ChartNoAxesCombined,
  ChartPie,
  House,
  Shield,
  Wallet
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AdditionalInfoTooltip } from '@/components/additional-info-tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CardItem = ({
  icon,
  title,
  detailedInfo,
  value,
  percentage,
  dataTour
}: {
  icon: React.ReactNode;
  title: string;
  detailedInfo?: string;
  value: ReactNode;
  percentage: number;
  dataTour?: string;
}) => (
  <div
    className='flex items-center justify-between md:hidden'
    data-tour={dataTour}
  >
    <div className='flex items-center gap-3 text-lg'>
      {icon}
      <div className='flex flex-col'>
        <h4 className='text-[22px] font-black leading-6 2xl:hidden '>
          {value}
          {detailedInfo && <AdditionalInfoTooltip text={detailedInfo} />}
        </h4>
        <p className='text-xs font-normal text-primary/70 2xl:hidden'>
          {title}
        </p>
      </div>
    </div>
    <Badge className='bg-blue-600 text-xs font-bold tracking-tighter text-white'>
      {percentage.toFixed(0)}%
    </Badge>
  </div>
);

export const MobileFortunesStructureCard = ({
  financialCushion,
  financialCushionPercentageOfWholeFortune,
  livingAssets,
  livingAssetsPercentageOfWholeFortune,
  investments,
  investmentsPercentageOfWholeFortune,
  restOfAssets,
  restOfAssetsPercentageOfWholeFortune,
  monthlySpendingsMultiplier
}: {
  financialCushion: ReactNode;
  financialCushionPercentageOfWholeFortune: number;
  livingAssets: ReactNode;
  livingAssetsPercentageOfWholeFortune: number;
  investments: ReactNode;
  investmentsPercentageOfWholeFortune: number;
  restOfAssets: ReactNode;
  restOfAssetsPercentageOfWholeFortune: number;
  monthlySpendingsMultiplier: number;
}) => {
  const t = useTranslations('dashboard.fortune');

  return (
    <Card className='gap-3'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
              <ChartPie className='size-5 text-blue-600 md:size-6' />
            </div>

            <div className='flex flex-col gap-1'>
              <h2 className='text-2xl font-bold'>{t('structure')}</h2>
            </div>
          </div>
          <p className='flex flex-col-reverse gap-1 text-sm font-normal text-primary/70'>
            <Badge className='bg-blue-600 font-bold tracking-tighter text-white'>
              {monthlySpendingsMultiplier.toFixed(1)}x {t('monthlySpendings')}
            </Badge>
            <span>{t('yourMonthlySpendings')} </span>
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-6'>
          <CardItem
            icon={
              <div className='flex size-8  shrink-0 items-center justify-center rounded-full bg-blue-600/20'>
                <Shield className='size-4.5 text-blue-600' />
              </div>
            }
            title={t('financialCushion')}
            detailedInfo={t('financialCushionDetailedInfo')}
            value={financialCushion}
            percentage={financialCushionPercentageOfWholeFortune}
            dataTour='financial-cushion-card'
          />
          <CardItem
            icon={
              <div className='flex size-8  shrink-0 items-center justify-center rounded-full bg-blue-600/20'>
                <House className='size-4.5 text-blue-600' />
              </div>
            }
            title={t('livingAssets')}
            detailedInfo={t('livingAssetsDetailedInfo')}
            value={livingAssets}
            percentage={livingAssetsPercentageOfWholeFortune}
            dataTour='living-assets-card'
          />
          <CardItem
            icon={
              <div className='flex size-8  shrink-0 items-center justify-center rounded-full bg-blue-600/20'>
                <ChartNoAxesCombined className='size-4.5 text-blue-600' />
              </div>
            }
            title={t('netWorth')}
            detailedInfo={t('netWorthDetailedInfo')}
            value={investments}
            percentage={investmentsPercentageOfWholeFortune}
            dataTour='investments-card'
          />
          <CardItem
            icon={
              <div className='flex size-8  shrink-0 items-center justify-center rounded-full bg-blue-600/20'>
                <Wallet className='size-4.5 text-blue-600' />
              </div>
            }
            title={t('otherAssets')}
            detailedInfo={t('otherAssetsDetailedInfo')}
            value={restOfAssets}
            percentage={restOfAssetsPercentageOfWholeFortune}
            dataTour='other-assets-card'
          />
        </div>
      </CardContent>
    </Card>
  );
};
