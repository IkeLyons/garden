import type { QuartzTransformerPlugin } from "@quartz-community/types"
import type { PluggableList } from "unified"
import type { Root, Element, Text } from "hast"
import { visit, SKIP } from "unist-util-visit"
import css from "./styles/spotify-embed.scss"

const SPOTIFY_URL_RE =
  /^https?:\/\/open\.spotify\.com\/(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/

// These content types get a taller embed to show the full list/browse UI
const TALL_TYPES = new Set(["album", "playlist", "artist", "show"])

export interface SpotifyEmbedOptions {
  theme: "dark" | "light"
  trackHeight: number
  albumHeight: number
}

const defaultOptions: SpotifyEmbedOptions = {
  theme: "dark",
  trackHeight: 152,
  albumHeight: 352,
}

export const SpotifyEmbed: QuartzTransformerPlugin<Partial<SpotifyEmbedOptions>> = (
  userOpts?: Partial<SpotifyEmbedOptions>,
) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "SpotifyEmbed",

    externalResources() {
      return { css: [{ content: css, inline: true }] }
    },

    htmlPlugins(): PluggableList {
      return [
        () => (tree: Root) => {
          visit(tree, "element", (node: Element, index, parent) => {
            if (node.tagName !== "p" || !parent || index === undefined) return

            // Qualify only paragraphs that are exactly one <a> link with no
            // surrounding text — i.e. a bare pasted URL on its own line
            const elementChildren = node.children.filter(
              (c): c is Element => c.type === "element",
            )
            const nonWhitespaceText = node.children.filter(
              (c): c is Text => c.type === "text" && c.value.trim() !== "",
            )

            if (elementChildren.length !== 1 || nonWhitespaceText.length !== 0) return

            const link = elementChildren[0]!
            if (link.tagName !== "a") return

            const href = link.properties?.href
            if (typeof href !== "string") return

            const match = SPOTIFY_URL_RE.exec(href)
            if (!match) return

            const type = match[1]!
            const id = match[2]!
            const height = TALL_TYPES.has(type) ? opts.albumHeight : opts.trackHeight
            const themeParam = opts.theme === "dark" ? "&theme=0" : ""
            const src = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator${themeParam}`

            const iframe: Element = {
              type: "element",
              tagName: "iframe",
              properties: {
                src,
                height: String(height),
                allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
                loading: "lazy",
              },
              children: [],
            }

            const wrapper: Element = {
              type: "element",
              tagName: "div",
              properties: { className: ["spotify-embed"] },
              children: [iframe],
            }

            parent.children.splice(index, 1, wrapper)
            return SKIP
          })
        },
      ]
    },
  }
}
