type Tone = "wine" | "olive";

const tones: Record<Tone, { band: string; text: string; dot: string[] }> = {
  wine: { band: "bg-wine", text: "text-ivory", dot: ["bg-olive-wash", "bg-ivory", "bg-[#e7b9ae]"] },
  olive: { band: "bg-olive-wash", text: "text-olive", dot: ["bg-olive", "bg-ivory", "bg-wine"] },
};

function Ribbon({ items, tone, reverse }: { items: string[]; tone: Tone; reverse?: boolean }) {
  const t = tones[tone];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8 sm:gap-10 sm:pr-10" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-8 whitespace-nowrap sm:gap-10">
          <span className={`font-serif text-2xl italic sm:text-[2.2rem] ${t.text}`}>{item}</span>
          <span aria-hidden="true" className={`size-2 rounded-full sm:size-2.5 ${t.dot[i % 3]}`} />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`${t.band} overflow-hidden py-4 sm:py-5`}>
      <div className={`marquee-track flex w-max ${reverse ? "is-reverse" : ""}`}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** Two slow, endless ribbons running in opposite directions. Pause on hover. */
export function Marquee({ first, second, label }: { first: string[]; second: string[]; label: string }) {
  return (
    <section aria-label={label} className="marquee overflow-hidden py-10 sm:py-14">
      <div className="-mx-4 -rotate-[1.6deg] sm:-mx-6">
        <Ribbon items={first} tone="wine" />
      </div>
      <div className="-mx-4 -mt-1 rotate-[1.2deg] sm:-mx-6">
        <Ribbon items={second} tone="olive" reverse />
      </div>
    </section>
  );
}
