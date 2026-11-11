import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getProducer } from "@/data/producers";
import type { Product } from "@/data/types";
import { ProductImage } from "./ProductImage";
import { Price } from "./Price";
import { SpecLine } from "./SpecLine";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const t = useTranslations("product");
  const producer = getProducer(product.producer);
  return (
    <article className="group relative flex flex-col">
      <ProductImage product={product} priority={priority} />
      {(product.isNew || product.treasure) && (
        <p className="eyebrow absolute left-3 top-3 flex gap-2 text-[0.625rem]">
          {product.isNew && <span className="bg-ivory px-2 py-1">{t("new")}</span>}
          {product.treasure && <span className="bg-ivory px-2 py-1 text-wine">{t("treasure")}</span>}
        </p>
      )}
      <div className="mt-5 flex flex-1 flex-col gap-1.5">
        <p className="eyebrow text-muted">{producer?.name}</p>
        <h3 className="font-serif text-[1.2rem] sm:text-[1.45rem] font-medium leading-tight text-wine">
          <Link href={`/shop/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <SpecLine product={product} />
        <div className="mt-auto pt-3">
          <Price product={product} />
        </div>
      </div>
    </article>
  );
}
