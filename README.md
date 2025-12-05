# 📦 Hayden Blocks

Custom Gutenberg blocks designed for the **Hayden Sage Starter** theme.  
Includes a reusable **typography system**, globally shared styles, and modular block architecture for rapid block development.

---

## 🚀 Features

- **Hero – Primary Block**
  - Heading, eyebrow, body text, and CTA button
  - Tailwind-mapped typography controls
  - Supports global Customizer typography as defaults
  - Per-block overrides for heading + body font size
  - Fully theme-aware colours (inherits global variables)

- **Shared Typography Engine**
  - Maintains consistent sizing scales across blocks
  - Maps block controls to Tailwind scale (`text-sm`, `text-base`, `text-xl`, etc.)
  - Loaded globally for all blocks in this plugin

- **Extensible Structure**
  - Future blocks can reuse typography & design tokens
  - Block.json-driven registration
  - Clean plugin architecture ready for scaling

---

## 📁 Folder Structure

```
hayden-blocks/
│
├── blocks/
│   ├── assets/
│   │   └── typography.css        # Shared font-size utilities
│   │
│   ├── hero-primary/
│   │   ├── block.json            # Block metadata
│   │   ├── editor.js             # Block editor controls
│   │   └── style.css             # Frontend + editor styles
│   │
│   └── (more blocks coming soon)
│
├── hayden-blocks.php             # Main plugin loader
└── README.md                     # You are here
```

---

## 🛠 Installation (Development)

1. Clone into your WordPress plugins directory:

```bash
git clone https://github.com/YOURNAME/hayden-blocks.git
```

2. Activate **Hayden Blocks** in WordPress → Plugins.

3. Blocks will appear under the **Smart Blocks** inserter category.

---

## 🧩 Adding a New Block

Each new block should:

1. Create a folder under `/blocks/[block-name]`
2. Include:
   - `block.json`
   - `style.css`
   - `editor.js`
3. Import shared utilities as needed:
   - `hayden-blocks-typography` CSS automatically loads
4. Add your block registration via `block.json`

A boilerplate template will be added soon for faster development.

---

## 🔮 Roadmap

- Shared JS controls for typography & colour panels  
- Boilerplate block template (`blocks/_template/`)  
- Button component system  
- Layout presets (left/center/right align hero)  
- Reusable card, CTA, and grid blocks  

---

## 📃 License

Private — internal use only unless explicitly published.
