import { useEffect, useRef } from 'react';
import { createFocusTrap, FocusTrap } from 'focus-trap';

export const useTourFocusTrap = ({
  isActive,
  highlightSelectors,
  tooltipRef
}: {
  isActive: boolean;
  highlightSelectors: string[];
  tooltipRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const getNodes = () => {
      const highlightEls = highlightSelectors
        ?.map((selector) =>
          Array.from(document.querySelectorAll<HTMLElement>(selector))
        )
        .flat()
        .filter(Boolean);

      highlightEls.forEach((el) => {
        if (el.tabIndex < 0) el.tabIndex = 0;
      });

      const tooltipEl = tooltipRef.current;
      return [...highlightEls, tooltipEl].filter(Boolean) as HTMLElement[];
    };

    const activateTrap = () => {
      if (trapRef.current) {
        trapRef.current.deactivate();
        trapRef.current = null;
      }
      const nodes = getNodes();
      if (nodes.length === 0) return;
      trapRef.current = createFocusTrap(nodes, {
        escapeDeactivates: false,
        clickOutsideDeactivates: false,
        allowOutsideClick: true,
        fallbackFocus: nodes[0],
        returnFocusOnDeactivate: false
      });
      trapRef.current.activate();
    };

    activateTrap();

    const observer = new MutationObserver(() => {
      activateTrap();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (trapRef.current) {
        trapRef.current.deactivate();
        trapRef.current = null;
      }
    };
  }, [isActive, highlightSelectors, tooltipRef]);
};
