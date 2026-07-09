import type { QuartzEmitterPlugin, FilePath } from "@quartz-community/types"
import { joinSegments } from "@quartz-community/types"
import { slugifyFilePath } from "@quartz-community/utils"
import path from "node:path"
import fs from "node:fs/promises"
import type { Dirent } from "node:fs"
import sharp from "sharp"

const RASTER_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif"])
const WEBP_QUALITY = 80

async function* walkDir(dir: string, ignoreNames: string[]): AsyncGenerator<string> {
  let entries: Dirent[]
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (ignoreNames.includes(e.name)) continue
    const fullPath = path.join(dir, e.name)
    if (e.isDirectory()) {
      yield* walkDir(fullPath, ignoreNames)
    } else if (e.isFile()) {
      yield fullPath
    }
  }
}

export const WebPAssets: QuartzEmitterPlugin = () => ({
  name: "WebPAssets",

  async *emit(ctx) {
    const { directory, output } = ctx.argv
    const ignorePatterns = (ctx.cfg.configuration.ignorePatterns) || []

    for await (const src of walkDir(directory, ignorePatterns)) {
      const ext = path.extname(src).toLowerCase()
      if (!RASTER_EXTS.has(ext)) continue

      const rel = path.relative(directory, src) as FilePath
      const slugged = String(slugifyFilePath(rel)).replace(/\.(jpe?g|png|gif)$/i, "$&.webp")
      const dest = joinSegments(output, slugged) as FilePath

      await fs.mkdir(path.dirname(dest), { recursive: true })
      await sharp(src).rotate().webp({ quality: WEBP_QUALITY }).toFile(dest)
      yield dest
    }
  },
})
