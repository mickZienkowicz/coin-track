'use client';

import { useEffect, useRef } from 'react';

import { TourStep } from '../types';

interface TourOverlayProps {
  isRunning: boolean;
  currentStep: number;
  tourSteps: TourStep[];
}

export const TourOverlay = ({
  isRunning,
  currentStep,
  tourSteps
}: TourOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRunning || !overlayRef.current) return;

    const step = tourSteps[currentStep];
    const selectors = step.highlightSelectors || [];

    const createOverlayRule = (selector: string) => {
      const targetElement = document.querySelector(selector);
      if (!targetElement) return '';

      const rect = targetElement.getBoundingClientRect();
      return `
        .tour-overlay-${currentStep}::before {
          content: '';
          position: absolute;
          top: ${rect.top}px;
          left: ${rect.left}px;
          width: ${rect.width}px;
          height: ${rect.height}px;
          background: transparent;
          z-index: 10000;
        }
      `;
    };

    const css = `
      .tour-overlay-${currentStep} {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
      }
      ${selectors.map(createOverlayRule).join('\n')}
    `;

    const styleElement = document?.createElement?.('style');
    styleElement.textContent = css;
    document.head?.appendChild?.(styleElement);

    return () => {
      document.head?.removeChild?.(styleElement);
    };
  }, [isRunning, currentStep, tourSteps]);

  if (!isRunning) return null;

  return (
    <div
      ref={overlayRef}
      className={`tour-overlay-${currentStep}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};
