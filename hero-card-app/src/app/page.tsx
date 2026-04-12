import { BioSyncProvider } from "@/context/BioSyncContext";
import { BioSyncHeader } from "@/components/BioSyncHeader";
import { HeroCard, HeroProfile } from "@/components/HeroCard";

const ELITE_SEVEN: HeroProfile[] = [
  {
    name: "Mary Theisen-Lappen",
    alias: "Iron-Atlas",
    archetype: "Titan",
    sport: "Weightlifting",
    event: "+81kg Division",
    biometrics: { height: 183, weight: 137, age: 33 },
    lore: "Biological alignment with high kinetic mass suggests a potential for immovable stability in high-impact environments.",
    ability: { name: "Titan Synthesis", description: "Optimization of core density that could lead to near-total kinetic resilience and peak torque output." }
  },
  {
    name: "Brady Ellison",
    alias: "Apex-Arrow",
    archetype: "Solo",
    sport: "Archery",
    event: "Recurve Individual",
    biometrics: { height: 180, weight: 86, age: 35 },
    lore: "Neural-focus data suggests a synergy between ocular latency and static stability for sustained precision output.",
    ability: { name: "Ocular Calibration", description: "Visual stream acceleration that could lead to perfect predictive target alignment across diverse atmospheric variables." }
  },
  {
    name: "Robert Charles Golder",
    alias: "Tidal Strategist",
    archetype: "Navigator",
    sport: "Canoeing",
    event: "K-1 1000m Sprint",
    biometrics: { height: 185, weight: 82, age: 31 },
    lore: "High mechanical leverage indices suggest an alignment with fluid-flow systems and efficient energy transfer.",
    ability: { name: "Flow Analysis", description: "Sub-neural intuition of fluid dynamics that could lead to optimized pathfinding through chaotic environments." }
  },
  {
    name: "Conner Mantz",
    alias: "Aero-Stride",
    archetype: "Scout",
    sport: "Marathon",
    event: "Athletics Endurance",
    biometrics: { height: 173, weight: 57, age: 27 },
    lore: "Biometric lean-mass ratios suggest a synergy with sustained aerobic output and high-efficiency caloric expenditure.",
    ability: { name: "System Economy", description: "Metabolic optimization that could lead to prolonged high-output mobility without systemic fatigue." }
  },
  {
    name: "Maria Luiza de Castro",
    alias: "Zenith Phantom",
    archetype: "Ghost",
    sport: "Sprinting",
    event: "100m Dash",
    biometrics: { height: 168, weight: 58, age: 24 },
    lore: "Explosive power-to-weight alignment suggests a potential for rapid vectoring and high-frequency reactive agility.",
    ability: { name: "Reactive Burst", description: "Instantaneous motor-unit recruitment that could lead to near-instant translation across high-density terrain." }
  },
  {
    name: "James Elder",
    alias: "Mecha-Cavalier",
    archetype: "Outrider",
    sport: "Equestrian",
    event: "Jumping Individual",
    biometrics: { height: 178, weight: 70, age: 45 },
    lore: "Synchronicity coefficients suggest an alignment with multi-link coordination and collaborative system management.",
    ability: { name: "Neural Linkage", description: "Cognitive distribution that could lead to flawless tactical execution across dual-operator platforms." }
  },
  {
    name: "Tahl Leibovitz",
    alias: "Neural Striker",
    archetype: "Equalizer",
    sport: "Para-Table Tennis",
    event: "Class-9 Single-Arm",
    biometrics: { height: 172, weight: 65, age: 49 },
    lore: "Class-9 Biomechanical variance suggests an alignment with localized parity-circuits and rapid reflexive calculation.",
    ability: { name: "Parity Mapping", description: "Adaptive reflex scaling that could lead to perfect returns by equalizing bio-mechanical variance in real-time." }
  }
];

export default function Home() {
  return (
    <BioSyncProvider>
      <main className="min-h-screen bg-[#020202] py-20 px-6 md:px-12 selection:bg-[#E20074] selection:text-white">
        <div className="max-w-7xl mx-auto">
          
          <BioSyncHeader />

          {/* Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {ELITE_SEVEN.map((hero, index) => (
              <HeroCard key={index} hero={hero} />
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-[10px] font-mono tracking-[0.4em] uppercase">
            <p className="hover:text-white transition-colors cursor-default">Verified by Vertex AI // Gemini 3.1 Pro</p>
            <div className="h-1 w-1 bg-[#E20074] hidden md:block" />
            <p className="hover:text-[#E20074] transition-colors cursor-default">Hackathon 2026 // Project: Hero Identity</p>
            <div className="h-1 w-1 bg-[#E20074] hidden md:block" />
            <p className="hover:text-white transition-colors cursor-default">System Status: Optimal</p>
          </div>
        </div>
      </main>
    </BioSyncProvider>
  );
}
