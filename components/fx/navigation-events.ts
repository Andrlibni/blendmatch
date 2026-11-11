/** Tiny event bus so the progress bar and the cursor share the navigation state. */
export const NAV_EVENT = "lento:navigation";

export function emitNavigation(loading: boolean) {
  window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: { loading } }));
}

export function isInternalNavigation(event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = (event.target as HTMLElement | null)?.closest("a");
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  // Same page (only the hash changes): no navigation.
  return url.pathname + url.search !== window.location.pathname + window.location.search;
}
