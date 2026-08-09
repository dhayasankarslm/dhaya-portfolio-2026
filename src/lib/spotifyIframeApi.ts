export interface SpotifyController {
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  loadUri: (uri: string) => void;
  destroy: () => void;
  addListener: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
}

export interface SpotifyControllerOptions {
  uri: string;
  width?: string | number;
  height?: string | number;
}

export interface SpotifyIframeAPI {
  createController: (
    element: HTMLElement,
    options: SpotifyControllerOptions,
    callback: (controller: SpotifyController) => void
  ) => void;
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
