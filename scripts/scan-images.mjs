// Builds data/image-manifest.json from the photos found in /public.
// Runs automatically before `dev` and `build`; products without a photo
// fall back to an elegant placeholder.
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, parse } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const folders = ["products", "producers", "stories", "home"];
const exts = new Set([".jpg", ".jpeg", ".webp", ".png", ".avif"]);
const manifest = {};

for (const folder of folders) {
  const dir = join(root, "public", folder);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).sort()) {
    const { name, ext } = parse(file);
    if (!exts.has(ext.toLowerCase())) continue;
    manifest[`${folder}/${name}`] = `/${folder}/${file}`;
  }
}

writeFileSync(join(root, "data", "image-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`image manifest: ${Object.keys(manifest).length} image(s)`);
