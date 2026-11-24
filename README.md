# Valdris Chronicle: Last Relic (Episode I)

**Master Game Design Document (GDD) & Executive Commercial Pitch Deck** — **Dimpz Games**

> *"200 Souls. 5 Acts. One Single Iron Crown."*

An interactive Unreal Engine 5 Master Game Design Document, combat math simulator, 90-skin armory showcase, live-ops blueprint, and publisher/co-development pitch deck for **Valdris Chronicle: Last Relic (Episode I)** — a 200-warrior tactical third-person dark-medieval fantasy PvPvE Battle Royale.

---

## Core Game Pillars

- **200-Warrior 5-Act Loop (15–18 Minutes):** Fast-paced progression from coastal landfall (`Acts I–II`) and Citadel siege clashes (`Act III`) to **Black Bell** sudden death (`Act IV`, respawns locked) and the Throne Hall climax (`Act V`).
- **Two Competitive Modes:** **Oath Mode** (Duos, Trios & Quads united under shared victory & Coronation ranking: *King, Captain, Colonel, Sergeant*) and **Wanderer Mode** (Solo `1 vs 199`).
- **6 Evolving Specializations (Classless Warrior Core):** Sword Warrior (*Parry/Riposte 1.60x*), Club Warrior (*Guard Break*), Axe Warrior (*Raw Cleave*), Archer (*Dual Hand Crossbows — 1 crossbow per hand*), Wizard (*Offensive Ether Seals*), and Druid (*Squad Healing & Miasma Cleansing*).
- **Decoupled Gear Stats vs. 90 Launch Cosmetic Skins (Zero Pay-to-Win):**
  - Logical gear alters numerical stats, affixes, and synergies only; visual cosmetics live in independent Transmog Slots.
  - **Separate Weapon Mastery Track (0%–100%):** Completely isolated from *Attack Type Level* (`Sword / Club / Axe / Distance / Magic`) and *Defense Level*. Buying a weapon skin auto-maxes that weapon's separate Weapon Mastery; earning 100% Weapon Mastery organically unlocks the skin for free.
  - **Fair-Match Power Matchmaking (`MM_Index`):** Weighs General Level, Attack/Defense Levels, active Weapon Mastery %, and **Omni-Lv.100** status (`35% -> 50%` Gold loot cap), anchored by Anti-Smurf Oath squad matching.

---

## Seasonal Live-Ops: Full-Season Storm Worlds vs. Marked-Date Loot Rituals

The live-ops architecture cleanly separates **persistent seasonal world transformations** from **short, high-urgency loot windows** using modular UE5 Niagara VFX, weather shaders, and lighting presets (zero map rebuilds required):

### 1. Full-Season World & Storm Scenarios (3 Months Each)
- **Winter (`Glacial Ice Storm` — Entire Winter Season · Dec–Feb):** Lethal sub-zero blizzard, howling frost winds, freezing screen vignettes, and snow-dusted Citadel architecture.
- **Summer (`Scorching Heat Storm` — Entire Summer Season · Jun–Aug):** Blistering heatwave and ember-ash tempest with refractive heat-haze post-processing and dried-earth lighting.
- **Spring & Autumn (`Toxic Miasma Gas` — Full Seasons · Mar–May & Sep–Nov):** Signature Valdris emerald-violet creeping fog rolling out of the Miasma Marshes.

### 2. Limited-Time Holiday Loot Events (`Always-Open 24/7 Queue · 1 Attempt / 24h`)
- **Halloween — Wish or Threat (`Night of the Hollow Bell`):** **1 Week** during Halloween Week (`Oct 25 - Nov 1`). Players lock a Gold-Tier set (*Spectral Harvester Plate* / *Hollow Executioner Cloak*) and choose **WISH** (standard rules) or **THREAT** (match-wide curse for exclusive *Cursed VFX / Ether Seal* bonus; defeat locks out 24h).
- **Midwinter — Dark Santa's Wish:** **2 Weeks** across Christmas & New Year through January 7 (`Dec 24 - Jan 7`). Lock in a Gold-Tier target via the Wish UI and defeat Dark Santa for instant Social Hub showcase (24h loss cooldown).
- **Summer Solstice — Solar-Ash Reckoning:** **1 Week** at the June Summer kickoff (`Jun 21 - Jun 28`). Solar Eclipse Altars & *Sun-Baked Eclipse Sentinel* Dual-Crossbow rewards whose shaders ignite under Summer Heat Storms.
- **Same-Year Replay Bonus (`2x Match EXP` — Resets Annually):** Players who already won that specific Loot Event earlier in the **same year** earn **2x EXP** for that match across **Monsters, World Bosses, and PvP Players**. Every following year **resets event completion** and introduces **brand-new designed seasonal loot sets** so players can win the new annual cosmetics fresh.

---

## Co-Pitching & Studio Alliance Model (Phase 1 Vertical Slice)

Built as a publisher-ready commercial package that isolates a **10–15 minute Vertical Slice** instead of requiring speculative full-map Battle Royale art on Day 1:

