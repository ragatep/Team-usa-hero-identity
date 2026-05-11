# Devpost Submission Summary: Team USA: Hero Identity

Copy the sections below into your Devpost submission draft.

## Tagline
Which Team USA sport fits your build? Hero Identity uses Google AI and 120 years of history to match your stats to athlete archetypes. Discover your Olympic or Paralympic profile for LA28!

## Inspiration
*Digital Mirror* was born from an idea to bridge the gap between high-performance athletics and the immersive world of gaming. I wanted to see if the "physical DNA" of Olympic and Paralympic disciplines, height, weight, career stats, could be translated into the language of MMO archetypes. What if a Wrestler wasn't just an athlete, but a frontline "Tank"? What if a Sprinter was a high-speed "DPS" operative?

## What it does
Digital Mirror is an interactive trading card experience that:
- **Archetypes Athletes**: Categorizes disciplines into 5 core MMO roles (Tank, Burst DPS, DoT DPS, Support, Controller).
- **Generates Lore**: Uses Gemini to synthesize tactical character backgrounds based on real-world athletic data.
- **Visualizes Heroes**: Features 20 high-fidelity "industrial-punk" portraits generated via Imagen 4.0 Pro/Ultra.
- **Biometric Sync**: Allows users to input their own stats to see how they "stack up" against the greats using real-time delta math.

## How I built it
- **BigQuery**: For processing 120 years of anonymized Olympic/Paralympic data.
- **Vertex AI (Gemini 2.0 Flash)**: For the "Lore Engine" and Archetype Mapping.
- **Vertex AI (Imagen 4.0 Pro/Ultra)**: For the high-fidelity vector-comic art pipeline.
- **Next.js & React**: For a responsive, 3D card-flip user interface.

## Challenges I ran into
Balancing Olympic and Paralympic parity across all rarity tiers was a priority. I developed a custom sorting logic using AntiGravity to ensure that Paralympic disciplines received equal representation in the Legendary and Epic tiers, showcasing that excellence is universal regardless of the discipline.

## Accomplishments that I am proud of
I successfully created a 100% anonymous, data-driven experience that respects athlete privacy while creating a deep, engaging narrative. The seamless integration of "Diff Math" for biometric comparison provides a tangible connection between the user and the hero-archetypes.

## What I learned
The intersection of generative AI and structured data is incredibly powerful for storytelling. I learned how to tune Imagen prompts to maintain a consistent "grit-and-neon" aesthetic across a diverse set of sports.

## What's next for Digital Mirror
I envision expanding the roster to include more niche disciplines and integrating a "Squad Builder" feature where users can assemble their own team of hero-operatives based on their synced biometric profiles.

---

## Built With
- BigQuery
- Google Cloud
- Imagen 4.0 Pro/Ultra
- Gemini 2.0 Flash
- Next.js
- Tailwind CSS
- TypeScript
- Vertex AI
- AntiGravity
