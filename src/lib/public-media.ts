import fs from "node:fs";
import path from "node:path";

const mediaExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export function getPublicMedia(folder: string) {
  const folderPath = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(folderPath)) {
    return [];
  }

  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && mediaExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => `/${folder}/${encodeURIComponent(entry.name)}`)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}
