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

## Typography

Both families in the design are in place: **ABC Favorit Expanded Medium**
(`Family/Family Title`) ships as `src/assets/fonts/ABCFavoritExpanded-Medium.woff2`,
converted from the OTF supplied with the project, and **Montserrat**
(`Family/Family Body`) loads from Google Fonts. ABC Favorit is a commercial
Dinamo typeface — it is included here under this project's licence only.

## Known deviations from the Figma file

The organisation's egress policy blocks `www.figma.com` for this environment, so
the SVG and raster assets the MCP payload points at could not be downloaded.
Everything below is drawn to match high-resolution renders of the same nodes,
pulled through the MCP connector:

1. **Icons and artwork are redrawn as inline SVG** in `components/icons.tsx` —
   the shift calendar (node `2084:7387`), the 24-hour clock (`2084:8481`), the
   break mug (`2084:8727`), the request-reason glyphs and the controls. Swap in
   the exported assets once the host is reachable.
2. **The wordmark is set as type**, not as the outlined logo asset
   (`components/Logo.tsx`). It uses the real ABC Favorit Expanded, so it matches
   node `2:73` closely, but it is text rather than the original vector.
3. **The destination map is a placeholder.** `MapPlaceholder` in
   `components/DetailSheet.tsx` draws the same 120px band — roads, water and a
   marker — in place of the raster map tile.

Copy, dates and sample records are transcribed from the frames as-is, including
the design's own spellings (“Softweare Asset manager”, “Pennding”, “Brake”).
