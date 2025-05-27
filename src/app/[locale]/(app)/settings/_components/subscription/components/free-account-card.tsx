import { Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const FreeAccountCard = () => {
  const t = useTranslations('subscription.freeAccountCard');

  return (
    <Card className='max-w-lg'>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='flex justify-between gap-2 text-xl font-semibold text-white'>
            {t('title')}
          </h3>
          <Badge
            variant='secondary'
            className='border-green-700 bg-green-700 text-white'
          >
            {t('badge')}
          </Badge>
        </div>
        <div className='flex items-center gap-3'>
          <Gift className='size-8 text-green-600' />
          <div>
            <h4 className='font-medium text-green-500'>{t('title')}</h4>
            <p className='text-sm text-gray-400'>{t('description')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
