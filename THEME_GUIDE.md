# DIGITAL MIRROR // THEME GUIDE

> *The design system, world-building framework, and art direction behind the Digital Mirror universe.*

---

## TABLE OF CONTENTS

1. [Rarity Tier System](#rarity-tier-system)
2. [MMO Archetype System](#mmo-archetype-system)
3. [Archetype-to-Sport Mapping](#archetype-to-sport-mapping)
4. [Art Direction](#art-direction)
5. [Color Palette Reference](#color-palette-reference)

---

## Rarity Tier System

Every hero card is assigned a rarity tier based on the athlete's real Olympic or Paralympic medal achievements. Rarity determines the card's border glow color, badge styling, and perceived "power level" within the collection.

| Tier | Color | Hex Code | Criteria | Glow Effect |
|------|-------|----------|----------|-------------|
| **Legendary** | Pastel Gold | `#FCD34D` | Multiple Gold Medals or exceptional career significance | Warm golden neon border with `shadow-[0_0_15px_#FCD34D88]` |
| **Epic** | Pastel Purple | `#C084FC` | Single Gold Medal | Vibrant purple neon border with `shadow-[0_0_15px_#C084FC88]` |
| **Rare** | Pastel Blue | `#93C5FD` | Silver or Bronze Medal(s) | Cool blue neon border with `shadow-[0_0_15px_#93C5FD88]` |
| **Common** | Pastel Green | `#86EFAC` | Participant / No Medal | Subtle green neon border with `shadow-[0_0_15px_#86EFAC88]` |

### Design Philosophy

The rarity system mirrors established conventions from games like *Genshin Impact*, *Hearthstone*, and *Pokémon TCG*:

- **Gold = Legendary**: Universally recognized as the highest tier across gaming culture. Maps perfectly to the Olympic Gold Medal — the pinnacle of athletic achievement.
- **Purple = Epic**: A mainstay in MMO loot systems (World of Warcraft, Destiny). Represents a single defining moment of glory.
- **Blue = Rare**: The "solid performer" tier. Athletes with Silver or Bronze medals proved their elite status even without reaching the top.
- **Green = Common**: The foundation tier. These athletes competed on the world stage — a feat that puts them in the top fraction of a percent of humanity.

> 💡 *Even a "Common" hero in Digital Mirror represented their country at the Olympic Games. There are no weak cards in this set.*

### Card Layout by Tier

In the 5×4 grid layout, cards are sorted **Legendary → Epic → Rare → Common** (top to bottom), creating a visual cascade:

| Row | Tier | Border Color |
|-----|------|-------------|
| Row 1 | Legendary | Gold glow |
| Row 2 | Epic | Purple glow |
| Row 3 | Rare | Blue glow |
| Row 4 | Common | Green glow |

---

## MMO Archetype System

Each hero-athlete is assigned one of five MMO archetypes based on the tactical demands of their sport. These archetypes define the hero's combat role, stat distribution, and ability design.

### ⚔️ Tank — Frontline Defense & Control

| Property | Value |
|----------|-------|
| **Icon** | `T` (Diamond badge) |
| **Color** | Crimson Red (`#DC2626`) |
| **Gradient** | `from-red-950/80 to-black` |
| **Primary Stats** | STRENGTH (highest), ENDURANCE |
| **Role** | Absorb damage, generate threat, lock down enemies |

**MMO Description**: The Tank is the immovable anchor of any squad. In traditional MMOs like *World of Warcraft* or *Final Fantasy XIV*, Tanks draw enemy aggro and absorb punishment so their teammates can deal damage safely. They prioritize survivability and crowd control over raw damage output.

**Team USA Mapping**: Athletes from **Wrestling**, **Judo**, and other grappling/combat sports. These athletes physically dominate their opponents through direct force, positional control, and the ability to absorb and redirect kinetic energy — exactly what a Tank does in an MMO encounter.

**Featured Heroes**:
- Kaarlo "Kalle" Anttila — *The Tungsten Vice* (Legendary, Wrestling)
- Urka Šolnir — *The Gravity Weaver* (Epic, Judo)

---

### ⚡ DPS (Burst) — Damage Dealers & Strikers

| Property | Value |
|----------|-------|
| **Icon** | `D` (Diamond badge) |
| **Color** | Electric Blue (`#2563EB`) |
| **Gradient** | `from-blue-950/80 to-black` |
| **Primary Stats** | SPEED (highest), STRENGTH |
| **Role** | Maximum single-target burst damage |

**MMO Description**: The DPS (Damage Per Second) role is the primary offensive force. In games like *Overwatch* or *League of Legends*, DPS characters eliminate high-value targets with concentrated bursts of damage. They trade survivability for lethal output.

**Team USA Mapping**: Athletes from **Speed Skating**, **Alpine Skiing**, **Field Hockey**, and **Cross Country Skiing**. These are speed-dominant sports where the athlete must deliver maximum force in a concentrated window — a sprint finish, a slalom gate, or a hockey strike.

**Featured Heroes**:
- Catriona Ann Le May Doan — *The Cryo-Velocity Phantom* (Legendary, Speed Skating)
- Phillip "Phil" Mahre — *The Frost-Edge Phantom* (Epic, Alpine Skiing)

---

### 🔥 DPS (DoT) — Damage Over Time Specialists

| Property | Value |
|----------|-------|
| **Icon** | `D` (Diamond badge) |
| **Color** | Aqua Blue (`#06B6D4`) |
| **Gradient** | `from-cyan-950/80 to-black` |
| **Primary Stats** | ENDURANCE (highest), SPEED |
| **Role** | Sustained, compounding damage that wears enemies down |

**MMO Description**: DoT (Damage over Time) specialists apply stacking debuffs that slowly drain enemy health pools. Unlike burst DPS who spike damage instantly, DoT operatives excel in prolonged engagements where their cumulative output overtakes burst damage over time. Think Warlocks in *WoW* or Poison builds in *Path of Exile*.

**Team USA Mapping**: Athletes from **Decathlon**, **Pentathlon**, **Steeplechase**, and **Rowing**. These are endurance-dominant sports where success comes from sustained effort over extended periods — multiple events, long distances, and rhythmic output that compounds over time.

**Featured Heroes**:
- Heidemarie "Heide" Rosendahl — *The Silver Pentarch* (Legendary, Pentathlon)
- Robert Změlík — *The Omni-Phase Vanguard* (Epic, Decathlon)

---

### 💚 Support — Utility, Buffs & Team Synergy

| Property | Value |
|----------|-------|
| **Icon** | `S` (Diamond badge) |
| **Color** | Jade Green (`#10B981`) |
| **Gradient** | `from-green-950/80 to-black` |
| **Primary Stats** | UTILITY (highest), PRECISION |
| **Role** | Buff allies, heal, provide tactical coordination |

**MMO Description**: Supports are the force multipliers. In games like *Overwatch* (Mercy, Ana) or *League of Legends* (Soraka, Lulu), Supports amplify their team's effectiveness through healing, shielding, and buff distribution. A great Support turns a good team into an unstoppable one.

**Team USA Mapping**: Athletes from **Volleyball**, **Sitting Volleyball**, **Basketball**, and **Lacrosse**. These are team-centric sports where the athlete's primary value comes from enabling their teammates — setting plays, distributing the ball, and creating opportunities for others to score.

**Featured Heroes**:
- Monique Burkland Matthews — *Chrome Sentinel* (Legendary, Sitting Volleyball)
- Hou Yuzhu — *The Aero-Link Vanguard* (Epic, Volleyball)

---

### 🎯 Controller — Strategy & Field Manipulation

| Property | Value |
|----------|-------|
| **Icon** | `C` (Diamond badge) |
| **Color** | Neon Purple (`#8B5CF6`) |
| **Gradient** | `from-purple-950/80 to-black` |
| **Primary Stats** | PRECISION (highest), UTILITY |
| **Role** | Dictate battlefield positioning, debuff enemies, restrict movement |

**MMO Description**: Controllers manipulate the battlefield itself. In games like *Guild Wars 2* or *Dungeons & Dragons*, Controllers use crowd control, terrain manipulation, and debuffs to dictate where enemies can go and what they can do. They don't deal the most damage — they ensure the damage lands.

**Team USA Mapping**: Athletes from **Shooting** and **Equestrianism**. These are precision-dominant sports where success depends on absolute spatial awareness, perfect timing, and the ability to control an environment (a firing lane, a course) with surgical accuracy.

**Featured Heroes**:
- Nils "Hans" von Blixen-Finecke, Jr. — *The Chrome Cavalier* (Legendary, Equestrianism)
- Bertil Vilhelm Rönnmark — *Zero-Drift Sentinel* (Epic, Shooting)

---

## Archetype-to-Sport Mapping

| Archetype | Sports | Rationale |
|-----------|--------|-----------|
| **Tank** | Wrestling, Judo | Direct physical domination, positional control, damage absorption |
| **DPS (Burst)** | Speed Skating, Alpine Skiing, Field Hockey, Cross Country Skiing | Speed-dominant, concentrated force delivery |
| **DPS (DoT)** | Decathlon, Pentathlon, Steeplechase, Rowing | Endurance-dominant, sustained multi-phase output |
| **Support** | Volleyball, Sitting Volleyball, Basketball, Lacrosse | Team-centric, playmaking, enabling teammates |
| **Controller** | Shooting, Equestrianism | Precision-dominant, environmental mastery, spatial control |

---

## Art Direction

### The "Grit-and-Neon" Aesthetic

All 20 character portraits follow a unified art direction inspired by the visual language of cyberpunk media (*Cyberpunk 2077*, *Ghost in the Shell*, *Akira*) filtered through a clean, accessible vector-comic style.

### Prompt Engineering Constraints

Every portrait was generated using Google's Imagen API with the following enforced rules:

| Constraint | Rule | Reason |
|-----------|------|--------|
| **Subject Count** | Strictly ONE single athlete | Prevents phantom opponents or teammates |
| **Facial Expression** | Neutral, calm, stoic | Avoids aggressive grimacing; fits tactical TCG tone |
| **Skin Tone** | Natural human tones only | Prevents AI color-bleeding from accent palettes |
| **Limb Count** | Explicitly "exactly two arms" | Prevents anatomical hallucinations |
| **Text/Logos** | Absolutely none | Clean compositing into the React card frame |
| **Background** | Solid white | Easy integration; gradient applied by the CSS layer |
| **Style** | 2D flat-color vector-comic, industrial-punk | Consistent across all 20 portraits |
| **Gear** | Sport-specific, futuristic | Cybernetic enhancements integrated into sport equipment |

### Tier-Specific Accent Colors in Prompts

| Tier | Accent Color Used in Prompt |
|------|---------------------------|
| Legendary | Neon Purple, Electric Blue, Aqua Blue, Jade Green, Crimson (per archetype) |
| Epic | Same archetype-based accents |
| Rare | Pastel Blue (unified) |
| Common | Pastel Green (unified) |

---

## Color Palette Reference

### Rarity Colors
```
Legendary:  #FCD34D  (Pastel Gold)
Epic:       #C084FC  (Pastel Purple)
Rare:       #93C5FD  (Pastel Blue)
Common:     #86EFAC  (Pastel Green)
```

### Archetype Colors
```
Tank:        #DC2626  (Crimson Red)
DPS (Burst): #2563EB  (Electric Blue)
DPS (DoT):   #06B6D4  (Aqua Blue)
Support:     #10B981  (Jade Green)
Controller:  #8B5CF6  (Neon Purple)
```

### UI Base Colors
```
Background:  #020202  (Near Black)
Card Base:   zinc-900 / zinc-950
Text:        white / white with opacity variants
Accent:      cyan-500 (selection highlight, footer dots)
```

---

*Verified by Vertex AI // Gemini 3.1 Pro — Hackathon 2026 // Project: Hero Identity — System Status: Optimal ■*
