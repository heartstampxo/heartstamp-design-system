# HeartStamp Design System

A React component library built on [shadcn/ui](https://ui.shadcn.com/) — with [Radix UI](https://www.radix-ui.com/) primitives and [Tailwind CSS](https://tailwindcss.com/) under the hood — based on the [HeartStamp Figma Library](https://www.figma.com/design/fm22sR1a5DlXgX4IkjDVXz/HeartStamp-Library?node-id=8098-7906&p=f&t=nu7E7IFzwdnrpSgV-0).

---

## Installation

```bash
npm install @heartstampxo/design-system
# or
pnpm add @heartstampxo/design-system
# or
yarn add @heartstampxo/design-system
```

> **Peer dependencies** — `react` and `react-dom` ≥ 18 must be installed in your project.

---

## Setup

### 1. Import the stylesheet

Import the bundled stylesheet **once** in your app entry point (e.g. `main.tsx`):

```ts
import '@heartstampxo/design-system/design-system.css';
```

### 2. Use components

```tsx
import { Btn, Bdg, Crd, Inp } from '@heartstampxo/design-system';

export default function App() {
  return (
    <Crd>
      <Inp placeholder="Enter your email" />
      <Btn variant="default">Submit</Btn>
      <Bdg variant="default">New</Bdg>
    </Crd>
  );
}
```

All components are exported from the package root — no deep path imports needed. Your bundler will automatically tree-shake unused components.

---

## Theming

The library ships with a full light/dark token system via CSS variables. Reference them in your own styles using `var()`:

```css
.my-component {
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: var(--radius-button);
}

.my-highlight {
  color: var(--accent);
  background: var(--accent-subtle);
}

.my-secondary {
  color: var(--muted-fg);
  background: var(--muted);
}
```

To override a token, redefine it in your own `:root`:

```css
:root {
  --accent: #0066ff;          /* swap brand colour */
  --radius-button: 4px;       /* sharper buttons   */
  --font-family-body: 'Inter', sans-serif;
}
```

**Core token groups:**

| Group | Variables |
|---|---|
| **Colour** | `--bg` `--fg` `--muted` `--muted-fg` `--border` `--accent` `--accent-hover` `--accent-subtle` |
| **Radius** | `--radius-xs` `--radius-sm` `--radius-md` `--radius-lg` `--radius-button` `--radius-input` `--radius-full` |
| **Shadow** | `--shadow-xs` `--shadow-sm` `--shadow-md` `--shadow-lg` `--shadow-xl` |
| **Typography** | `--font-family-body` `--font-family-heading` `--font-family-mono` |

See `src/app/theme.ts` for the full token reference.

---

## Components

### HeartStamp Components (`Hs*`)

| Export | Component |
|---|---|
| `Btn` | Button |
| `Inp` | Input |
| `Crd` | Card |
| `Bdg` | Badge |
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
| `HSLogo` | HeartStamp Logo |
| `TopNavDesktop` | Desktop Top Navigation |
| `TopNavMobile` | Mobile Top Navigation |
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

### Radix / Base Primitives

All underlying Radix UI primitives are also re-exported for advanced use cases:

`Accordion` · `AlertDialog` · `Alert` · `AspectRatio` · `Avatar` · `Badge` · `Breadcrumb` · `Button` · `Calendar` · `Card` · `Carousel` · `Chart` · `Checkbox` · `Collapsible` · `Command` · `ContextMenu` · `Dialog` · `Drawer` · `DropdownMenu` · `Form` · `HoverCard` · `Input` · `InputOTP` · `Label` · `Menubar` · `NavigationMenu` · `Pagination` · `Popover` · `ProfileNav` · `Progress` · `RadioGroup` · `Resizable` · `ScrollArea` · `Select` · `Separator` · `Sheet` · `Sidebar` · `Skeleton` · `Slider` · `Sonner` · `Stepper` · `Switch` · `Table` · `Tabs` · `Textarea` · `Toggle` · `ToggleGroup` · `Tooltip`

---

## Development

```bash
# Install dependencies
npm install

# Start the documentation dev server
npm run dev

# Build the npm library (outputs to dist/)
npm run build

# Type-check without emitting
npm run typecheck

# Run unit tests
npm run test

# Verify the package can be released
npm run check:release
```

---

## Publishing

This package is published to GitHub Packages as `@heartstampxo/design-system`.

Publishing is automatic. Every push or merge to `main` triggers the publish workflow:

1. GitHub Actions installs dependencies.
2. The package release gate runs:

```bash
npm run typecheck
npm run build
npm pack --dry-run
```

3. The workflow bumps the patch version automatically, for example `1.12.1` to `1.12.2`.
4. The workflow commits and pushes the version bump back to `main` with `[skip ci]`.
5. The workflow publishes the new package version to GitHub Packages.

Unit tests run in CI for visibility, but they do not block package publishing.

To verify the same release gate locally:

```bash
npm run check:release
```

The `dist/` folder is what gets published. Source files and `node_modules` are excluded via the `files` field in `package.json`.

### Installing From Another Repo

In the consuming repo, add this `.npmrc` file:

```ini
@heartstampxo:registry=https://npm.pkg.github.com
```

Install the latest released package:

```bash
npm install @heartstampxo/design-system
```

Or install a specific released version:

```bash
npm install @heartstampxo/design-system@1.12.2
```

Import the CSS once near the app root:

```ts
import '@heartstampxo/design-system/design-system.css';
```

Import components from the package root:

```tsx
import { Btn, Inp, Crd, Bdg, HSLogo } from '@heartstampxo/design-system';
```

---

## Links

- 📐 [Figma Library](https://www.figma.com/design/fm22sR1a5DlXgX4IkjDVXz/HeartStamp-Library?node-id=8098-7906&p=f&t=nu7E7IFzwdnrpSgV-0)
- 📦 [GitHub Packages](https://github.com/heartstampxo/heartstamp-design-system/packages)
- 🐙 [GitHub](https://github.com/mdheartstamp/heartstamp-design-system)

---

## License

MIT
