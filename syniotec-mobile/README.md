# Syniotec Mobile — Time Tracking

React implementation of the Figma page **“Timetracking David”**, pulled through
the Figma MCP connector.

- File: `nGNChppV1Lm9eoEndNzrsN` (*Sam-in-Mobile*)
- Page node: `2084:7356`
- Source: https://www.figma.com/design/nGNChppV1Lm9eoEndNzrsN/Sam-in-Mobile?node-id=2084-7356

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

The app renders at the design's 440px frame width, centred on the dark ground.

## Frame → route map

| Figma node | Frame | Route | Component |
| --- | --- | --- | --- |
| `2084:7357` | Time Tracking Start | `/` | `screens/Home.tsx` |
| `2084:7635` | Start day (job briefing) | `/job` | `screens/JobDetail.tsx` |
| `2084:8451` | Time Tracking Working | `/working` | `screens/Working.tsx` |
| `2084:8700` | Time Tracking Brake | `/break` | `screens/Break.tsx` |
| `2084:7809` | Your Requests + History | `/requests` | `screens/Requests.tsx` |
| `2084:7723` | New Request form | `/requests/new` | `screens/NewRequest.tsx` |
| `2084:8950` | Request review (Reject / Confirm) | `/requests/review` | `screens/RequestReview.tsx` |
| `2084:7975` | Planning — day strip | `/planning` | `screens/Planning.tsx` |
| `2084:8148` | Planning — month expanded | `/planning` (expanded state) | `screens/Planning.tsx` |
| `2084:9037` | Timesheet — day strip | `/timesheet` | `screens/Timesheet.tsx` |
| `2084:9280` | Timesheet — month expanded | `/timesheet/month` | `screens/Timesheet.tsx` |

The two Planning frames and the two Timesheet frames are the collapsed and
expanded states of one screen, so each pair shares a component and toggles via
the calendar chevron.

## Design tokens

`src/index.css` mirrors the Figma variables verbatim — the names in `@theme`
match the names returned by `get_variable_defs`, so the mapping stays
auditable:

| Figma variable | Token |
| --- | --- |
| `Black/Eerie Black` `#151515` | `--color-eerie-black` |
| `Primary/Candy Apple` `#ff1900` | `--color-candy-apple` |
| `Secondary/Amber` `#fe7d00` | `--color-amber` |
| `Pending/Honey` `#ffb30f` | `--color-honey` |
| `Success/Mantis` `#71c562` | `--color-mantis` |
| `Secondary/Silver Chalince` `#a7b0b3` | `--color-silver-chalice` |
| `Grey/Cultured` `#f1f1f1` | `--color-cultured` |
| `Secondary/Dark Sienna` `#411817` | `--color-dark-sienna` |
| `Secondary/Dodger Blue` `#459af7` | `--color-dodger-blue` |
| `Secondary/Xanthous` `#f4b642` | `--color-xanthous` |
| `Light/Smoke` `#fbfbfb`, `Light/Snow` `#fffcfc` | `--color-smoke`, `--color-snow` |

The Figma text styles (`Titles/Title 3–5`, `Text/Body XS`, `Text/Body S 2`,
`Text/Caption 1–2`) are expressed as the `title-3`, `title-4`, `title-5`,
`body-xs`, `body-s`, `caption-1` and `caption-2` utilities.

## Known deviations from the Figma file

Both come from assets the build environment cannot reach — the network policy
blocks direct requests to `figma.com`, so the SVG and raster assets the MCP
payload points at could not be downloaded.

1. **Icons and the wordmark are redrawn.** Every glyph in `components/icons.tsx`
   is hand-authored inline SVG on the same 24px grid as the original, and
   `components/Logo.tsx` sets the wordmark as type. Swap in the exported assets
   when they are available.
2. **`ABC Favorit Expanded` is not bundled.** It is a licensed typeface, so
   `--font-title` falls back to a wide grotesque stack. Replace the first entry
   in that stack once the webfont is licensed for this project. `Montserrat`
   (the body family) loads from Google Fonts as in the design.
3. **The destination map is a placeholder.** `MapPlaceholder` in
   `components/DetailSheet.tsx` draws the same 120px band — roads, water and a
   marker — in place of the raster map tile.

Copy, dates and sample records are transcribed from the frames as-is, including
the design's own spellings (“Softweare Asset manager”, “Pennding”, “Brake”).
