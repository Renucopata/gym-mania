# DESIGN_SYSTEM_AUDIT.md — Smash Gym (staff frontend)

Read-only audit of `C:\Users\ASUS\Documents\Tesis\SmashPlataforma\smash-gym`
to inform a separate Next.js + Tailwind public-facing site / member portal.
No code in this repo was modified. Citations are `file:line`.

---

## 1. Tech & styling approach

- **Framework**: React 18 + Vite 5. `package.json:14-15,35` lists `react ^18.3.1`, `vite ^5.4.10`. Entry at `src/main.jsx:6` mounts `<App />` from `src/App.jsx` via `createRoot`. No SSR; SPA only. Routing via `react-router-dom ^6.28.0` (`package.json:18`, `src/App.jsx:2`).
- **CSS approach**: **Tailwind CSS 3.4.15** + autoprefixer + PostCSS, no other CSS solution. `postcss.config.js:2-5` wires the two plugins. `src/index.css` is one file, four lines:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
  (`src/index.css:1-3`). No `@layer` overrides, no custom utility classes, no design tokens. Everything visual is inline utility classes in JSX — no CSS modules, no styled-components, no Sass.
- **Tailwind config** (`tailwind.config.js`):
  ```js
  export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        fontFamily: { jaro: ["Jaro", "sans-serif"] },
      },
    },
    plugins: [],
  }
  ```
  The **only** theme extension is the `jaro` font family. No custom colors, no custom spacing, no custom shadows, no plugins. Brand colors live as arbitrary values (`bg-[#834f9b]`) scattered across components — Tailwind theme is unaware of them. This is the single biggest portability issue for the new repo.
- **Global stylesheets**: `src/index.css` (the four lines above) — that's it.
- **Component library**: **None**. No MUI, no Chakra, no shadcn, no Radix, no Headless UI. Modals, tables, forms, dialogs are all hand-rolled with Tailwind utilities. Only third-party visual deps are `chart.js + react-chartjs-2` (charts) and `react-webcam` (client-photo capture). `axios`, `xlsx`, `react-router-dom` round out runtime deps.

---

## 2. Color palette

Tailwind's theme has no custom colors — every brand color is an arbitrary `[#…]` value typed inline. The same five hex codes recur across every page. **Inconsistency note**: chart colors (`#3B82F6`, `#4CAF50`, `#FF9800`) are unrelated to the brand palette.

### Brand
| Role | Hex | Source (sample) |
| --- | --- | --- |
| **PRIMARY — Smash purple** | `#834f9b` | `src/pages/WelcomePage.jsx:24` (welcome bg), `src/pages/DashboardPage.jsx:23` (sidebar bg), `src/pages/ClientsPage.jsx:107,119` (active tab + underline), `src/pages/EmployeesPage.jsx:124,139`, `src/pages/MachinesPage.jsx:60,72`, `src/pages/ChartsPage.jsx:285`, `src/components/RegisterModal.jsx:89` |
| Brand secondary — light lavender | `#d9bddc` | `src/pages/DashboardPage.jsx:37` (header), `src/pages/ClientsPage.jsx:92`, `src/pages/MembershipsPage.jsx:76`, `src/pages/EmployeesPage.jsx:110`, `src/pages/MachinesPage.jsx:46`, `src/components/Login.jsx:56`, `src/components/Sidebar.jsx:14,20,26,32` (hover) |
| Brand accent — emerald/teal | `#0bae90` | `src/pages/WelcomePage.jsx:46` (CTA), `src/components/Login.jsx:111`, `src/components/RegisterButton.jsx:7`, `src/pages/ClientsPage.jsx:140,213` (primary buttons + active pagination), and ~15 other primary-button occurrences |
| Brand dark / charcoal | `#3b3b41` | `src/pages/WelcomePage.jsx:37` ("¡Bienvenido!" text), `src/pages/DashboardPage.jsx:26,49`, `src/components/Sidebar.jsx:14,20,26,32` (sidebar underline gradient) |

> "Smash purple" `#834f9b` is the brand primary — the largest surface (sidebar, welcome page background, page content cards via its lavender variant) and the only color used to mark *active* tab state.

