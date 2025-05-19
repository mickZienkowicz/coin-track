'use client';

import { Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useTour } from '../../../../../lib/tour/tour-provider';

export const StartTourButton = ({ className }: { className?: string }) => {
  const t = useTranslations('tour');
  const { startTour } = useTour();

  return (
    <Button onClick={startTour} className={cn(className)}>
      <Lightbulb className='size-4' />
      {t('startTourButton')}
    </Button>
  );
};
