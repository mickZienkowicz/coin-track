import { useEffect } from 'react';

export function useTourScrollToHighlight(
  isActive: boolean,
  highlightSelectors: string[]
) {
  useEffect(() => {
    if (!isActive || !highlightSelectors?.length) return;

    const el = document.querySelector(highlightSelectors[0]);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [isActive, highlightSelectors]);
}
