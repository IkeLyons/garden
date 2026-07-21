import { QuartzTransformerPlugin } from '@quartz-community/types';

interface SpotifyEmbedOptions {
    theme: "dark" | "light";
    trackHeight: number;
    albumHeight: number;
}
declare const SpotifyEmbed: QuartzTransformerPlugin<Partial<SpotifyEmbedOptions>>;

export { SpotifyEmbed, type SpotifyEmbedOptions };
