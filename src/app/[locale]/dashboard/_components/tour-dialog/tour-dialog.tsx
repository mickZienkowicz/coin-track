'use client';

import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useRouter } from '@/i18n/navigation';
import { pathGenerators } from '@/lib/paths';
import { useTour } from '@/lib/tour/tour-provider';

export const TourDialog = () => {
  const t = useTranslations('tour');
  const router = useRouter();
  const { startTour } = useTour();
  const [isOpen, setIsOpen] = useState(false);

  const handleStartTour = async () => {
    setIsOpen(false);
    await router.push(pathGenerators.settings());
    startTour();
  };

  useEffect(() => {
    const localTour = localStorage.getItem('shouldShowTour');

    console.log(localTour);

    if (localTour !== 'yes') {
      setIsOpen(true);
    }

    localStorage.setItem('shouldShowTour', 'yes');
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className='flex gap-2'>
          <Button
            onClick={() => setIsOpen(false)}
            variant='secondary'
            className='grow'
          >
            {t('skipTourButton')}
          </Button>
          <Button onClick={handleStartTour} className='grow'>
            <Lightbulb className='size-4' />
            {t('startTourButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
