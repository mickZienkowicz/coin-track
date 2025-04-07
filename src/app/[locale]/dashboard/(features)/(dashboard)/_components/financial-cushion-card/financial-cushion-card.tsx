import { Shield } from 'lucide-react';

import { FormattedCurrency } from '@/app/[locale]/dashboard/_components/formatted-currency/formatted-currency';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

export const FinancialCushionCard = () => {
  return (
    <Card className='gap-0'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2 md:items-center'>
          <CardTitle className='flex items-center gap-3 text-lg'>
            <div className='flex size-9 shrink-0 items-center  justify-center rounded-full bg-blue-600/20 md:size-11'>
              <Shield className='size-5 text-blue-600 md:size-6' />
            </div>
            <div className='flex flex-col'>
              <h4 className='text-2xl font-bold'>Poduszka finansowa</h4>
              <p className='text-sm font-normal text-primary/70'>
                Rekomendujemy: <FormattedCurrency valueCents={3000} />-{' '}
                <FormattedCurrency valueCents={2000} />
              </p>
            </div>
          </CardTitle>
          <Badge
            className={cn(
              'mt-[2px] hidden bg-blue-600 font-bold tracking-tighter text-white sm:flex md:mt-0'
            )}
          >
            80%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className='mb-6 mt-3 text-sm text-primary/70 md:text-base'>
          Poduszka finansowa powinna stanowić 3-6 miesięcznych wydatków, aby
          zapewnić bezpieczeństwo finansowe w przypadku sytuacji losowych.
          Aktualnie posiadasz <span className='font-bold'>100 000 zł</span>, co
          stanowi <span className='font-bold'>80%</span> rekomendowanej
          wartości.
        </p>
        <div className='mb-2'>
          <div className='mt-1 flex items-center justify-between gap-1'>
            <p className='flex flex-col items-start gap-1 text-sm text-primary/70 sm:flex-row sm:items-center'>
              Obecnie:
              <span className='font-bold'>
                <FormattedCurrency valueCents={100000} />
              </span>
            </p>
            <p className='flex flex-col items-end gap-1 text-sm text-primary/70 sm:flex-row sm:items-center'>
              Rekomendujemy:
              <span className='font-bold'>
                <FormattedCurrency valueCents={120000} />
              </span>
            </p>
          </div>
        </div>

        <Progress
          value={80}
          className='h-2'
          progressBarClassName='bg-blue-600'
        />

        <div className='mt-4 flex justify-end'>
          <Link
            href={pathGenerators.fortune()}
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            Zarządzaj majątkiem
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