### Tailwind preset colors used (neutrals + states)
| Role | Tailwind class | Example |
| --- | --- | --- |
| Page bg (most authenticated pages) | `bg-gray-100` | `src/pages/DashboardPage.jsx:18`, `src/pages/ClientsPage.jsx:91`, `src/pages/EmployeesPage.jsx:109`, `src/pages/MembershipsPage.jsx:75`, `src/pages/MachinesPage.jsx:45`, `src/pages/AddEmployeesPage.jsx:109` |
| Surface / card | `bg-white` | `src/pages/AddEmployeesPage.jsx:110`, `src/components/AddClientModal.jsx:127`, `src/components/AddMemberModal.jsx:185`, `src/components/RegisterModal.jsx:48` |
| Input bg | `bg-gray-200` | `src/pages/DashboardPage.jsx:49`, `src/pages/ClientsPage.jsx:136`, `src/pages/MembershipsPage.jsx:89` |
| Table row hover | `bg-gray-50` | `src/pages/ClientsPage.jsx:162`, `src/pages/EmployeesPage.jsx:184`, `src/components/AttendanceList.jsx:50` |
| Borders | `border-gray-300`, `border-gray-200` | `src/components/Login.jsx:65`, `src/pages/EmployeesPage.jsx:117` |
| Text primary | `text-black`, `text-gray-700` | `src/pages/ClientsPage.jsx:95`, `src/components/Login.jsx:57` |
| Text secondary / muted | `text-gray-500`, `text-gray-600` | `src/pages/ClientsPage.jsx:108`, `src/components/Login.jsx:61` |
| Modal scrim | `bg-black bg-opacity-50` | `src/components/AddClientModal.jsx:123`, `src/components/AddMemberModal.jsx:181`, `src/components/RegisterModal.jsx:44`, `src/components/ClientsDetailModal.jsx:96` |
| Destructive bg | `bg-red-500` | `src/components/Sidebar.jsx:42` (logout), `src/components/DeleteClient.jsx:37` |
| Destructive bg (alt) | `bg-red-600` (hover) | `src/components/Sidebar.jsx:42` |
| Stat-card "good" bg | `bg-green-100` | `src/pages/ChartsPage.jsx:312,419` |
| Stat-card "info" bg | `bg-blue-100` | `src/pages/ChartsPage.jsx:308,413` |
| Stat-card "danger" bg | `bg-red-100` | `src/pages/ChartsPage.jsx:316` |
| Status pill — active | `bg-green-100 text-green-800` | `src/pages/EmployeesPage.jsx:196`, `src/pages/MachinesPage.jsx:119` |
| Status pill — warn | `bg-yellow-100 text-yellow-800` | `src/pages/EmployeesPage.jsx:198`, `src/pages/MachinesPage.jsx:121` |
| Status pill — danger | `bg-red-100 text-red-800` | `src/pages/EmployeesPage.jsx:199`, `src/pages/MachinesPage.jsx:122` |

### Semantic / state
| Role | Color | Source |
| --- | --- | --- |
| Error text | `text-red-500`, `text-red-600`, `text-red-700` | `src/components/Login.jsx:106`, `src/components/AttendanceList.jsx:32`, `src/components/AddClientModal.jsx:133` |
| Error card | `bg-red-100 border-red-400 text-red-700` | `src/components/AddClientModal.jsx:132`, `src/components/AddMemberModal.jsx:190` |
| Success text | `text-green-500` | `src/components/AddClientModal.jsx:136`, `src/components/AddMemberModal.jsx:194`, `src/components/DeleteClient.jsx:26` |
| Blue text on white | `text-blue-500` | `src/pages/ChartsPage.jsx:492` |
| Stat highlight | `text-blue-800`, `text-green-700` | `src/pages/ChartsPage.jsx:415,421` |
| Outlier: `AddEmployeesPage` submit | `bg-blue-500 hover:bg-blue-600` | `src/pages/AddEmployeesPage.jsx:284` — inconsistent with the `#0bae90` primary-button convention elsewhere |

### Chart-only colors (not in the brand system)
- `#3B82F6` blue, `#4CAF50` green, `#FF9800` orange — `src/pages/ChartsPage.jsx:111,122,373,378,383`. Material-Design–style preset, picked independently of the gym palette. Don't reuse for marketing.

### Dark mode
**None.** No `dark:` variants anywhere, no `darkMode` config in `tailwind.config.js`, no theme toggle. The app is light-mode only — though the *brand* (logo background) is dark charcoal `#3b3b41`, which is the inverse of how the staff UI uses it.

---

## 3. Typography

### Font families
- **`Jaro`** — the single brand font. Loaded from Google Fonts via `<link>` in `index.html:11`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&display=swap" rel="stylesheet">
  ```
  Exposed in Tailwind as `font-jaro` (`tailwind.config.js:9-10`). **Not** set as the default `body` font — components opt in by adding `font-jaro` to specific elements (`src/components/Login.jsx:57,61,77`, `src/pages/DashboardPage.jsx:38,40,49`, dozens of others). When `font-jaro` is missing, the browser falls back to Tailwind's default `font-sans` stack. This is inconsistent across the app — see "tone" notes.
- **Font Awesome 6.7.1** — pulled in for icons only (not typography), via CDN `index.html:12-14`.
- No self-hosted fonts. No `@font-face`. No system-font stack defined.

Jaro is a chunky, display-leaning grotesque (rounded geometric forms, all-caps friendly) — *not* a body-copy face. The staff app uses it for everything regardless, which produces a "wall of branded heading" look in tables and forms.

### Type scale (Tailwind defaults, no customization)
| Token | Sample usage |
| --- | --- |
| `text-6xl` (3.75rem) | `src/pages/WelcomePage.jsx:37` — "¡Bienvenido!" |
| `text-4xl` (2.25rem) | `src/pages/DashboardPage.jsx:40` — "Control de asistencias" |
| `text-3xl` (1.875rem) | `src/pages/WelcomePage.jsx:39`, `src/pages/DashboardPage.jsx:38`, `src/components/Login.jsx:57`, `src/pages/ChartsPage.jsx:287` |
| `text-2xl` (1.5rem) | `src/components/AddClientModal.jsx:130`, `src/components/ClientsDetailModal.jsx:152`, `src/pages/ChartsPage.jsx:310,314,318,327,398,415,421` (h2 + big stat numbers) |
| `text-xl` (1.25rem) | `src/pages/ClientsPage.jsx:101` (tab labels), `src/components/AttendanceList.jsx:28`, `src/components/RegisterModal.jsx:59` |
| `text-lg` (1.125rem) | `src/components/Login.jsx:61,82` (form labels), `src/pages/ChartsPage.jsx:309,313,317` (stat-card titles) |
| `text-md` (~1rem) | `src/pages/ClientsPage.jsx:95`, `src/pages/EmployeesPage.jsx:112` — breadcrumb size |
| (default `text-base`) | body, table cells (no size class set) |
| `text-sm` | `src/pages/AddEmployeesPage.jsx:127` — inline form errors |
| `text-xs` | `src/pages/EmployeesPage.jsx:194`, `src/pages/MachinesPage.jsx:117` — status pills |

### Weights
`font-bold`, `font-semibold`, `font-medium` only. No `font-light`, `font-extrabold`, `font-black`. Mostly weight is conveyed via Jaro's chunky shapes rather than weight variation.

### Line height / letter spacing
**No customization.** No `leading-*` or `tracking-*` utilities appear in any page or component scanned. Everything uses Tailwind defaults.

---

## 4. Spacing & layout

### Container / page shell
The "data page" template is repeated across `ClientsPage`, `MembershipsPage`, `EmployeesPage`, `MachinesPage`:
```jsx
<div className="min-h-screen bg-gray-100 flex justify-center items-center">
  <div className="w-[90vw] h-[90vh] bg-[#d9bddc] shadow-lg rounded-lg p-6">
    {/* breadcrumb, tabs, search bar, white inner table card */}
  </div>
