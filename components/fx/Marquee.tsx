/** A slow, endless ribbon of words separated by tricolour dots. Pauses on hover. */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const dots = ["bg-olive", "bg-ink/20", "bg-wine"];
  const row = (hidden: boolean) => (
    <ul className="marquee-row flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-serif text-3xl italic text-wine sm:text-[2.6rem]">{item}</span>
          <span aria-hidden="true" className={`size-2.5 rounded-full ${dots[i % 3]}`} />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className="marquee group overflow-hidden border-y hairline bg-paper py-7">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
