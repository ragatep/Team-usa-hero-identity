# DIGITAL MIRROR // TEAM USA HERO IDENTITY

> *What if the world's greatest Olympic and Paralympic athletes were reborn as cyberpunk operatives in a neon-drenched MMO?*

**Digital Mirror** is an interactive trading card experience that transforms 20 real Team USA athletes into fully realized cyberpunk hero-operatives — complete with AI-generated portraits, MMO-inspired archetypes, rarity tiers, and a personalized biometric comparison system.

Built for the **Google Cloud Hackathon 2026**, this project showcases the power of Vertex AI, BigQuery, and generative AI to reimagine Olympic heritage through the lens of gaming culture.

![Digital Mirror — Hero Grid Overview](docs/images/hero_grid_overview.png)

---

## TABLE OF CONTENTS

1. [What is Digital Mirror?](#what-is-digital-mirror)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [FAQ](#faq)
5. [Documentation](#documentation)
6. [Credits](#credits)

---

## What is Digital Mirror?

Digital Mirror bridges the gap between **Olympic athletics** and **gaming culture** by asking a simple question: *How do you stack up against the greatest athletes in history?*

Every card in the system represents a real athlete from the Olympic or Paralympic Games. Their biographical data — height, weight, age, sport, medal count — is sourced from a cleaned BigQuery dataset and used to generate:

- **Rarity Tiers** based on medal achievements (Legendary, Epic, Rare, Common)
- **MMO Archetypes** mapped from their sport discipline (Tank, DPS, Support, Controller)
- **Character Lore** and **Combat Abilities** written in the style of a cyberpunk MMO
- **AI-Generated Portraits** using Google's Imagen API with a refined industrial-punk prompt pipeline

The user can then **sync their own biometrics** (height, weight, age) to see how they compare to each hero-athlete, with real-time "Diff Math" displayed on every card.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Data Pipeline** | Google BigQuery | Cleaned and normalized Olympic/Paralympic athlete datasets |
| **AI Generation** | Vertex AI (Gemini 3.1 Pro) | Character lore, ability descriptions, archetype mapping |
| **Art Generation** | Imagen API (gemini-3.1-flash-image) | 20 high-fidelity vector-comic character portraits |
| **Frontend** | Next.js 16 + React 19 | Interactive 3D card-flip UI with expanded modal views |
| **Styling** | Tailwind CSS | Responsive 5×4 grid layout with dynamic neon glow effects |
| **State Management** | React Context API | Global biometric sync with Metric/Imperial unit toggle |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/Team-usa-hero-identity.git
cd Team-usa-hero-identity/hero-card-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## FAQ

### What is the "Re-Sync Biometrics" feature?
It's the core interactive feature of Digital Mirror. By entering your own height, weight, and age, the system compares your physical stats against each hero-athlete and displays the difference (in green or red) on every card's Bio-Sheet. It supports both **Metric** (cm/kg) and **Imperial** (ft/in/lbs) unit systems.

### How were the rarity tiers determined?
Rarity is based on real medal data from the athlete's Olympic/Paralympic career:
- **Legendary** — Multiple Gold Medals
- **Epic** — Single Gold Medal
- **Rare** — Silver or Bronze Medals
- **Common** — Participant (No Medal)

### How were the MMO archetypes assigned?
Each athlete's sport was mapped to a traditional MMO role based on the physical demands and tactical nature of their discipline. For example, Wrestlers and Judoka map to **Tank** (frontline defense), while Sprinters and Skiers map to **DPS** (burst damage). See the [Theme Guide](THEME_GUIDE.md) for the full breakdown.

### How were the portraits generated?
All 20 character portraits were generated using Google's Imagen API with a highly refined prompt pipeline. Each prompt enforced strict constraints: a single solitary athlete, stoic facial expression, industrial-punk aesthetic, sport-specific gear, and a clean solid background for perfect compositing into the card UI. See the [Theme Guide](THEME_GUIDE.md#art-direction) for details.

### Can I add my own athletes?
Yes! The system is data-driven. Simply add a new entry to `hero-card-app/src/data/hero_identities.json` following the existing schema, generate a portrait, and place it in `public/assets/heroes/`.

### What data sources were used?
The athlete dataset was sourced from publicly available Olympic and Paralympic records, cleaned and normalized via Google BigQuery, and enriched with AI-generated lore using Vertex AI (Gemini 3.1 Pro).

---

## Documentation

| Document | Description |
|----------|-------------|
| [GUIDE.md](GUIDE.md) | Reading your cards + How to use Re-Sync Biometrics |
| [THEME_GUIDE.md](THEME_GUIDE.md) | Rarity tiers, MMO archetypes, art direction, and world-building |

---

## Credits

- **Data Source**: Olympic & Paralympic athlete records via Google BigQuery
- **AI Models**: Vertex AI (Gemini 3.1 Pro) for text generation, Imagen API for portrait generation
- **Framework**: Next.js 16 with React 19
- **Project**: Google Cloud Hackathon 2026 — Project: Hero Identity
- **System Status**: Optimal ■
