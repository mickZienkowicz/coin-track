'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import dynamic from 'next/dynamic';

import { useRouter } from '@/i18n/navigation';

import { TourStep } from './types';

const Tour = dynamic(
  () => import('./components/tour').then((mod) => mod.Tour),
  {
    ssr: false
  }
);

interface TourContextType {
  isRunning: boolean;
  currentStep: number;
  startTour: () => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  steps: TourStep[];
}

const TourContext = createContext<TourContextType | null>(null);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: React.ReactNode;
  steps: TourStep[];
}

export const TourProvider = ({
  children,
  steps: tourSteps
}: TourProviderProps) => {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTour = useCallback(() => {
    setIsRunning(true);
    setCurrentStep(0);
  }, []);

  const stopTour = useCallback(() => {
    setIsRunning(false);
    setCurrentStep(0);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      if (tourSteps[currentStep]?.redirectOnNext) {
        router.push(tourSteps[currentStep].redirectOnNext);
      }
      setCurrentStep((prev) => prev + 1);
    } else {
      stopTour();
    }
  }, [currentStep, tourSteps, router, stopTour]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      if (tourSteps[currentStep]?.redirectOnPrev) {
        router.push(tourSteps[currentStep].redirectOnPrev);
      }
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep, tourSteps, router]);

  const contextValue = useMemo(
    () => ({
      isRunning,
      currentStep,
      startTour,
      stopTour,
      nextStep: handleNext,
      prevStep: handlePrev,
      steps: tourSteps
    }),
    [
      isRunning,
      currentStep,
      startTour,
      stopTour,
      handleNext,
      handlePrev,
      tourSteps
    ]
  );

  return (
    <TourContext.Provider value={contextValue}>
      {children}
      {isRunning && (
        <Tour
          currentStep={currentStep}
          handleNext={handleNext}
          handlePrev={handlePrev}
          isRunning={isRunning}
          stopTour={stopTour}
          tourSteps={tourSteps}
        />
      )}
    </TourContext.Provider>
  );
};
