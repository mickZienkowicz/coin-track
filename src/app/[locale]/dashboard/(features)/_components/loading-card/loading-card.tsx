import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const LoadingCard = ({ className }: { className?: string }) => (
  <Card className={cn(className)}>
    <CardContent>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[600px] max-h-[70dvh] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    </CardContent>
  </Card>
);
