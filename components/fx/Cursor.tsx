"use client";

import { useEffect } from "react";
import { NAV_EVENT } from "./navigation-events";

/**
 * Emoji cursors, mouse only: a bottle everywhere and a toast while the
 * next page loads. The cursors themselves are
 * defined in globals.css; this component only switches them on.
 */
export function Cursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("emoji-cursor");
    function onNav(e: Event) {
      root.classList.toggle("is-navigating", (e as CustomEvent<{ loading: boolean }>).detail.loading);
    }
    window.addEventListener(NAV_EVENT, onNav);
    return () => {
      window.removeEventListener(NAV_EVENT, onNav);
      root.classList.remove("emoji-cursor", "is-navigating");
    };
  }, []);

  return null;
}
