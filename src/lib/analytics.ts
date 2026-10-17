type SafeProperties = {
  product_id?: string;
  category?: string;
  customer_type?: string;
  language?: string;
  channel?: string;
};
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function track(event: string, properties: SafeProperties = {}) {
  try {
    if (localStorage.getItem("soeicam-analytics") !== "accepted") return;
    window.gtag?.("event", event, {
      ...properties,
      ...(event === "view_item" && properties.product_id
        ? { items: [{ item_id: properties.product_id }] }
        : {}),
      page_location: window.location.origin + window.location.pathname,
      page_referrer: "",
    });
  } catch {
    /* Analytics must not interrupt an enquiry. */
  }
}
