import { Link } from "@/i18n/navigation";

export function SectionHeading({
  title,
  kicker,
  href,
  linkLabel,
  as: Tag = "h2",
  id,
}: {
  id?: string;
  title: string;
  kicker?: string;
  href?: string;
  linkLabel?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex items-end justify-between gap-6 border-b hairline pb-5">
      <div>
        {kicker && <p className="eyebrow mb-3 text-muted">{kicker}</p>}
        <Tag id={id} className="display text-4xl sm:text-5xl">{title}</Tag>
      </div>
      {href && linkLabel && (
        <Link href={href} className="eyebrow shrink-0 pb-1.5 hover:text-wine">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
