# Screenshot Refactor Plan

## Goal

Replace the fragile client-side `html2canvas` capture path with a Playwright-backed export path that renders result tables in a real headless browser and returns a PNG. The first target is table/result-card exports, not whole-page screenshots.

This app is hosted on Vercel, so the implementation must work as a Vercel Node.js Function. It must not depend on an Edge Runtime, a persistent server process, local filesystem state outside `/tmp`, or browser state stored in the user's `sessionStorage`.

## Current State

- Export buttons call `useScreenshot()` in `hooks/useScreenshot.ts`.
- `useScreenshot()` captures the live DOM with `html2canvas`, hides `[data-screenshot-ignore="true"]` controls in the cloned document, and either downloads the PNG or writes it to the clipboard.
- Calculator values mostly live in React state and browser `sessionStorage`, so a server-side screenshot function cannot reconstruct an export unless the client sends the needed state explicitly.

## Proposed Architecture

Use a Vercel Node.js API route as a screenshot renderer:

1. The client serializes the active export state into a small JSON payload.
2. The client posts that payload to `POST /api/screenshot`.
3. The API route validates the payload against an allowlist of known export types.
4. The API route launches headless Chromium through `playwright-core`.
5. The API route renders an internal export-only route, waits for a ready marker, screenshots a known element, and returns `image/png`.
6. The client reuses the existing download and clipboard behavior with the returned PNG blob.

Recommended first implementation shape:

- `pages/api/screenshot.ts`
- `pages/export/[exportId].tsx`
- `components/export/ExportDocument.tsx`
- `components/export/exportPayloads.ts`
- `components/export/exportRegistry.ts`
- `lib/server/browser.ts`

## Vercel Constraints

- Use the Node.js runtime. Vercel documents Node.js Functions as the right runtime for larger/computational work and notes support for bundles up to 250 MB.
- Do not use the Edge Runtime. Browser binaries and Playwright process spawning are Node/server concerns.
- Configure max duration for the API route in `vercel.json`, for example:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "pages/api/screenshot.ts": {
      "maxDuration": 30
    }
  }
}
```

- Memory is configured in the Vercel dashboard, not `vercel.json`. Vercel currently defaults to 2 GB / 1 vCPU on current projects, and higher memory/CPU is a Pro/Enterprise dashboard setting.
- Keep deployment size under control. Start with `playwright-core` plus `@sparticuz/chromium`. If the function bundle becomes too large, switch to `@sparticuz/chromium-min` and host the Chromium pack separately.
- Use `/tmp` only for Chromium extraction or temporary artifacts. Do not rely on persistence across invocations.

References:

- Vercel Node.js Functions: https://vercel.com/docs/functions/runtimes/node-js
- Vercel function duration: https://vercel.com/docs/functions/configuring-functions/duration
- Vercel function memory: https://vercel.com/docs/functions/configuring-functions/memory
- Playwright element screenshots: https://playwright.dev/docs/screenshots
- Serverless Chromium package: https://github.com/Sparticuz/chromium

## Rendering Strategy

Prefer an internal export-only route over screenshotting the public calculator page.

The API route can:

1. Create a Playwright browser context.
2. Inject the validated payload into `sessionStorage` with `page.addInitScript()`.
3. Navigate to `${origin}/export/${exportId}`.
4. Wait for `[data-export-ready="true"]`.
5. Screenshot `[data-export-root="true"]`.

This avoids huge query strings and avoids depending on the user's browser session. It also keeps the export route styled by the real Next/Tailwind app instead of hand-assembling CSS inside the API route.

Fallback if deployment protection or internal self-navigation becomes awkward:

- Render the export HTML inside the API route with `renderToStaticMarkup()`.
- Use `page.setContent()` with a small inline export CSS stylesheet.
- Screenshot the export root from that static document.

## Payload Design

Do not send arbitrary DOM, HTML, CSS, or URLs to the API route.

Use a strict export payload:

```ts
type ScreenshotExportId =
  | 'bremsweg-results'
  | 'const-drive-results'
  | 'const-decel-results'
  | 'const-accel-results'
  | 'vmt-eso-results'
  | 'vmt-riegl-results'
  | 'sonstige-percent-results'
  | 'sonstige-ausscher-results'
  | 'sonstige-curve-results'
  | 'sonstige-speed-results'
  | 'minderwert-results'
  | 'minderwert-comparison'
  | 'bvsk-system'
  | 'mfm-system';
```

Each payload should include only the inputs and computed display rows needed for the export. The server should recompute or format values where practical, but the first pass can send already formatted rows for lower implementation risk.

Example shape:

```ts
type ScreenshotPayload = {
  exportId: ScreenshotExportId;
  filename: string;
  title: string;
  theme: 'primary' | 'mfm' | 'neutral';
  rows: Array<{
    label: string;
    variable?: string;
    value: string;
    formula?: string;
    unit?: string;
    state?: 'input' | 'result' | 'error' | 'empty';
  }>;
};
```

## Security Rules

- Reject unknown `exportId` values.
- Reject payloads above a small size limit, for example 64 KB.
- Do not let the caller provide a URL for Playwright to open.
- Do not render caller-provided HTML with `dangerouslySetInnerHTML`.
- Escape text normally through React rendering.
- Use `POST` only.
- Return `400` for invalid payloads and `500` for renderer failures.
- Consider same-origin checks or a CSRF token if the deployment is publicly reachable and authenticated users matter later.

## Browser Helper

Create one server-only browser helper that hides local/Vercel differences:

```ts
// lib/server/browser.ts
import { chromium as playwright } from 'playwright-core';
import chromium from '@sparticuz/chromium';

