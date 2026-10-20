import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif text-[2.1rem] font-medium tracking-[0.32em] text-wine sm:text-[2.6rem]">
        <span className="pl-[0.32em]">LENTO</span>
      </span>
      <span className="sr-only"> — home</span>
    </Link>
  );
}
