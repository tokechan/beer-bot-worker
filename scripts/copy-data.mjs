import { mkdir, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(root, "..");

const src = join(projectRoot, "src", "data", "beers.json");
const destDir = join(projectRoot, "dist", "data");
const dest = join(destDir, "beers.json");

await mkdir(destDir, { recursive: true });
await copyFile(src, dest);


