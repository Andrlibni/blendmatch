"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { NAV_EVENT } from "./navigation-events";

type Mode = "default" | "link" | "view";

/**
 * A soft follower ring next to the native cursor (mouse only). It grows over
 * links, shows "View" over products and spins while a page is loading.
 * Disabled on touch screens and with prefers-reduced-motion.
 */
export function Cursor() {
  const t = useTranslations("fx");
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;

    function onMove(e: MouseEvent) {
      x = e.clientX; y = e.clientY;
      setVisible(true);
      const el = e.target as HTMLElement | null;
      if (el?.closest("[data-cursor='view']")) setMode("view");
      else if (el?.closest("a, button, select, label, summary, [role='button']")) setMode("link");
      else setMode("default");
    }
    function onLeave() { setVisible(false); }
    function tick() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    }
    function onNav(e: Event) {
      const loadingNow = (e as CustomEvent<{ loading: boolean }>).detail.loading;
      setLoading(loadingNow);
      document.documentElement.style.cursor = loadingNow ? "progress" : "";
    }
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener(NAV_EVENT, onNav);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener(NAV_EVENT, onNav);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className={`cursor-fx no-print ${visible ? "opacity-100" : "opacity-0"}`}>
      <div ref={ring} className="cursor-ring-pos">
        <div className={`cursor-ring is-${mode} ${loading ? "is-loading" : ""}`}>
          <span className="cursor-label">{t("view")}</span>
        </div>
      </div>
      <div ref={dot} className="cursor-dot-pos">
        <div className={`cursor-dot ${mode !== "default" ? "is-hidden" : ""}`} />
      </div>
    </div>
  );
}
