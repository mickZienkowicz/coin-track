import { PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { cn } from '@/lib/utils';

export const NoFamilyCard = () => {
  const t = useTranslations('budget');

  return (
    <Card className='mt-6 w-full'>
      <CardContent className='flex flex-col items-center px-8 pb-6 pt-10 text-center'>
        <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
          <PlusCircle className='h-8 w-8 text-muted-foreground' />
        </div>
        <h2 className='mb-3 text-2xl font-semibold'>
          {t('noFamilyCard.title')}
        </h2>
        <p className='mb-6 max-w-xl text-muted-foreground'>
          {t('noFamilyCard.description')}
        </p>
        <Link href={pathGenerators.settings()} className={cn(buttonVariants())}>
          {t('noFamilyCard.addFamilyButton')}
        </Link>
      </CardContent>
    </Card>
  );
};
