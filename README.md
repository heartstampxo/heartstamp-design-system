# HeartStamp Design System

A React component library built on [shadcn/ui](https://ui.shadcn.com/) — with [Radix UI](https://www.radix-ui.com/) primitives and [Tailwind CSS](https://tailwindcss.com/) under the hood — based on the [HeartStamp Figma Library](https://www.figma.com/design/fm22sR1a5DlXgX4IkjDVXz/HeartStamp-Library?node-id=8098-7906&p=f&t=nu7E7IFzwdnrpSgV-0).

---

## Installation

```bash
npm install @heartstamp/design-system
# or
pnpm add @heartstamp/design-system
# or
yarn add @heartstamp/design-system
```

> **Peer dependencies** — `react` and `react-dom` ≥ 18 must be installed in your project.

---

## Setup

### 1. Import the stylesheet

Import the bundled stylesheet **once** in your app entry point (e.g. `main.tsx`):

```ts
import '@heartstamp/design-system/design-system.css';
```

### 2. Use components

```tsx
import { Btn, Bdg, HsCrd, HsInp } from '@heartstamp/design-system';

export default function App() {
  return (
    <HsCrd>
      <HsInp placeholder="Enter your email" />
      <Btn variant="default">Submit</Btn>
      <Bdg variant="default">New</Bdg>
    </HsCrd>
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
```

---

## Publishing

The `prepublishOnly` script runs `npm run build` automatically before publishing:

```bash
npm publish --access public
```

The `dist/` folder is what gets published. Source files and `node_modules` are excluded via the `files` field in `package.json`.

---

## Links

- 📐 [Figma Library](https://www.figma.com/design/fm22sR1a5DlXgX4IkjDVXz/HeartStamp-Library?node-id=8098-7906&p=f&t=nu7E7IFzwdnrpSgV-0)
- 📦 [npm](https://www.npmjs.com/package/@heartstamp/design-system)
- 🐙 [GitHub](https://github.com/mdheartstamp/heartstamp-design-system)

---

## License

MIT
