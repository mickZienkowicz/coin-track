import { Target } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

export const GoalsSummaryCard = () => {
  return (
    <Card className='gap-0'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-3 text-lg'>
          <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 md:size-11'>
            <Target className='size-5 text-blue-600 md:size-6' />
          </div>
          <div className='flex flex-col'>
            <h4 className='text-2xl font-bold'>Cele finansowe</h4>
            <p className='text-sm font-normal text-primary/70'>
              Brak aktywnych celów
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='grow'>
        <div className='flex h-full flex-col items-center justify-center p-6 text-center'>
          <p className='mb-4 text-primary/70'>
            Nie masz jeszcze żadnych celów finansowych.
          </p>
          <Link
            className={cn(buttonVariants({ size: 'sm' }))}
            href={pathGenerators.goals()}
          >
            Dodaj pierwszy cel
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
