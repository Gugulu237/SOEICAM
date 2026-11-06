export const outletCategories = ["supermarket", "minimarket", "shop", "wholesaler"] as const;
export type OutletCategory = (typeof outletCategories)[number];
export type Point = { lat: number; lng: number };
export type Outlet = Point & {
  id: string;
  name: string;
  group: string;
  category: OutletCategory;
  address: string;
  town: string;
  neighbourhood: string;
};
export type OutletSnapshot = { outlets: Outlet[]; syncedAt: string };
export type ErpRow = Record<string, unknown>;

const text = (value: unknown, max = 200) => typeof value === "string" ? value.trim().slice(0, max) : "";
function coordinate(value: unknown, max: number) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= max ? number : null;
}
export function coordinates(row: ErpRow): Point | null {
  const lat = coordinate(row.gps_lat, 90), lng = coordinate(row.gps_lng, 180);
  return lat === null || lng === null || (lat === 0 && lng === 0) ? null : { lat, lng };
}

// An explicit projection: never spread ERP records into a public response.
export function publicOutlets(customers: ErpRow[], locations: ErpRow[]): Outlet[] {
  const byId = new Map(customers.map(row => [text(row.id), row]));
  const eligible = (row: ErpRow) => {
    const visited = new Set<string>();
    let current: ErpRow | undefined = row;
    while (current) {
      const id = text(current.id);
      if (!id || visited.has(id) || current.is_active === false || ["rejected", "duplicate"].includes(text(current.acquisition_verified))) return false;
      visited.add(id);
      const parentId = text(current.parent_id);
      if (parentId && !byId.has(parentId)) return false;
      current = parentId ? byId.get(parentId) : undefined;
    }
    return true;
  };
  const result: Outlet[] = [];
  for (const customer of customers) {
    if (!eligible(customer)) continue;
    const parent = byId.get(text(customer.parent_id));
    const category = text(customer.category) || text(parent?.category);
    if (!outletCategories.includes(category as OutletCategory)) continue;
    const business = text(customer.business_name);
    if (!business) continue;
    const id = text(customer.id), group = text(parent?.business_name);
    const branches = locations.filter(row => text(row.customer_id) === id && row.is_active !== false && text(row.id) && text(row.name) && coordinates(row));
    const rootPoint = coordinates(customer);
    // A location marked headquarters supersedes the customer's legacy GPS pin.
    const rootReplaced = branches.some(row => row.is_headquarters === true || (rootPoint && coordinates(row)?.lat === rootPoint.lat && coordinates(row)?.lng === rootPoint.lng));
    const add = (row: ErpRow, name: string, publicId: string, owner: string) => {
      const point = coordinates(row);
      if (!point) return;
      result.push({ id: publicId, name, group: owner, category: category as OutletCategory,
        address: text(row.address, 500), town: text(row.town), neighbourhood: text(row.neighbourhood), ...point });
    };
    if (rootPoint && !rootReplaced) add(customer, business, `customer:${id}`, group);
    for (const branch of branches) {
      const branchName = text(branch.name);
      add(branch, branchName === business ? business : `${business} · ${branchName}`, `location:${text(branch.id)}`, group || business);
    }
  }
  return [...new Map(result.map(row => [row.id, row])).values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

export function searchText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}
export function distanceKm(a: Point, b: Point) {
  const rad = Math.PI / 180;
  const h = Math.sin((b.lat - a.lat) * rad / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin((b.lng - a.lng) * rad / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export function directionsUrl(point: Point) {
  return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", destination: `${point.lat},${point.lng}`, travelmode: "driving" })}`;
}
