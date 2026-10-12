# SOEICAM website

First version of the SOEICAM public website, with Yola as its first featured brand.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3010. The site has English and French views, a browsable Yola product range, company and dairy information pages, and direct contact options.

The catalogue is maintained in `src/lib/products.ts`. Add new product assets under `public/brand/products/` and a corresponding entry in that file. Product sizes follow the supplied catalogue naming; confirm packaging units before public launch where a pack image uses a different unit.

## Hostinger deployment

Keep Node.js 24, npm, the build command `npm run build`, and the output directory `.next`.

The build and start scripts use Node's native TypeScript loader for the single `next.config.ts` file. Production builds use Webpack so Next.js can fall back to the matching `@next/swc-wasm-nodejs` package on build hosts whose glibc cannot load the native SWC binary. Development still uses the default local bundler.

Commit `package-lock.json` whenever dependency versions change. Do not omit optional dependencies when installing on the build host. If Hostinger restores an old build or compiler cache, clear that cache before redeploying the latest commit.
