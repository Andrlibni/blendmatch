import manifest from "@/data/image-manifest.json";

type Folder = "products" | "producers" | "stories" | "home";

/** Returns the public path of a photo, or null when only the placeholder is available. */
export function imageFor(folder: Folder, slug: string): string | null {
  return (manifest as Record<string, string>)[`${folder}/${slug}`] ?? null;
}
