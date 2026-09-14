import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = path.resolve("./public");
const outputDir = path.resolve("./assets-optimized");

const imageExtensions = [".jpg", ".jpeg", ".png"];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function optimizeImage(filePath) {
  const relativePath = path.relative(inputDir, filePath);
  const parsed = path.parse(relativePath);

  const outputFolder = path.join(outputDir, parsed.dir);
  ensureDir(outputFolder);

  const webpPath = path.join(outputFolder, `${parsed.name}.webp`);
  const avifPath = path.join(outputFolder, `${parsed.name}.avif`);

  await sharp(filePath)
    .resize({
      width: 1400,
      withoutEnlargement: true,
    })
    .webp({ quality: 78 })
    .toFile(webpPath);

  await sharp(filePath)
    .resize({
      width: 1400,
      withoutEnlargement: true,
    })
    .avif({ quality: 55 })
    .toFile(avifPath);

  console.log(`Optimizada: ${relativePath}`);
}

async function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await walk(filePath);
      continue;
    }

    const ext = path.extname(filePath).toLowerCase();

    if (imageExtensions.includes(ext)) {
      await optimizeImage(filePath);
    }
  }
}

ensureDir(outputDir);
await walk(inputDir);

console.log("Imágenes optimizadas correctamente.");