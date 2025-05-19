'use client';

import { useEffect, useState } from 'react';

import { TourStep } from '../types';
import { getFirstVisibleElement } from '../utils/get-first-visible-element';
import { getTooltipArrowPosition } from '../utils/get-tooltip-arrow-position';

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: 'top' | 'bottom' | 'left' | 'right';
  arrowOffset: number;
}

export const useTourTooltip = (
  isRunning: boolean,
  currentStep: number,
  tourSteps: TourStep[],
  tooltipRef: React.RefObject<HTMLDivElement | null>
) => {
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    arrowPosition: 'bottom',
    arrowOffset: 0
  });

  const [hasParent, setHasParent] = useState(false);
  const [hasValidPosition, setHasValidPosition] = useState(false);

  useEffect(() => {
    setHasParent(false);
    setHasValidPosition(false);

    if (!isRunning || !tooltipRef.current) return;

    const updateTooltipPosition = () => {
      const step = tourSteps[currentStep];
      const selectors = step.highlightSelectors || [];

      if (selectors.length === 0) {
        setHasParent(false);
        return;
      }

      const targetElement = getFirstVisibleElement(selectors);

      if (!targetElement) {
        setHasParent(false);
        return;
      }

      const targetRect = targetElement.getBoundingClientRect();
      const isElementInViewport =
        targetRect.top >= 0 &&
        targetRect.left >= 0 &&
        targetRect.bottom <= window.innerHeight &&
        targetRect.right <= window.innerWidth;

      setHasParent(isElementInViewport);

      const { top, left, arrowPosition, arrowOffset } = getTooltipArrowPosition(
        targetRect,
        tooltipRef
      );

      setTooltipPosition({ top, left, arrowPosition, arrowOffset });
      setHasValidPosition(true);
    };

    updateTooltipPosition();

    const handleResize = () => {
      updateTooltipPosition();
    };

    const handleScroll = () => {
      updateTooltipPosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    const observer = new MutationObserver(updateTooltipPosition);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      observer.disconnect();
    };
  }, [isRunning, currentStep, tourSteps, tooltipRef]);

  return { tooltipPosition, hasParent, hasValidPosition };
};
