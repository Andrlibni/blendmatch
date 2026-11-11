"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { emitNavigation, isInternalNavigation } from "./navigation-events";

/** A thin tricolour line at the top of the page while the next page loads. */
export function NavProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (isInternalNavigation(event)) {
        setLoading(true);
        emitNavigation(true);
      }
    }
    // Capture phase: runs before <Link> calls preventDefault().
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    // The new route has rendered.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
    emitNavigation(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!loading) return;
    const id = setTimeout(() => {
      setLoading(false);
      emitNavigation(false);
    }, 10000);
    return () => clearTimeout(id);
  }, [loading]);

  return (
    <div
      aria-hidden="true"
      className={`nav-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] ${loading ? "is-loading" : ""}`}
    >
      <span className="block h-full w-full bg-[linear-gradient(90deg,var(--color-olive)_0_33.3%,var(--color-paper)_33.3%_66.6%,var(--color-wine)_66.6%_100%)]" />
    </div>
  );
}
