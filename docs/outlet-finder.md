# Find our Products

The website's `/en/find-our-products` and `/fr/find-our-products` pages read the same Supabase customer records used by SOEICAM ERP. The page opens with a full-width Google Map, with one YOLA pin per eligible outlet and no customer list. Selecting a pin opens the outlet name, category, address and Google Maps directions. Text, town and type filters update the pins; Near me focuses the nearest matching outlet. The header, footer, homepage and sitemap link to the page. `/find-our-products` redirects to French.

## How locations stay current

The Node.js-only `GET /api/outlets` route reads `public.customer` and `public.customer_location` through Supabase REST. It uses explicit column selections, GET requests only, stable paginated reads, bounded timeouts and one shared in-flight refresh. Successful results are cached in the server process for 60 seconds. Visible pages refresh every 60 seconds and when returning to the tab. A new visit normally sees updates within a minute; an already-open tab can take up to two minutes when its poll and the server cache overlap.

The ERP stays the source of truth. Editing a business name, address, category, active state or GPS point updates the next successful refresh. Deleting or disabling a record removes it; there is no permanent exported customer list to maintain. Neither app needs to be open: only the website server and shared Supabase database must be available.

If either source table fails, the endpoint returns a generic 503 and the page offers a retry and contact link. It does not present an old, possibly withdrawn outlet as current. Real upstream errors and credentials never enter the response.

## Which records appear

- Active `shop`, `minimarket`, `supermarket` and `wholesaler` customers with valid GPS coordinates.
- Active locations belonging to those customers, using each location's own name, address and GPS. No coordinates are invented or inherited from headquarters.
- Customer branches retain their main partner's name. Inactive, rejected, duplicate, missing or cyclic parent records exclude their descendants.
- An explicit headquarters location replaces a customer's older main GPS pin. A location at the same coordinates also supersedes that customer's duplicate pin.
- Cash customers, institutional customers and invalid/missing GPS records do not appear in this retail locator. New eligible retail customers appear without a separate website import.

The public response contains only an outlet ID, business/branch name, group name, category, address, town, neighbourhood, latitude and longitude. It excludes balances, sales, credit terms, phone numbers, contact persons, staff assignments and notes.

The page does not claim live stock availability. “Near me” requests browser permission only on a click, computes straight-line distances in the browser and does not send the visitor's coordinates to the ERP or website API. Directions open Google Maps with the selected outlet's GPS destination.

## Configuration

Set the following privately in `.env.local` for local development and in Hostinger's environment settings for production:

| Variable | Value |
| --- | --- |
| `ERP_SUPABASE_URL` | Same project URL as ERP's `NEXT_PUBLIC_SUPABASE_URL` |
| `ERP_SUPABASE_SECRET_KEY` | ERP project's server-side Supabase secret/service-role key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Website-restricted Google Maps JavaScript API key |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Google JavaScript map ID; `DEMO_MAP_ID` is a development fallback only |

The two ERP variables are server-only and protected by a `server-only` import. Never prefix them with `NEXT_PUBLIC_`, add them to browser code, or commit `.env.local`. All of the website's source reads remain on the server; existing ERP permissions are unchanged.

The current local preview has these four variables configured from the existing ERP environment. Local environment values are not deployed with Git. Configure the host before publishing and rebuild after changing `NEXT_PUBLIC_` values.

### Google Maps website restrictions

In Google Cloud Console → APIs & Services → Credentials → the Maps API key → Application restrictions → Websites, preserve existing restrictions and add the website origins used:

```text
https://soeicam.com/*
https://www.soeicam.com/*
```

These are the customer-facing production domains. Add both to the Google Maps key in Google Cloud; changing source code or environment comments does not change key restrictions. Preserve existing ERP domain restrictions. Keep the key restricted to Maps JavaScript API and ensure that API and billing are enabled.

A production-only key does not authorize localhost. The local preview will continue to show the map-unavailable state until a separately restricted development key is configured, or the page is deployed and tested on an authorized production domain. Never spoof the referrer or remove website restrictions to make a preview work. Rebuild the production website with its Maps key and map ID, configure the server-only ERP variables on the host, and verify the pins on `https://soeicam.com/en/find-our-products`.

References: [Maps loading](https://developers.google.com/maps/documentation/javascript/load-maps-js-api), [accessible markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/accessible-markers), [Maps errors](https://developers.google.com/maps/documentation/javascript/error-messages), [directions URLs](https://developers.google.com/maps/documentation/urls/get-started).

## Verification

`npm run typecheck` and `npm test` cover the website and outlet data boundary. Locator tests check public field projection, inactive/private categories, branches, malformed GPS, pagination, refresh/removal, concurrent requests, source failures and direction URLs. Test fixtures do not write ERP records. Verify both languages, town/type/text filters and the empty state in the local browser. Test map pin selection and “Near me” on a browser with the required Maps origin and location permission.
