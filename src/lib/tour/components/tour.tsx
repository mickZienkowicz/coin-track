import { useRef } from 'react';

import { useTourClicks } from '../hooks/use-tour-clicks';
import { useTourFocusTrap } from '../hooks/use-tour-focus-trap';
import { useTourScrollToHighlight } from '../hooks/use-tour-scroll-to-highlight';
import { useTourStyles } from '../hooks/use-tour-styles';
import { useTourTooltip } from '../hooks/use-tour-tooltip';
import { TourStep } from '../types';
import { TourOverlay } from './tour-overlay';
import { TourTooltip } from './tour-tooltip';

export const Tour = ({
  currentStep,
  handleNext,
  handlePrev,
  isRunning,
  stopTour,
  tourSteps
}: {
  currentStep: number;
  handleNext: () => void;
  handlePrev: () => void;
  isRunning: boolean;
  stopTour: () => void;
  tourSteps: TourStep[];
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const styleRef = useTourStyles(isRunning, currentStep, tourSteps);

  const { tooltipPosition, hasValidPosition } = useTourTooltip(
    isRunning,
    currentStep,
    tourSteps,
    tooltipRef
  );

  useTourClicks(
    isRunning,
    currentStep,
    tourSteps,
    handleNext,
    handlePrev,
    stopTour
  );

  const currentStepObject = tourSteps[currentStep];

  useTourFocusTrap({
    isActive: isRunning,
    highlightSelectors: [
      ...currentStepObject.highlightSelectors,
      currentStepObject.clickableSelector
    ].filter(Boolean) as string[],
    tooltipRef
  });

  useTourScrollToHighlight(isRunning, currentStepObject.highlightSelectors);

  return (
    <>
      <TourOverlay
        isRunning={isRunning}
        currentStep={currentStep}
        tourSteps={tourSteps}
      />
      <style ref={styleRef} />
      <TourTooltip
        hasValidPosition={hasValidPosition}
        key={currentStep}
        currentStep={currentStep}
        steps={tourSteps}
        tooltipRef={tooltipRef}
        tooltipPosition={tooltipPosition}
        onNext={handleNext}
        onPrev={handlePrev}
        onStop={stopTour}
      />
    </>
  );
};
