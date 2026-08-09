interface SpotifyIframeAPI {
  createController: (options: { uri: string; width?: number; height?: number; }) => Promise<SpotifyController>;
}

interface SpotifyController {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlay: () => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  getCurrentTrack: () => Promise<SpotifyTrack | null>;
  addListener: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
}

interface SpotifyTrack {
  uri: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  duration_ms: number;
  is_playing: boolean;
}

let apiPromise: Promise<SpotifyIframeAPI> | null = null;

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: SpotifyIframeAPI) => void;
  }
}

export function loadSpotifyIframeApi(): Promise<SpotifyIframeAPI> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (IFrameAPI: SpotifyIframeAPI) => resolve(IFrameAPI);
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  });
  return apiPromise;
}
