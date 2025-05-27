import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const LoadingCard = ({ className }: { className?: string }) => (
  <Card className={cn(className)}>
    <CardContent>
      <div className='flex flex-col space-y-3'>
        <div className='md:grid-cold-2 grid grid-cols-1 gap-4 xl:grid-cols-3'>
          <Skeleton className='grow-1 h-[380px] max-h-[50dvh] w-full rounded-xl md:h-[350px] md:max-h-[22vh] xl:h-[240px]  xl:max-h-[25dvh]' />
          <Skeleton className='grow-1 hidden h-[350px] max-h-[50dvh] w-full rounded-xl md:block md:max-h-[22vh] xl:h-[240px]  xl:max-h-[25dvh]' />
          <Skeleton className='grow-1 hidden h-[240px] max-h-[50dvh] w-full xl:block xl:max-h-[25dvh]' />
          <Skeleton className='grow-1 hidden h-[240px] max-h-[50dvh] w-full xl:block xl:max-h-[25dvh]' />
          <Skeleton className='grow-1 hidden h-[240px] max-h-[50dvh] w-full xl:block xl:max-h-[25dvh]' />
          <Skeleton className='grow-1 hidden h-[240px] max-h-[50dvh] w-full xl:block xl:max-h-[25dvh]' />
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    </CardContent>
  </Card>
);
