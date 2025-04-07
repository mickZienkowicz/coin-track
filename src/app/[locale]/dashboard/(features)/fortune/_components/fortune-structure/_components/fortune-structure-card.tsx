import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const FortuneStructureCard = ({
  icon,
  title,
  value,
  description,
  className,
  percentageOfWholeFortune,
  monthlySpendingsMultiplier
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  description: string;
  className?: string;
  percentageOfWholeFortune: number;
  monthlySpendingsMultiplier?: number;
}) => {
  return (
    <Card className={cn('relative gap-0', className)}>
      <CardHeader className='gap-0 pb-0'>
        <CardTitle className='flex items-start justify-between gap-3 text-lg'>
          <div className='flex flex-col'>
            <h4 className='hidden text-xl font-bold leading-8 2xl:block'>
              {title}
            </h4>
            <h4 className='text-[22px] font-black 2xl:hidden '>{value}</h4>
            <p className='hidden items-center text-sm font-normal text-primary/70 2xl:flex'>
              {icon}
              {description}
            </p>
            <p className='flex items-center text-sm font-normal text-primary/70 2xl:hidden'>
              {icon}
              {title}
            </p>
          </div>
          <Badge
            className={cn('bg-blue-600 font-bold tracking-tighter text-white')}
          >
            {percentageOfWholeFortune}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='hidden items-center justify-between pt-3 2xl:flex'>
        <div className='text-2xl font-black md:text-[25px]'>{value}</div>
      </CardContent>
      {monthlySpendingsMultiplier && (
        <Badge
          className={cn(
            'absolute -top-5 right-6 bg-blue-600 font-bold tracking-tighter text-white'
          )}
        >
          {monthlySpendingsMultiplier.toFixed(1)}x miesięcznych wydatków
        </Badge>
      )}
    </Card>
  );
};
