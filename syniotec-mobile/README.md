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

## Assets

`www.figma.com` is blocked by the egress policy in the environment this was
built in, so the asset URLs that `get_design_context` and `download_assets`
hand back could not be fetched over HTTP. The vectors are nonetheless the
originals: the `use_figma` tool runs `node.exportAsync({ format: 'SVG_STRING' })`
through the Plugin API and returns the markup as **text**, which travels over
the MCP channel instead of HTTP. Everything in `src/assets/icons/` came across
that way.

| File | Figma node |
| --- | --- |
| `logo-syniotec.svg` | `2:73` |
| `art-shift-calendar.svg` | `2084:7387` |
| `art-clock-24.svg` | `2084:8481` |
| `art-cup.svg` | `2084:8730` |
| `row-vacation.svg` | `2084:7840` |
| `row-sick.svg` | `2084:7853` |
| `reason-school.svg` | `2084:7767` |
| `reason-training.svg` | `2084:7775` |
| `reason-parental.svg` | `2084:7783` |
| `reason-other.svg` | `2084:7792` |

The chrome that the design draws as small generic UI marks — back and paging
chevrons, the calendar button, play/pause/stop, plus and the direction pin —
stays as inline SVG in `components/icons.tsx`, on the same 24px grid.

## The destination map

Node `2084:7658` fills its slot with a raster tile of **Google Maps in the
default roadmap style**. Unlike the vectors, a raster cannot come back as
text — the tile is 66 KB as JPG and 210 KB as PNG, and a tool result is
truncated at 20 KB — so `DestinationMap` in `components/DetailSheet.tsx`
draws a stand-in in that same default palette: pale land, green cover, blue
water, a white local-road mesh over orange arterials, a green route shield
and a grey place label.

It takes a `src` prop, so the real tile drops straight in — either exported
from Figma, or served live from the Static Maps API:

```tsx
<DestinationMap
  src={`https://maps.googleapis.com/maps/api/staticmap?center=Halensee,Berlin&zoom=13&size=408x120&scale=2&key=${key}`}
  label="Halensee"
/>
```

Copy, dates and sample records are transcribed from the frames as-is, including
the design's own spellings (“Softweare Asset manager”, “Pennding”, “Brake”).
