import type { QuartzTransformerPlugin } from "@quartz-community/types"
import type { PluggableList } from "unified"
import type { Root, Element } from "hast"
import { visit } from "unist-util-visit"

const RASTER_EXT = /\.(jpe?g|png|gif)$/i

export const WebPTransformer: QuartzTransformerPlugin = () => ({
  name: "WebPTransformer",
  htmlPlugins(): PluggableList {
    return [
      () => (tree: Root) => {
        visit(tree, "element", (node: Element) => {
          if (node.tagName !== "img" || typeof node.properties?.src !== "string") return
          // Append rather than replace extension so image.jpg and image.jpeg
          // don't both collapse to image.webp and clobber each other.
          node.properties.src = node.properties.src.replace(RASTER_EXT, "$&.webp")
        })
      },
    ]
  },
})
