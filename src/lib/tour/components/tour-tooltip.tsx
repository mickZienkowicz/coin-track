'use client';

import { useMemo } from 'react';
import { Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TourStep } from '@/lib/tour/types';
import { cn } from '@/lib/utils';

import { useTourKeyboardHandling } from '../hooks/use-tour-keyboard-handling';

interface TourTooltipProps {
  currentStep: number;
  steps: TourStep[];
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  hasValidPosition: boolean;
  tooltipPosition: {
    top: number;
    left: number;
    arrowPosition: 'top' | 'bottom' | 'left' | 'right';
    arrowOffset: number;
  };
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
}

const getArrowStyles = ({
  tooltipPosition
}: {
  tooltipPosition: TourTooltipProps['tooltipPosition'];
}) => {
  const baseStyles = {
    position: 'absolute' as const,
    width: '0',
    height: '0',
    transition:
      'left 0.3s cubic-bezier(0.4,0,0.2,1), top 0.3s cubic-bezier(0.4,0,0.2,1)'
  };

  switch (tooltipPosition.arrowPosition) {
    case 'top':
      return {
        ...baseStyles,
        top: '-8px',
        left: `${tooltipPosition.arrowOffset}px`,
        transform: 'translateX(-50%)',
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderBottom: '8px solid white'
      };
    case 'bottom':
      return {
        ...baseStyles,
        bottom: '-8px',
        left: `${tooltipPosition.arrowOffset}px`,
        transform: 'translateX(-50%)',
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid white'
      };
    case 'left':
      return {
        ...baseStyles,
        left: '-8px',
        top: `${tooltipPosition.arrowOffset}px`,
        transform: 'translateY(-50%)',
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderRight: '8px solid white'
      };
    case 'right':
      return {
        ...baseStyles,
        right: '-8px',
        top: `${tooltipPosition.arrowOffset}px`,
        transform: 'translateY(-50%)',
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderLeft: '8px solid white'
      };
  }
};

export const TourTooltip = ({
  currentStep,
  steps,
  tooltipRef,
  tooltipPosition,
  hasValidPosition,
  onNext,
  onPrev,
  onStop
}: TourTooltipProps) => {
  const step = steps[currentStep];
  const t = useTranslations('tour');

  const handleNext = () => {
    if (step.requiredBeforeNext?.selector) {
      const el = document.querySelector(step.requiredBeforeNext.selector);
      if (!el) {
        toast.error(step.requiredBeforeNext.alert);
        return;
      }
    }
    onNext();
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      onPrev();
    }
  };

  useTourKeyboardHandling({
    onNext: handleNext,
    onPrev: handlePrev,
    onStop
  });

  const tooltipArrowStyles = useMemo(
    () => getArrowStyles({ tooltipPosition }),
    [tooltipPosition]
  );

  return (
    <>
      <Button
        variant='secondary'
        size='sm'
        onClick={onStop}
        className='fixed left-4 top-4 z-[10002] xl:bottom-4 xl:left-auto xl:right-4 xl:top-auto'
      >
        Skip the tour <X />
      </Button>
      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-[10002] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity delay-200 duration-100',
          !hasValidPosition && 'opacity-100'
        )}
      >
        <Loader2 className='size-16 animate-spin opacity-40' />
      </div>
      <div
        className={cn(
          hasValidPosition ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}
      >
        <Card
          ref={tooltipRef}
          data-tour-tooltip
          className={cn(
            'fixed z-[10002] max-w-[320px] rounded-lg border-none bg-white py-4 lg:min-w-[360px] lg:max-w-[400px] lg:py-4',
            'animation-delay-500 animate-[tour-fade-in_0.6s_ease-in-out] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] transition-[all_0.6s_ease-in-out]'
          )}
          style={{
            opacity: hasValidPosition ? 1 : 0,
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            pointerEvents: hasValidPosition ? 'auto' : 'none'
          }}
        >
          <div style={tooltipArrowStyles} />
          <CardContent className='px-4 lg:px-4'>
            <Button
              variant='ghost'
              size='iconSmall'
              onClick={onStop}
              className='absolute right-4 top-4 h-5 w-5 rounded-sm text-black hover:bg-transparent hover:text-black focus-visible:ring-offset-white'
            >
              <X className='size-4' />
            </Button>
            <h3 className='mb-2 mr-8 text-xl font-semibold text-black'>
              {step.title}
            </h3>
            <p className='text-md mb-4 text-[15px] text-black/80'>
              {step.content}
            </p>
            <div className='flex items-center justify-between gap-2'>
              <Button
                size='sm'
                variant='secondary'
                className='bg-gray-200 hover:bg-gray-300  focus-visible:ring-offset-white disabled:cursor-not-allowed'
                onClick={onPrev}
                disabled={currentStep === 0}
              >
                {t('previousButton')}
              </Button>

              <Button
                variant='secondary'
                size='sm'
                onClick={handleNext}
                className='bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-offset-white'
                autoFocus
              >
                {currentStep === steps.length - 1
                  ? t('finishButton')
                  : t('nextButton')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