export async function launchScreenshotBrowser() {
  const isLocal = process.env.NODE_ENV !== 'production';

  return playwright.launch({
    args: isLocal ? [] : chromium.args,
    executablePath: isLocal
      ? process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      : await chromium.executablePath(),
    headless: true,
  });
}
```

Local development options:

- Install local Chromium with `npx playwright install chromium`.
- Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if Playwright cannot discover the local browser.

## API Route Flow

```ts
// pages/api/screenshot.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const payload = validateScreenshotPayload(req.body);
  if (!payload.ok) return res.status(400).json({ error: payload.error });

  const browser = await launchScreenshotBrowser();

  try {
    const origin = getRequestOrigin(req);
    const context = await browser.newContext({
      viewport: { width: 1200, height: 900 },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();
    await page.addInitScript((data) => {
      window.sessionStorage.setItem('screenshot-export-payload', JSON.stringify(data));
    }, payload.data);

    await page.goto(`${origin}/export/${payload.data.exportId}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-export-ready="true"]', { timeout: 5000 });

    const image = await page.locator('[data-export-root="true"]').screenshot({
      type: 'png',
      omitBackground: false,
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(image);
  } finally {
    await browser.close();
  }
}
```

## Client Hook Changes

Keep the existing public API mostly intact:

- `handleScreenshot(elementId, filename)` becomes a compatibility wrapper.
- Add a preferred `handleExportScreenshot(payload)` path.
- Add `handleExportClipboard(payload)` for PNG blob clipboard copy.
- Keep the current `html2canvas` path as fallback for one release.

The UI migration should happen card by card. Each result card gets a small payload builder colocated with the current component/page.

## Implementation Phases

### Phase 1: Thin Spike

- Add `playwright-core` and `@sparticuz/chromium`.
- Add `pages/api/screenshot.ts`.
- Add one export-only route for `bremsweg-results`.
- Add a Bremsweg payload builder.
- Add a development-only button or switch the existing Bremsweg download button behind a feature flag.
- Verify locally with `npm run dev` and a local Chromium executable.
- Deploy to a Vercel preview and verify cold-start behavior, image fidelity, and function logs.

Exit criteria:

- Bremsweg result card exports as PNG from Vercel.
- Export controls are absent from the output.
- Fonts, SVG formula assets, borders, and table colors render better than or equal to the current `html2canvas` output.
- Failed export falls back to the current `html2canvas` hook.

### Phase 2: Shared Export Components

- Extract reusable export card/table components under `components/export/`.
- Map existing calculator result cards into payload builders.
- Standardize width, padding, background, and table border rules for export-only rendering.
- Preserve the current visible UI while changing only export output.

Exit criteria:

- Bremsweg, Konstantfahrt, VMT, and Sonstige result tables use the Playwright path.
- The old hook still exists as fallback.
- `npm run lint`, `npm test`, TypeScript, and a production build pass.

### Phase 3: Minderwert and System Tables

- Add payload builders for `minderwert-results`, `minderwert-comparison`, `bvsk-system`, and `mfm-system`.
- Tune export width for wide comparison bars and reference tables.
- Check mobile-independent output; server export should not inherit a narrow viewport.

Exit criteria:

- Minderwert exports are stable and readable without fragile badge/marker geometry.
- BVSK and MFM color systems remain distinct.

### Phase 4: Remove or Demote `html2canvas`

- Keep `html2canvas` only as an emergency fallback, or remove it if Vercel export is reliable.
- Update README and AGENTS guidance.
- Remove screenshot-only color workarounds that are only needed for `html2canvas`, if no longer relevant.

Exit criteria:

- All export buttons use the server renderer by default.
- Documentation describes Vercel/Playwright export behavior accurately.

## Testing and Verification

Automated:

- Unit-test payload builders for known rows and edge/error states.
- Add a small API validation test if a test harness for API routes is introduced.
- Keep formula helper tests separate from export tests.

Manual:

- Compare current `html2canvas` PNG vs Playwright PNG for each card.
- Verify clipboard write and download behavior in Chrome.
- Verify failed clipboard permission still falls back to download.
- Verify Vercel preview logs for cold start duration and memory pressure.
- Verify a production build before rollout.

Commands:

```bash
npm run lint
npm test
./node_modules/.bin/tsc --noEmit --incremental false
npm run build
```

## Open Questions

- Is Vercel deployment protection enabled for previews? If yes, self-navigation from the API route to `/export/[exportId]` may need a bypass token or the `page.setContent()` fallback.
- Should the server recompute formula outputs from raw inputs, or should the client send formatted display rows? Recomputing is cleaner long term; formatted rows are faster for the first spike.
- Should exports include SVG formula images, plain text formulas, or both? Plain text is more robust; SVG formulas preserve current visual identity.
- Is a 30-second max duration enough under cold starts? It should be, but the first preview deploy should measure this.
