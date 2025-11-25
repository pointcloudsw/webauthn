
// Import all +page.svelte files in src/routes
export const routes = Object.keys(

    import.meta.glob('/src/routes/**/+page.svelte')
)
    .map((path) => {
        // Remove the /src/routes prefix and the +page.svelte suffix
        let route = path
            .replace('/src/routes', '')
            .replace('/+page.svelte', '')
            .replace(/\/index$/, ''); // Remove trailing /index

        // Root route should be "/"
        return route === '' ? '/' : route;
    })
    .sort();

// Courtesy of: https://github.com/oddbird/popover-polyfill/blob/main/src/popover.ts
export function supportsPopover() {
  return (
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype === 'object' &&
    'popover' in HTMLElement.prototype
  );
}

// Courtesy of: https://github.com/oddbird/popover-polyfill/blob/main/src/popover.ts
export function supportsPopoverHint() {
  const el = document.createElement('div');
  el.setAttribute('popover', 'hint');
  // `el.popover` is "manual" in non-supporting browsers
  return el.popover === 'hint';
}