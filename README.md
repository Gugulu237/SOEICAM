# SOEICAM website

First version of the SOEICAM public website, with Yola as its first featured brand.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3010. The site has English and French views, a browsable Yola product range, company and dairy information pages, and direct contact options.

The catalogue is maintained in `src/lib/products.ts`. Add new product assets under `public/brand/products/` and a corresponding entry in that file. Product sizes follow the supplied catalogue naming; confirm packaging units before public launch where a pack image uses a different unit.
