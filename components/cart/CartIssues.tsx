"use client";

import { useTranslations } from "next-intl";
import type { CartIssue } from "@/lib/pricing";

export function CartIssues({ issues }: { issues: CartIssue[] }) {
  const t = useTranslations("cart.issues");
  if (issues.length === 0) return null;
  return (
    <ul role="status" className="mt-5 space-y-2 border-l-2 border-alert pl-4 text-sm text-alert">
      {issues.map((issue) => (
        <li key={issue.code + ("slug" in issue ? issue.slug : "")}>
          {issue.code === "minWine" && t("minWine", { min: issue.min, current: issue.current })}
          {issue.code === "wineCase" && t("wineCase", { size: issue.caseSize, missing: issue.missing })}
          {issue.code === "pantryCase" && t("pantryCase", { name: issue.name, size: issue.caseSize })}
        </li>
      ))}
    </ul>
  );
}
