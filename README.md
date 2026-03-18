# HeartStamp Design System

A React component library built on [Radix UI](https://www.radix-ui.com/) primitives and [Tailwind CSS](https://tailwindcss.com/), based on the [HeartStamp Figma Design System](https://www.figma.com/design/E0p4VHO129Jf4k0KFdVnPx/HeartStamp-DS).

---

## Installation

```bash
npm install @heartstamp/design-system
# or
yarn add @heartstamp/design-system
# or
pnpm add @heartstamp/design-system
```

> **Peer dependencies** — React 18+ and ReactDOM 18+ must be installed in your project.

---

## Setup

### 1. Import the CSS

Import the design system stylesheet **once** in your app entry point (e.g. `main.tsx` or `_app.tsx`):

```ts
import '@heartstamp/design-system/design-system.css';
```

### 2. Use components

```tsx
import { HsBtn, HsInp, HsCrd } from '@heartstamp/design-system';

export default function App() {
  return (
    <HsCrd>
      <HsInp placeholder="Enter your email" />
      <HsBtn>Submit</HsBtn>
    </HsCrd>
  );
}
```

---

## Theming

The library ships with a full light/dark token system via CSS variables. Apply a theme by setting the `data-theme` attribute (or the `dark` class) on your root element:

```html
<!-- Light (default) -->
<html>...</html>

<!-- Dark -->
<html class="dark">...</html>
```

You can override individual tokens in your own CSS:

```css
:root {
  --color-primary: #be1d2c;
  --radius-button: 25px;
}
```

See `src/app/theme.ts` for the full token reference.

---

## Available Components

| Export | Component |
|---|---|
| `HsBtn` | Button |
| `HsInp` | Input |
| `HsCrd` | Card |
| `HsBdg` | Badge |
| `HsAvt` | Avatar |
| `HsAcc` | Accordion |
| `HsAlrt` | Alert |
| `HsBrd` | Breadcrumb |
| `HsCal` | Calendar |
| `HsCbx` | Checkbox |
| `HsCmd` | Command |
| `HsCollapsible` | Collapsible |
| `HsCtxMenu` | Context Menu |
| `HsDdMenu` | Dropdown Menu |
| `HsDlg` | Dialog |
| `HsHvrCard` | Hover Card |
| `HsLbl` | Label |
| `HsLogo` | HeartStamp Logo |
| `HsNav` | Top Navigation |
| `HsPgn` | Pagination |
| `HsPpvr` | Popover |
| `HsPrg` | Progress |
| `HsRdo` | Radio Group |
| `HsScrollBox` | Scroll Area |
| `HsSel` | Select |
| `HsSep` | Separator |
| `HsSht` | Sheet |
| `HsSkl` | Skeleton |
| `HsSldr` | Slider |
| `HsSwt` | Switch |
| `HsTarea` | Textarea |
| `HsTbl` | Table |
| `HsTgl` | Toggle |
| `HsTip` | Tooltip |

All base Radix UI primitives are also re-exported (e.g. `Button`, `Card`, `Dialog`, `Tabs`, etc.).

---

## Building from Source

```bash
# Install dependencies
npm install

# Start the documentation dev server
npm run dev

# Build the npm library (outputs to dist/)
npm run build

# Type-check without emitting
npm run typecheck
```

---

## Publishing

The `prepublishOnly` script runs `npm run build` automatically before publishing, so simply run:

```bash
npm publish --access public
```

The `dist/` folder is what gets published. Source files and `node_modules` are excluded via the `files` field in `package.json`.

---

## License

MIT
