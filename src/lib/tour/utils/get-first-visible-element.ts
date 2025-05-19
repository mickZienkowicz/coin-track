export const getFirstVisibleElement = (selectors: string[]): Element | null =>
  selectors
    .flatMap((selector: string): Element[] =>
      Array.from(document.querySelectorAll(selector)).filter(
        (element) => window.getComputedStyle(element).display !== 'none'
      )
    )
    .at(0) || null;