</div>
```
(`src/pages/ClientsPage.jsx:91-92`, `src/pages/MembershipsPage.jsx:75-76`, `src/pages/EmployeesPage.jsx:109-110`, `src/pages/MachinesPage.jsx:45-46`). Note the hardcoded viewport-percentage sizing (`w-[90vw] h-[90vh]`) — this fights the browser on small screens and produces awkward cropping; almost no responsive breakpoints elsewhere (a few `lg:hidden` in `DashboardPage.jsx:38,40,49`, a few `md:grid-cols-*` in `ChartsPage.jsx:307,328,411,455`, otherwise nothing).

`ChartsPage` uses `max-w-7xl mx-auto` instead (`src/pages/ChartsPage.jsx:286,326,396,430,471`) — the only place that uses a real centered container.

### Spacing values (Tailwind scale, unmodified)
Most common: `p-2`, `p-4`, `p-6`, `p-8`, `px-3 py-2`, `px-4 py-2`, `px-6 py-2`, `py-3 px-6`, `mb-2/4/6/8`, `mt-4/6/8`, `gap-4`, `gap-6`, `space-x-4`, `space-x-6`. Standard 4-px increments — no custom scale.

### Grid / flex
- Single-column → 2-column form grid: `grid grid-cols-2 gap-x-6 gap-y-4` (`src/components/AddClientModal.jsx:138`, `src/components/AddMemberModal.jsx:196`).
- Stat-card row: `grid grid-cols-1 md:grid-cols-3 gap-6` (`src/pages/ChartsPage.jsx:307`).
- Chart row: `grid grid-cols-1 md:grid-cols-2 gap-6` (`src/pages/ChartsPage.jsx:411,455`).
- Dashboard layout: flex sidebar + main (`src/pages/DashboardPage.jsx:18-65`). Sidebar width animates `w-16 ↔ w-64`.

### Border radius (Tailwind defaults; no custom radii)
| Class | Used for |
| --- | --- |
| `rounded` (0.25rem) | most buttons, inputs |
| `rounded-md` | `AddEmployeesPage` form inputs (`src/pages/AddEmployeesPage.jsx:125,138,151,…`) — inconsistent with `rounded` elsewhere |
| `rounded-lg` (0.5rem) | content cards, modals, page-shell card |
| `rounded-xl` (0.75rem) | `src/pages/WelcomePage.jsx:29` (welcome panel) |
| `rounded-full` | floating CTA (`src/pages/WelcomePage.jsx:46`, `src/components/RegisterButton.jsx:7`), status pills, avatar placeholders |
| `rounded-0.5` | the underline beneath active tabs (`src/pages/ClientsPage.jsx:119` — `h-0.5`) |

No sharp / hard corners anywhere. Pill (`rounded-full`) is reserved for chips, avatars, and floating action buttons.

### Shadows
`shadow`, `shadow-md`, `shadow-lg`, `shadow-xl` only — no custom shadow tokens. Page shell uses `shadow-lg`; floating CTA uses `shadow-lg`; modals use `shadow-lg`; the welcome card uses `shadow-xl`.

---

## 5. Component patterns

### Buttons
**Primary (emerald):**
```jsx
<button className="font-jaro bg-[#0bae90] text-white px-4 py-2 rounded shadow hover:bg-emerald-300">
  Nuevo Cliente
</button>
```
`src/pages/ClientsPage.jsx:140`, repeated in `MembershipsPage.jsx:91`, `EmployeesPage.jsx:159`, `MachinesPage.jsx:91`, `ChartsPage.jsx:354,449,485,519`, `AddClientModal.jsx:188`, `AddMemberModal.jsx:240`, `EmployeeEdit.jsx:160`, `EmployeeInfo.jsx:117`, `EmployeeShift.jsx:127`, `AddShiftModal.jsx:90`, `ClientsDetailModal.jsx:142,207`, `EdtiClient.jsx:123`. Hover color drifts — sometimes `hover:bg-emerald-300` (lighter), sometimes `hover:bg-emerald-400` (`ClientsDetailModal.jsx:125`).

**Floating-action variant (pill):**
```jsx
<button className="font-jaro fixed bottom-4 right-4 bg-[#0bae90] text-white p-4 rounded-full shadow-lg hover:bg-emerald-300">
  + Register
