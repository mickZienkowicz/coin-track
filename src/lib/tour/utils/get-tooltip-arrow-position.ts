export const getTooltipArrowPosition = (
  targetRect: DOMRect,
  tooltipRef: React.RefObject<HTMLDivElement | null>
) => {
  const tooltipRect = tooltipRef?.current?.getBoundingClientRect() || {
    width: 0,
    height: 0
  };
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  let top = targetRect.bottom + 10;
  let left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
  let arrowPosition: 'top' | 'bottom' = 'top';
  if (top + tooltipRect.height > windowHeight - 20) {
    top = targetRect.top - tooltipRect.height - 10;
    arrowPosition = 'bottom';
  }
  if (left < 20) {
    left = 20;
  } else if (left + tooltipRect.width > windowWidth - 20) {
    left = windowWidth - tooltipRect.width - 20;
  }
  const targetCenter = targetRect.left + targetRect.width / 2;
  const arrowOffset = targetCenter - left;

  return { top, left, arrowPosition, arrowOffset };
};
