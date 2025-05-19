export interface TourStep {
  title: string;
  content: string;
  highlightSelectors: string[];
  visibleSelectors?: string[];
  clickableSelector?: string;
  redirectOnNext?: string;
  redirectOnPrev?: string;
  requiredBeforeNext?: {
    selector: string;
    alert: string;
  };
}