- **Creator & Technical Lead ($0 Upfront Studio Cost):** UE5 gameplay architecture, directional melee/Parry combat, Dual Hand Crossbows, boss AI, server-authoritative scalable multiplayer foundation, deterministic combat/loot math, and full GDD & Pitch Deck.
- **Partner Art Studio (2–3 Month In-Kind Art):** Dark-medieval art direction, 1 Vertical Slice environment (*Catacombs of the Nameless King*), 2–3 modeled/animated characters & enemies (*Sword & Shield*, *Dual Hand Crossbows*, *Black Bell Executioner*), UI/UX polish, and publisher pitch trailer.
- **Studio ROI:** Securing publisher financing transitions the art partner into the **Official Commercial Production Vendor** for the **18–24 month funded roadmap**, plus negotiated **Rev-Share / IP co-ownership**.

---

## Interactive Web Application Features

- **5 Main Interactive Views:**
  1. **Master Document:** Full GDD specification, interactive Warrior progression trainer, Ether Seal browser, live UE5 combat/defense math simulator, balance tables, Seasonal Live-Ops planner (with `WISH` vs `THREAT` ritual simulator & full-season storm previewer), and Co-Pitching Alliance blueprint.
  2. **90 Launch Skins:** Complete filterable armory covering all 15 progressive sets across all 6 specializations (`#01`–`#90`).
  3. **Strategic Biomes:** Elevation, Abyssal Ash closure windows, environmental hazards, and visual breakdowns across *The Citadel of Valdris*, *The Miasma Marshes*, *Catacombs of the Nameless King*, and *The Forest of Spires*.
  4. **Bestiary:** Detailed combat behaviors, HP/Threat multipliers, counterplay, and guaranteed loot rules across 7 PvPvE threats up to the *Black Bell Executioner*.
  5. **Videos:** Dedicated showcase for live Unreal Engine 5 engine captures — featuring the **UE5 Standalone Gameplay Preview Video** (early testbed validating combat attacks, inventory loot pickups, and set data using placeholder UI/art/biome) and the Phase 1 capture roadmap.
- **Executive Pitch Deck Modal (14 Slides):** Keyboard/click presentation viewer synced with the GDD data.
- **Real-Time Client PDF Generators (`jsPDF`):**
  - `The_Last_Relic_Pitch_Deck_EN.pdf` — 16:9 widescreen executive pitch deck (Cover + 14 slides).
  - `The_Last_Relic_Main_Page_EN.pdf` — Multi-page A4 print-formatted Master GDD covering every section, table, biome, live-ops cadence, and alliance model.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion
- **Backend Server:** Node.js + Express (`server.ts` serving Vite dev middleware on port `3000` and production `dist/`)
- **PDF Engine:** `jspdf` client-side canvas image cropping & vector layout composition

---

## Local Development

### Prerequisites
- Node.js `>= 20`
- npm or bun

### Setup & Commands

```bash
# 1. Install dependencies
npm install

# 2. Optional: configure environment variables
cp .env.example .env

# 3. Start development server (Express + Vite on port 3000)
npm run dev

# 4. Type-check and build for production
npm run lint
npm run build

# 5. Run production server
npm start
```

---

## Project Structure

```text
├── index.html                  # SEO metadata, OpenGraph & font imports
├── server.ts                   # Express server + Vite dev/prod entry point (port 3000)
├── package.json                # Scripts & dependencies
└── src/
    ├── App.tsx                 # Main application shell, navigation tabs & PDF triggers
    ├── components/
    │   ├── AllSetsDesignTab.tsx        # 90 Launch Skins gallery & stat decoupling
    │   ├── BestiaryTab.tsx             # PvPvE monsters & World Boss dossier
    │   ├── BiomesAndMathSection.tsx    # UE5 Math Simulator, Balance Tables & Seasonal Live-Ops
    │   ├── BiomesTab.tsx               # Dedicated 4-biome tactical atlas
    │   ├── CoPitchingAllianceSection.tsx # Phase 1 Vertical Slice & Studio Alliance model
    │   ├── EtherSealsSection.tsx       # 8 Ether Seals & Magic Level progression
    │   ├── LootAndPveSection.tsx       # 5 Quality Tiers & 4 PvE Difficulty Tiers
    │   ├── MatchCycleSection.tsx       # 5-Act match lifecycle & Coronation scoring
    │   ├── MediaFrame.tsx              # Consistent aspect-ratio media wrapper
    │   └── PitchDeckModal.tsx          # Interactive 14-slide Executive Pitch Deck viewer
    ├── data/
    │   ├── gddData.ts                  # Canonical GDD data, formulas, slides, live-ops & alliance
    │   └── equipmentSets.ts            # Full 90-set progression definitions & art paths
    └── utils/
        ├── mainPagePdf.ts              # A4 Master GDD PDF generator
        └── pitchDeckPdf.ts             # 16:9 Executive Pitch Deck PDF generator
```

---

## Studio & Commercial Contact

- **Studio:** Dimpz Games
- **Title:** Valdris Chronicle: Last Relic (Episode I)
- **Email:** `isaacgestrada94@gmail.com`
- **Phone:** `+52 33 1835 9421`
- **Repository:** [https://github.com/Orb-lite/Game-Design-document](https://github.com/Orb-lite/Game-Design-document)
