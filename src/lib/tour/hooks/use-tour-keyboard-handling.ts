import { useEffect } from 'react';

export const useTourKeyboardHandling = ({
  onNext,
  onPrev,
  onStop
}: {
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        onNext();
      }
      if (e.key === 'ArrowLeft') {
        onPrev();
      }
      if (e.key === 'Escape') {
        onStop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onStop]);
};
