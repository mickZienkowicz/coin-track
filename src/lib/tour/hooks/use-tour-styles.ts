'use client';

import { useEffect, useRef } from 'react';

import { TourStep } from '../types';

export const useTourStyles = (
  isRunning: boolean,
  currentStep: number,
  tourSteps: TourStep[]
) => {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!isRunning || !styleRef.current) return;

    const step = tourSteps[currentStep];
    const highlightSelectors = step.highlightSelectors || [];
    const visibleSelectors = step.visibleSelectors || [];

    const createStyleRule = (selector: string, isHighlight: boolean) => {
      return `
        @keyframes tourBorderPulse {
          0%, 100% {
            border-color: #8d4bfe;
          }
          50% {
            border-color: #5a18db;
          }
        }
        @keyframes tour-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .tour-tooltip-fade-in {
          animation: tour-fade-in 0.25s;
        }
            
        ${selector} {
          z-index: 10001 !important;
        }
        ${selector}[data-slot="dialog-content"] {
          z-index: 10004 !important;
        }
        ${
          isHighlight &&
          `${selector}::after {
          content: '';
          position: absolute;
          pointer-events: none;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          border: 4px solid #7c3aed;
          border-radius: 10px !important;
          z-index: 10002;
          box-sizing: border-box;
          animation: tourBorderPulse 1.2s infinite;
          transition: border-color 0.2s;
        }`
        }
        ${selector}:not([style*="position: fixed"]):not([style*="position: absolute"]):not([style*="position: sticky"]):not(.fixed):not(.absolute):not(.sticky) {
          position: relative !important;
        }
      `;
    };

    const css = [
      ...highlightSelectors.map((selector) => createStyleRule(selector, true)),
      ...visibleSelectors.map((selector) => createStyleRule(selector, false))
    ].join('\n');
    styleRef.current.textContent = css;

    return () => {
      const style = styleRef.current;

      if (style) {
        style.textContent = '';
      }
    };
  }, [isRunning, currentStep, tourSteps]);

  return styleRef;
};
