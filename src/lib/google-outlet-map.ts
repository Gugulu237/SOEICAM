import type { Point } from "./outlets";
export type MapListener = { remove(): void };
export type OutletMapInstance = {
  panTo(point: Point): void; setZoom(zoom: number): void; getZoom(): number | undefined;
  fitBounds(bounds: MapBounds, padding?: number): void;
};
type MapBounds = { extend(point: Point): void };
export type OutletMarker = HTMLElement & { map: OutletMapInstance | null };
export type MapInfo = { setContent(content: HTMLElement): void; open(options: { map: OutletMapInstance; anchor: OutletMarker; shouldFocus?: boolean }): void; close(): void };
export type GoogleOutletMaps = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => OutletMapInstance;
  LatLngBounds: new () => MapBounds;
  InfoWindow: new () => MapInfo;
  marker: { AdvancedMarkerElement: new (options: Record<string, unknown>) => OutletMarker };
  event: { clearInstanceListeners(instance: unknown): void };
};
type MapsWindow = Window & {
  google?: { maps: GoogleOutletMaps };
  __soeicamOutletMapReady?: () => void;
  gm_authFailure?: () => void;
};
let loading: Promise<GoogleOutletMaps> | undefined;
let authenticationFailed = false;
export function loadOutletMap(key: string, language: string): Promise<GoogleOutletMaps> {
  const target = window as MapsWindow;
  if (!key) return Promise.reject(new Error("Map unavailable"));
  if (authenticationFailed) return Promise.reject(new Error("Map unavailable"));
  if (target.google?.maps?.marker) return Promise.resolve(target.google.maps);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    let done = false;
    const fail = () => {
      window.dispatchEvent(new Event("soeicam:outlet-map-error"));
      if (done) return;
      done = true; clearTimeout(timeout); script.remove();
      delete target.__soeicamOutletMapReady; loading = undefined;
      reject(new Error("Map unavailable"));
    };
    const timeout = setTimeout(fail, 20000);
    target.gm_authFailure = () => { authenticationFailed = true; fail(); };
    target.__soeicamOutletMapReady = () => {
      if (done) return;
      if (!target.google?.maps?.marker) { fail(); return; }
      done = true; clearTimeout(timeout); delete target.__soeicamOutletMapReady;
      resolve(target.google.maps);
    };
    script.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({ key, loading: "async", callback: "__soeicamOutletMapReady", libraries: "maps,marker", v: "quarterly", language, region: "CM" })}`;
    script.async = true; script.onerror = fail;
    document.head.appendChild(script);
  });
  return loading;
}
