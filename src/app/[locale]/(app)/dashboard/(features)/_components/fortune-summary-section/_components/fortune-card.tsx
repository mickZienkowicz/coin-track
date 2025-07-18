import { Calendar } from 'lucide-react';

import { AdditionalInfoTooltip } from '@/components/additional-info-tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const FortuneCard = async ({
  title,
  icon,
  value,
  description,
  className,
  dataTour,
  additionalInfo
}: {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  description?: string;
  className?: string;
  dataTour?: string;
  additionalInfo?: string;
}) => (
  <Card className={cn('gap-0', className)} data-tour={dataTour}>
    <CardHeader className='gap-0 pb-0'>
      <CardTitle className='flex items-center gap-3 text-lg'>
        {icon}
        <div className='flex flex-col'>
          <h4 className='hidden text-2xl font-bold 2xl:block'>
            {title}
            {additionalInfo && (
              <AdditionalInfoTooltip className='ml-1' text={additionalInfo} />
            )}
          </h4>
          <h4 className='text-[22px] font-black 2xl:hidden '>
            {value}
            {additionalInfo && (
              <AdditionalInfoTooltip className='ml-1' text={additionalInfo} />
            )}
          </h4>
          {description && (
            <p className='hidden text-sm font-normal text-primary/70 2xl:block'>
              <Calendar className='-mt-0.5 mr-1 inline-block h-3.5 w-3.5' />
              {description}
            </p>
          )}
          <p className='text-sm font-normal text-primary/70 2xl:hidden'>
            {title}
          </p>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className='hidden pt-3 2xl:block'>
      <div className='text-2xl font-black md:text-[25px]'>{value}</div>
    </CardContent>
  </Card>
);
