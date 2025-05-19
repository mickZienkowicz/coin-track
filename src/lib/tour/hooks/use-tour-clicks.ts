import { useEffect, useRef } from 'react';

import { TourStep } from '../types';

export const useTourClicks = (
  isRunning: boolean,
  currentStep: number,
  tourSteps: TourStep[],
  onNext: () => void,
  onPrev: () => void,
  onClose: () => void
) => {
  const highlightedElements = useRef<Element[]>([]);
  const clickableElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isRunning) {
      highlightedElements.current = [];
      clickableElement.current = null;
      return;
    }

    const step = tourSteps[currentStep];
    const selectors = step.highlightSelectors || [];

    highlightedElements.current = selectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector))
    );

    if (step.clickableSelector) {
      clickableElement.current = document.querySelector(step.clickableSelector);
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      highlightedElements.current = selectors.flatMap((selector) =>
        Array.from(document.querySelectorAll(selector))
      );

      if (target.closest('[data-tour-tooltip]')) {
        return;
      }

      if (
        clickableElement.current &&
        (target === clickableElement.current ||
          clickableElement.current.contains(target) ||
          target?.closest?.(step.clickableSelector || '') ===
            clickableElement.current)
      ) {
        return;
      }

      const isHighlighted = highlightedElements.current.some(
        (element) => element === target || element.contains(target)
      );

      if (!isHighlighted) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isRunning, currentStep, tourSteps, onNext, onPrev, onClose]);

  return {
    highlightedElements: highlightedElements.current,
    clickableElement: clickableElement.current
  };
};
