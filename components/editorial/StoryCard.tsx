import { Link } from "@/i18n/navigation";
import type { Story } from "@/data/types";
import { Photo } from "./Photo";

export function StoryCard({ story, minutesLabel }: { story: Story; minutesLabel: string }) {
  return (
    <article className="group relative flex flex-col">
      <Photo folder="stories" slug={story.slug} alt={story.title} aspect="aspect-[4/5]" sizes="(min-width: 1024px) 33vw, 100vw" />
      <p className="eyebrow mt-5 text-muted">
        {story.kicker} · {minutesLabel}
      </p>
      <h3 className="mt-2 font-serif text-3xl font-medium leading-tight text-wine">
        <Link href={`/stories/${story.slug}`} className="after:absolute after:inset-0">
          {story.title}
        </Link>
      </h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed">{story.excerpt}</p>
    </article>
  );
}
