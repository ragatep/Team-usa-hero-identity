# Digital Mirror: TCG Evolution Implementation Plan

## 1. Core Concept
Transitioning the "Digital Mirror" project into a Massively Multiplayer Online (MMO) inspired Trading Card Game (TCG). The aesthetic retains the high-contrast, industrial-punk, and vector-comic style, but the data architecture and card layouts are now driven by strict MMO archetypes and real-world medal rarities based on the Team USA dataset.

## 2. MMO Archetype Categorization
Athletes are categorized into five distinct job roles based on the nature of their Olympic/Paralympic sport:

*   **The Tank (Defense & Control):** High durability and positioning. Includes Weightlifting, Judo, Wrestling, Rugby. 
    *   Main Color: Deep Crimson
    *   Icon: Shield
    *   Letter: T
*   **The DPS (Damage Dealers - Burst):** Speed and high impact. Includes Sprints, Gymnastics, Fencing. 
    *   Main Color: Electric Blue
    *   Icon: Swords
    *   Letter: D
*   **The DPS (DoT - Damage over Time):** Endurance and sustained output. Includes Marathon, Triathlon, Rowing, Swimming. 
    *   Main Color: Aqua Blue
    *   Icon: Lightning
    *   Letter: D
*   **The Support (Utility & Buffs):** Team synergy. Includes Basketball, Volleyball. 
    *   Main Color: Jade Green
    *   Icon: Plus
    *   Letter: S
*   **The Controller (Precision & Strategy):** Strategy and precision. Includes Archery, Shooting. 
    *   Main Color: Neon Purple
    *   Icon: Target
    *   Letter: C

## 3. Rarity Tier System (Option B Logic)
Rarity is determined dynamically based on the athlete's total gold medal count (real-world data):

*   **Legendary:** Multiple Golds. Card Overlay Accent: **Pastel Gold**.
*   **Epic:** Single Gold. Card Overlay Accent: **Pastel Purple**.
*   **Rare:** Silver or Bronze. Card Overlay Accent: **Pastel Blue**.
*   **Common:** Participant (No medal). Card Overlay Accent: **Pastel Green**. *(Note: Non-elite common cards will utilize Team USA uniform colorways for accents).*

## 4. UI/UX & Card Layout (Cyberpunk TCG Aesthetic)
*   **Proportions:** 2.5:3.7 (Standard TCG playing card aspect ratio).
*   **Card Frame:** Black outer trim with slightly rounded corners and a subtle light platinum-gray circuit-board trace design.
*   **Background:** Clean, dark gradient field using the Main Archetype Color.
*   **Overlays:** All key icons, text labels, UI elements, and the glowing numerical stat value feature a consistent metallic overlay accent corresponding to the **Rarity Tier Color**.
*   **Athlete Illustration:** 2D flat-color illustration (vector-comic abstract). Industrial-punk gear (desaturated slate navy/olive drab palettes) with high-visibility piping matching the Archetype color. Paralympians feature functional cybernetic/medical devices (e.g., pneumatic limbs, sensory visors) integrating directly into the character structure. No text or logos on clothing.
*   **Ability Description:** Lower third features a bold red tag for the ability name, followed by descriptive text detailing how the archetype uses the ability to affect the match.

## 5. Next Steps / Action Items
1.  **Asset Generation:** Complete the generation of the visual assets for the Epic, Rare, and Common sets using the provided Build Lists.
2.  **Dataset Patch:** Update the BigQuery dataset SQL to correctly map Paralympic medals (currently importing as `NA` from the raw CSV, causing all Paralympians to default to the Common tier).
3.  **Frontend Implementation:** Implement the React frontend `HeroCard.tsx` component to dynamically read the CSV dataset and render the appropriate background gradients, SVG icons, and rarity colored overlays.
