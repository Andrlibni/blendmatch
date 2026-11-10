import Image from "next/image";
import { imageFor } from "@/lib/images";
import { getProducer } from "@/data/producers";
import type { Product } from "@/data/types";

type Props = {
  product: Product;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Thumbnails: the placeholder drops its text. */
  compact?: boolean;
};

/**
 * 4:5 product photo on a uniform ivory field. Drop a file at
 * /public/products/{slug}.jpg to replace the placeholder.
 */
export function ProductImage({
  product,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
  className = "",
  compact,
}: Props) {
  const src = imageFor("products", product.slug);
  const producer = getProducer(product.producer)?.name ?? "";

  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-ivory-deep ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={`${producer} ${product.name}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
        />
      ) : compact ? (
        <div aria-hidden="true" className="absolute inset-[22%_30%] border hairline bg-ivory" />
      ) : (
        <Placeholder producer={producer} name={product.name} detail={placeholderDetail(product)} />
      )}
    </div>
  );
}

function placeholderDetail(product: Product) {
  const format = `${product.format.amount} ${product.format.unit}`;
  return product.kind === "wine" && product.vintage ? `${format} · ${product.vintage}` : format;
}

function Placeholder({ producer, name, detail }: { producer: string; name: string; detail: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
    >
      <div className="flex h-[62%] w-[54%] sm:w-[42%] flex-col items-center justify-between border hairline bg-ivory px-2 py-[8%] text-center">
        <span className="eyebrow text-[0.5rem] text-muted sm:text-[0.5625rem]">{producer}</span>
        <span className="font-serif text-[0.85rem] leading-tight text-wine sm:text-lg">{name}</span>
        <span className="eyebrow text-[0.5rem] text-muted sm:text-[0.5625rem]">{detail}</span>
      </div>
    </div>
  );
}
