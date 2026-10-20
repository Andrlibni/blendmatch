import Image from "next/image";
import { imageFor } from "@/lib/images";

type Props = {
  folder: "producers" | "stories" | "home";
  slug: string;
  alt: string;
  /** Tailwind aspect class, e.g. "aspect-[4/5]" or "aspect-[16/9]". */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  /** Dark placeholders suit images with text on top. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Editorial photo with a neutral tonal placeholder. Add the real file at
 * /public/{folder}/{slug}.jpg and it is picked up automatically.
 */
export function Photo({
  folder,
  slug,
  alt,
  aspect = "aspect-[4/5]",
  sizes = "100vw",
  priority,
  tone = "light",
  className = "",
}: Props) {
  const src = imageFor(folder, slug);
  return (
    <div className={`relative overflow-hidden ${aspect} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.02]"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className={`absolute inset-0 ${
            tone === "dark"
              ? "bg-[radial-gradient(120%_90%_at_70%_30%,#6e5a4b_0%,#3d2f27_55%,#241b16_100%)]"
              : "bg-[radial-gradient(120%_90%_at_70%_25%,#efe8db_0%,#e4dacb_60%,#d8ccb9_100%)]"
          }`}
        >
          <div className="grain absolute inset-0" />
        </div>
      )}
    </div>
  );
}