</button>
```
`src/components/RegisterButton.jsx:6-11`. (English label — see §9.)

**Secondary / cancel (gray):**
```jsx
<button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancelar</button>
```
`src/components/AddClientModal.jsx:181`, `AddMemberModal.jsx:233`. Alternates: `bg-gray-300 text-black hover:bg-gray-200` (`src/components/DeleteClient.jsx:43`).

**Destructive (red):**
```jsx
<button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400">Sí, eliminar</button>
```
`src/components/DeleteClient.jsx:35-39`. Also used by Sidebar logout (`src/components/Sidebar.jsx:42`).

**Outlier — blue primary** (only place in the app): `src/pages/AddEmployeesPage.jsx:284` uses `bg-blue-500 hover:bg-blue-600` for "Registrar Empleado" — almost certainly an oversight, not a deliberate variant.

**Purple register-modal submit:** `bg-[#834f9b] hover:bg-[#d9bddc]` (`src/components/RegisterModal.jsx:89`) — one-off.

**Ghost / icon-only:** `<button className="mr-2 hover:text-gray-400"><i class="fa-solid fa-circle-info"></i></button>` (`src/pages/ClientsPage.jsx:175-180`). No outlined ghost-text variant; ghost == icon-only.

### Form inputs
```jsx
<input className="block w-full p-3 border border-gray-300 rounded-lg text-lg" />
```
`src/components/Login.jsx:65` (sized) — but in tables/pages a smaller variant:
```jsx
<input className="font-jaro bg-gray-200 border rounded px-4 py-2 w-1/3" placeholder="Buscar..." />
```
`src/pages/ClientsPage.jsx:131-137`. **Two inconsistent input shapes coexist.** `AddEmployeesPage` uses a third: `w-full px-4 py-2 border rounded-md` with conditional `border-red-500` for error state (`src/pages/AddEmployeesPage.jsx:125`). No focus ring/style is defined for most inputs (one exception: `focus:outline-none focus:ring-2 focus:ring-[#3b3b41]` on the dashboard search, `src/pages/DashboardPage.jsx:49`).

**Select** — same as input: `<select className="w-full border rounded px-3 py-2">` (`src/components/AddClientModal.jsx:149`).

**Error state**: red bordered card above the form rather than per-field message in the modals (`src/components/AddClientModal.jsx:132`, `AddMemberModal.jsx:190`). `AddEmployeesPage` is the exception — inline `<p className="text-red-500 text-sm">{errors.ci}</p>` per field.

### Cards / panels
Page shell card: see §4. Inner data card: `<div className="bg-white shadow-md rounded-lg p-4">` (`src/pages/ClientsPage.jsx:147`, `EmployeesPage.jsx:168`, `MachinesPage.jsx:97`). Welcome card: `bg-gray-100 p-8 rounded-xl shadow-lg` (`src/pages/WelcomePage.jsx:29`). Login card: `w-[40vw] bg-[#d9bddc] p-12 rounded-lg shadow-xl` (`src/components/Login.jsx:56`).

### Modals / dialogs
Every modal follows this pattern (`src/components/AddClientModal.jsx:122-128`, `AddMemberModal.jsx:180-186`, `RegisterModal.jsx:42-49`, `ClientsDetailModal.jsx:95-101`, `DeleteClient.jsx:24-25`):
```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
  <div className="bg-white p-8 rounded shadow-lg w-[800px] max-h-[90vh] overflow-y-auto"
       onClick={(e) => e.stopPropagation()}>
    <h2 className="text-2xl font-bold mb-6">Añadir Cliente</h2>
    {/* form */}
  </div>
</div>
```
- Click-outside-to-close via the scrim onClick.
- Fixed width `w-[800px]` (not responsive — breaks below 800px viewport).
- Close button is the FontAwesome `fa-rectangle-xmark` icon, top-right, only in `RegisterModal.jsx:56`. Other modals rely on the scrim, the explicit Cancel button, or both.
- `DeleteClient.jsx:24` uses `bg-gray-900 bg-opacity-50` instead of `bg-black bg-opacity-50` — minor scrim inconsistency.

### Tables
Plain HTML table, no library:
```jsx
<table className="w-full text-left border-collapse">
  <thead><tr><th className="border-b p-2">CI</th>...</tr></thead>
  <tbody>{rows.map(r => (
    <tr key={r.id} className="hover:bg-gray-50">
      <td className="p-2 border-b">{r.value}</td>
    </tr>
  ))}</tbody>
</table>
```
`src/pages/ClientsPage.jsx:149-200`. Fixed-height scroll region `h-[400px] overflow-y-auto` wraps each table. Pagination is a row of bare buttons at the bottom right — active button uses emerald `bg-[#0bae90] text-white`, inactive `bg-gray-200 text-gray-700` (`src/pages/ClientsPage.jsx:208-219`).

### Toasts / alerts / notifications
**No toast library, no global alert system.** Each component renders inline `<p className="text-red-500 mb-4">{error}</p>` or `<p className="text-green-500 mb-4">{success}</p>` near the form. Some places fall back to native `alert()` (`src/components/ClientsDetailModal.jsx:63,67,88`, `src/pages/ChartsPage.jsx:129,141,179`). No snackbars, no animated toasts.

### Loading states
**Plain Spanish text only.** "Cargando datos..." (`src/pages/ChartsPage.jsx:302,360,492`), "Cargando datos del cliente..." (`src/components/ClientsDetailModal.jsx:71`). No spinners, no skeletons, no shimmer placeholders. There is no shared `<Spinner />` or `<Skeleton />` component.

### Signature visual patterns
1. **Active-tab purple underline.** Each list page has a 3-tab row whose active tab uses `text-[#834f9b] font-semibold`, with an animated underline `bg-[#834f9b] h-0.5` whose `transform: translateX(...)` slides to the active index (`src/pages/ClientsPage.jsx:101-127`, `EmployeesPage.jsx:118-147`, `MachinesPage.jsx:54-80`). Hardcoded width per page (`150px` for 3 tabs in clients/employees, `170px` for machines).
2. **Sidebar link with fading dark gradient underline:**
   ```
   after:block after:h-1 after:w-full after:bg-gradient-to-r after:from-[#3b3b41] after:to-transparent
   ```
   (`src/components/Sidebar.jsx:14,20,26,32`). One of the very few gradients in the app, and the only visual flourish on a nav item.
3. **Breadcrumb pattern**: `<span>Tablero</span> &gt; <span>Clientes</span>` in `font-jaro text-md text-black` — used on every authenticated list page (`src/pages/ClientsPage.jsx:95-97`, `MembershipsPage.jsx:78-80`, `EmployeesPage.jsx:112-114`, `MachinesPage.jsx:48-50`). Static text, not interactive.
4. **Floating "+ Register" pill** bottom-right of dashboard (`src/components/RegisterButton.jsx`).
5. **Lavender header bar** (`bg-[#d9bddc]`) above the table on the Dashboard, with a center-positioned "Control de asistencias" title in `text-4xl font-jaro` (`src/pages/DashboardPage.jsx:37-51`).

---

## 6. Iconography & imagery

### Icons
- **Font Awesome 6.7.1 Free**, loaded from cdnjs via `<link>` in `index.html:12-14`. Used everywhere as `<i className="fa-solid fa-…"></i>`:
  - `fa-bars` (sidebar toggle, `DashboardPage.jsx:29`)
  - `fa-eye` / `fa-eye-slash` (password show/hide, `Login.jsx:96-99`)
  - `fa-circle-info` (row "details" action, `ClientsPage.jsx:179`, `MembershipsPage.jsx:147`, `EmployeesPage.jsx:209`)
  - `fa-pen-to-square` (row "edit" action, `ClientsPage.jsx:185`)
  - `fa-trash-can` (row "delete" action, `ClientsPage.jsx:192`)
  - `fa-rectangle-xmark` (modal close, `RegisterModal.jsx:56`)
  - `fa-calendar-days`, `fa-calendar-plus` (regular variants, `EmployeesPage.jsx:214,218`)
- **Single inline SVG**: `src/assets/dumbbell-icon.svg` (Font Awesome Free 6.7.2 dumbbell glyph). Used as the favicon via `<link rel="icon" type="image/svg+xml" href="/src/assets/dumbbell-icon.svg" />` (`index.html:6`). Note: this points to a Vite dev path; it'll work in dev but is fragile in production — the canonical place would be `public/`.
- No lucide, heroicons, phosphor, react-icons, or custom icon set.

### Logos
Two raster files in `src/assets/` (no SVG version, no light/dark/lockup variants):

| File | Size | Description |
| --- | --- | --- |
| `src/assets/smashLogo1.png` | 2.3 KB, small | "SMASH FITNESS CENTER" wordmark — white "SMAS" + purple stylized "H" rendered as a dumbbell, on a dark charcoal (#3b3b41-ish) background. |
| `src/assets/logo2.jpg` | 30 KB, larger | Same artwork at higher resolution, used in `WelcomePage.jsx:33-36` displayed inside `<img className="bg-gray-200 border-2 border-dashed rounded-xl w-45 h-40 mr-4" />`. The dashed border + gray placeholder background suggests the image was originally a placeholder that nobody swapped out — the logo is visible *through* a placeholder frame. **Flag for fix.** |
| `src/assets/react.svg` | 4 KB | Default Vite/React starter SVG. Unused — `Grep` finds no import. Safe to delete. |
| `public/vite.svg` | 1.5 KB | Default Vite starter logo. Unused (never referenced). Safe to delete. |

`src/components/Logo.jsx` exists as a file but is **empty** (1 line, no content) — not a real component. The actual logo rendering is the inline `<img src={logo} />` in `WelcomePage.jsx:33`. There is no header logo on authenticated pages.

**Missing variants** the new public site will probably need but doesn't exist here: SVG/vector form, transparent-background PNG, icon-only mark (just the dumbbell H), monochrome white-on-dark, monochrome dark-on-light, and a horizontal lockup with tagline.

### Imagery style
- **No photography in the app.** No marketing images, no member portraits, no gym-equipment shots — the only images are the logo + member ID-card photos uploaded via the staff webcam capture (`src/components/ClientsDetailModal.jsx`, served as binary blobs from the backend).
- **No illustrations.** No SVG illustrations, no abstract shapes, no decorative elements.
- The visual identity is carried by color, the Jaro typography, and the logo alone.

### Placeholders to flag
- `src/pages/WelcomePage.jsx:33-36` — the logo is rendered inside a `border-2 border-dashed rounded-xl bg-gray-200` frame, which is the canonical "image not loaded yet" treatment. The image actually does load — the frame is leftover styling that should be removed.
- `MachinesPage.jsx` is entirely **hardcoded mock data** (`src/pages/MachinesPage.jsx:3-25`: "Treadmill 3000", "Leg Press Pro", "Elliptical X200"). Don't reuse these names for marketing copy.

---

## 7. Tone & vibe

**Lavender-led, friendly, casual — not gym-bro.** The dominant palette is purple `#834f9b` and its pastel lavender `#d9bddc`, paired with a teal-green CTA (`#0bae90`) and white surfaces. There are no muscle-pump red/black, no neon-yellow accents, no carbon-fiber textures, no aggressive italics — instead, rounded corners (`rounded-lg`), a chunky-rounded display font (Jaro) used at all sizes, and a welcome screen that literally says "¡Bienvenido!" in giant type. The overall feel is **boutique / studio / community fitness**, slightly homemade-looking (inconsistent button styles, inline classes, mock data) — closer to a yoga or pilates studio than a hardcore strength gym. The one piece of branding that pushes back is the logo's dark charcoal background, which the staff app uses only as small accents (sidebar text, sidebar gradient underline) — the logo is darker and more confident than the UI it's embedded in.

---

## 8. Asset inventory

All paths absolute under `C:\Users\ASUS\Documents\Tesis\SmashPlataforma\smash-gym\`.

### Logos
- `src/assets/smashLogo1.png` — wordmark, low-res (~640px wide guess), dark background baked in.
- `src/assets/logo2.jpg` — wordmark, higher-res (~1100px wide), same dark background.

### Icon / favicon
- `src/assets/dumbbell-icon.svg` — single dumbbell glyph from Font Awesome 6.7.2 (CC-BY-licensed, attribution comment preserved at the top of the file). Used as page favicon via `index.html:6`.
- `public/vite.svg` — Vite default, unused.

### Self-hosted fonts
**None.** Jaro loads from `fonts.googleapis.com` (`index.html:11`).

### Other brand assets
**None.** No PDFs, no one-pagers, no SVG illustrations, no photography. The repo has **no `favicon.ico`** (only the SVG dev-path icon mentioned above), no `apple-touch-icon`, no `manifest.json`, no Open Graph image, no `robots.txt`, no `sitemap.xml`.

### Mock content to discard
- `src/pages/MachinesPage.jsx:3-25` — machine list mock data.
- `src/assets/react.svg`, `public/vite.svg` — Vite/React boilerplate.

---

## 9. Spanish vs English in the existing UI

The user-facing UI is **almost entirely Spanish**, with a handful of English leakages. Code identifiers (variable names, comments, function names) are mostly English, but those don't reach the user.

### Spanish (the default)
- Page titles: "¡Bienvenido!", "¡Ingresa tus credenciales!", "Control de asistencias", "Detalles del Cliente", "Añadir Cliente", "Añadir Membresía", "Añadir Nuevo Empleado", "Registro de asistencia", "Panel de Control", "Reporte por Cliente", etc.
- Nav: "Clientes", "Membresías", "Personal", "Reportes", "Cerrar Sesión".
- Buttons: "Ingresar", "Guardar", "Cancelar", "Eliminar", "Buscar...", "Nuevo Cliente", "Añadir Membresía", "Añadir Personal", "Añadir Máquina", "Tomar Foto", "Capturar y Subir", "Utilizar", "Registrar", "Mostrar", "Esconder", "Generar Reporte", "Generar Reporte en Excel", "Buscar Cliente", "Sí, eliminar".
- Form labels: "Carnet de Identidad", "Nombre", "Apellido", "Correo Electrónico (opcional)", "Celular", "Fecha de Nacimiento", "Género" (Masculino / Femenino / Otro), "Contacto de Emergencia", "Teléfono de Emergencia", "Fecha de Contratación", "Tipo de Plan" (Mensual / Bi Mensual / Trimestral / Semestral / Anual / Sesiones), "Método de Pago" (Efectivo / QR / Tarjeta), "Costo (Bs)", "Descuento (Bs)", "Descripción del Descuento", "Inscrito Por (Carnet)", "Entradas (opcional)", "Contraseña", "Rol" (Administrador / Usuario).
- Table headers: "CI", "Nombre", "Apellido", "Estado", "Añadido en", "Acciones", "ID", "CI Cliente", "Fecha Inicio", "Fecha Fin", "Monto Pagado", "Descuento", "Método de Pago", "Inscrito por", "Carnet", "Rol", "Fecha de empleo", "Estatus", "Cliente", "Hora de registro", "Método de registro".
- Status values: "activo", "inactivo", "masculino", "femenino", "otro", "efectivo", "qr", "tarjeta" — lowercase Spanish, stored as-is in the DB.
- Time-range filters: "Hoy", "Esta Semana", "Este Mes", "Este Año".
- Error messages: "Error al iniciar sesión. Intenta nuevamente.", "Ocurrió un error inesperado. Inténtalo de nuevo.", "El CI es requerido.", "La contraseña debe tener al menos 8 caracteres." [sic — code checks >= 6].
- Loading: "Cargando datos...", "No hay asistencias registradas hoy.", "No hay membresías registradas.", "No hay datos disponibles para este rango de fechas.", "Sin foto".

### English leakages (treat as bugs in the new site)
- `src/components/RegisterButton.jsx:10` — **"+ Register"** label on the dashboard floating action button. Should be "+ Registrar".
- `src/pages/MachinesPage.jsx:3-25` — machine names ("Treadmill 3000", "Leg Press Pro", "Elliptical X200") are English. Mock data, ignorable, but flag it.
- `src/pages/MachinesPage.jsx:119-125` — status values rendered raw: "active", "maintenance", "inactive" (English) instead of the Spanish "activo" / "mantenimiento" / "inactivo".
- `src/pages/ChartsPage.jsx:56,99,153` — error messages set to "Error fetching membership data.", "Error fetching data for the custom date range.", "Failed to fetch client data" (English) — these end up displayed to users.
- Headings in code comments like "Photo Section", "Client Info Section" are code-only.

### Canonical Spanish domain vocabulary (use these in the new site)
| Concept | Canonical term | Where the staff app uses it |
| --- | --- | --- |
| National ID number | **carnet de identidad** (CI) | every form + table |
| Member / customer | **cliente** (plural **clientes**) | nav "Clientes", table headers, route `/clients` |
| Membership / subscription | **membresía** (plural **membresías**); the model is "subscripción" in the DB | "Añadir Membresía", "Membresías Vencidas", "Nuevas Membresías" |
| Attendance / check-in | **asistencia** (plural **asistencias**) | "Asistencias del día", "Control de asistencias", "Registro de asistencia" |
| Staff / employee | **personal** (collective), **empleado** (individual) | nav "Personal", "Añadir Nuevo Empleado" |
| Work shift | **turno** / **turno de trabajo** | `AddShiftModal`, `EmployeeShift` (backend `turno_trabajo`) |
| Plan tiers | **Mensual / Bi Mensual / Trimestral / Semestral / Anual / Sesiones** | `AddMemberModal.jsx:29-36` |
| Payment method | **Efectivo / QR / Tarjeta** | `AddMemberModal.jsx:77-81` |
| Money | **Bs** (Bolivianos) — local currency | "Costo (Bs)", "Descuento (Bs)" |
| Status active/inactive | **activo / inactivo** | client + employee tables |
| Try-out day | **día de prueba** | `ClientsDetailModal.jsx:204-211` |
| Discount | **descuento** | membership form |
| Enrolled by / signed up by | **inscrito por** | membership table column |
| Dashboard / overview | **Panel de Control**, **Tablero** | breadcrumbs say "Tablero", charts page header says "Panel de Control" — inconsistent, pick one |
| Report | **reporte** | "Generar Reporte", "Reportes" |
| Emergency contact | **contacto de emergencia**, **persona de emergencia** | client + employee forms |

---

## 10. Recommendations for the new public site

### Keep verbatim
- **Brand primary** `#834f9b` (Smash purple) and its pastel `#d9bddc`. These are the gym's identity — every staff-user sees them daily.
- **Accent CTA** `#0bae90` (emerald). This is what the staff have been trained to read as "click here to commit." Use it for the main hero CTA(s) so when a member or lead becomes a staff user later, the affordance is already familiar. (One caveat: the staff app's `hover:bg-emerald-300` is very low-contrast — pick a darker hover for the public site.)
- **Logo file** `src/assets/logo2.jpg` is the highest-res version, but ask for an SVG / transparent PNG before launch (see "what's missing").
- **Jaro** as the **display / heading font**. It's distinctive and already carries the brand.
- **Spanish** as the only language. Stick to the canonical vocabulary in §9.
- Domain terms: "carnet de identidad" (CI), "cliente", "membresía", "asistencia", "personal", "Bs" — the new site's contact form, FAQ, plan names should all reuse these so the brand voice stays continuous.

### Evolve
- **Don't use Jaro for body copy.** It's a display face — using it on table rows and form labels (as the staff app does) makes things harder to read and slightly cramped. Pair Jaro for headings with a clean neutral body face — **Inter**, **Manrope**, or **Outfit** all sit well next to Jaro's chunky geometry. Body weight 400, headings in Jaro at 400 / 700.
- **Promote brand colors to Tailwind theme tokens.** The staff app's `bg-[#834f9b]` arbitrary values everywhere are a smell — in the new repo, define `theme.extend.colors.brand` (e.g., `brand.purple`, `brand.purpleLight`, `brand.emerald`, `brand.charcoal`) so a future palette tweak is one line, not 30. Suggested mapping:
  ```js
  colors: {
    brand: {
      purple:      "#834f9b",  // primary
      purpleLight: "#d9bddc",  // secondary surface
      emerald:     "#0bae90",  // CTA
      emeraldDark: "#089b80",  // CTA hover (the staff app's hover is too pale)
      charcoal:    "#3b3b41",  // logo bg, dark text
    },
  },
  ```
- **Rethink the surface logic.** The staff app uses `bg-gray-100` page bg → `bg-[#d9bddc]` lavender card → `bg-white` inner card. On a marketing page that becomes too busy — consider a `bg-white` (or `bg-[#fafafa]`) hero with the purple as section dividers / CTA backgrounds.
- **Replace the dense data-table aesthetic.** The staff UI is built around dense `text-base` tables with `p-2` cells — fine for staff scanning 100 clients, cold on a landing page. Marketing pages need generous spacing (`py-20`/`py-24` for sections), large hero headings (`text-5xl` to `text-7xl`), and content max-widths around `max-w-3xl` for prose.
- **Replace the dashed-border logo frame** in `WelcomePage.jsx:33-36`. It's a placeholder-styling leftover.
- **Replace Font Awesome with Lucide** (or Heroicons). Font Awesome via CDN forces a runtime stylesheet load and a 70+ KB font payload that Next.js can't tree-shake. Lucide is component-per-icon, tree-shaken, and matches the rounded-friendly feel of the brand.
- **Fix the English leakages** (§9) — don't carry "+ Register" forward.

### What's missing for a marketing site (not in the staff repo at all)
- **Vector logo (SVG)** — request one from the brand owner; what's there is two JPG/PNG raster files only.
- **Logo variants**: white-on-transparent, dark-on-transparent, icon-only mark (just the dumbbell H), wordmark-only, horizontal lockup with tagline.
- **Hero photography** — real photos of the gym interior, equipment, classes in action, member portraits (with releases). The staff app has none.
- **Brand illustrations / decorative shapes** for empty states and section dividers.
- **Favicon set** — `favicon.ico`, 16/32/180px PNGs, `apple-touch-icon`, `safari-pinned-tab.svg`.
- **Open Graph / Twitter Card image** (1200×630) — needed for social sharing.
- **Web manifest** (`manifest.json`) and PWA icons if the member portal ever becomes installable.
- **Plan / pricing copy** — the staff app uses raw enum values ("Mensual", "Bi Mensual", "Trimestral", "Semestral", "Anual", "Sesiones") but has no marketing-ready descriptions of what each plan includes.
- **Tone of voice doc** — the staff Spanish is functional/transactional ("Cargando datos...", "Ocurrió un error inesperado"); marketing voice needs to be warmer.
- **Footer / contact info / address / social links / hours** — none of this exists in the staff app.
- **Legal pages** — privacy policy, terms of service. Not present.
- **A real `<Logo />` component.** `src/components/Logo.jsx` is empty. Build one in the new repo from day one (sized variants, dark-on-light + light-on-dark).

### Domain vocabulary the new site should reuse (re-stated for handoff)
"Smash" / "Smash Gym" / "Smash Fitness Center" (logo wordmark). Member-facing nouns: **cliente, membresía, asistencia, carnet de identidad (CI), Bs (Bolivianos), día de prueba**. Plan names verbatim: **Mensual, Bi Mensual, Trimestral, Semestral, Anual, Sesiones**. Payment methods verbatim: **Efectivo, QR, Tarjeta**.

---

## Executive summary

Smash Gym's existing visual identity is a **boutique-fitness brand built on a single purple** (`#834f9b`) and its pastel lavender (`#d9bddc`), with a teal-green CTA color (`#0bae90`) and a chunky display typeface (Jaro from Google Fonts) used for nearly every text element. The implementation is a React 18 + Vite SPA styled with Tailwind 3 utility classes inline, no UI library, no theme tokens, no dark mode, no component primitives beyond hand-rolled modals/tables — brand colors are typed as arbitrary `[#hex]` values in dozens of files, which means the design system is real (the same six colors recur everywhere) but unsystematized. The logo is a wordmark "SMASH FITNESS CENTER" with the H drawn as a purple dumbbell on a charcoal `#3b3b41` background, available only as raster (PNG + JPG, no SVG, no light/dark variants). The Spanish-only UI uses a consistent domain vocabulary (cliente, membresía, asistencia, carnet de identidad, Bs) that the new public site should inherit verbatim. The vibe is friendlier and softer than typical gym branding — lavender and rounded corners, not black-and-neon — which gives the new public site freedom to be warm and inviting rather than aggressive.

### Single most important inheritance
- **Color**: `#834f9b` (Smash purple) — every staff user sees it on every page; it *is* the brand.
- **Font**: **Jaro** (Google Fonts, weights are opsz-controlled, `family=Jaro:opsz@6..72`). Use for headings only; pair with a neutral body face like Inter.

### Three questions to answer before visual work begins on the new repo
1. **Logo: do we have or can we commission an SVG with proper variants?** The two raster files (`smashLogo1.png`, `logo2.jpg`) both have the dark charcoal background baked in. For a marketing site you'll need: vector SVG, transparent-background versions for light *and* dark surfaces, an icon-only mark (just the dumbbell-H), and ideally a horizontal lockup with a tagline. Without these, the public site will either look amateur (the JPG on a colored hero) or require you to recreate the logo by tracing.
2. **Tagline / positioning: what is Smash Gym selling?** The audit can't tell from the staff UI alone — there are no marketing words anywhere. Is this a boutique studio (small classes, community)? A 24-hour access gym? A personal-training–led gym? Strength-focused? Mixed cardio + classes? The lavender palette suggests "approachable / boutique," but you need to confirm what the gym actually offers because that determines hero copy, plan cards, photo direction, and footer content.
3. **Brand direction: lean into the existing softer / boutique identity, or evolve toward a more conventional energetic-gym vibe?** The current colors (purple + lavender + emerald) are unusual for the fitness category — that's a differentiator, but it might not be what the owner wants for new-member acquisition. If we keep it as-is, the new site can feel like a friendly studio (which the existing staff app supports). If we want bolder gym energy (charcoal-dominant with the purple as accent — closer to the actual logo treatment), we should know now so type sizing, photo direction, and CTA contrast can all be chosen accordingly.
