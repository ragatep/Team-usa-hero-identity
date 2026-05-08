import { BioSyncProvider } from "@/context/BioSyncContext";
import { BioSyncHeader } from "@/components/BioSyncHeader";
import { HeroCard, HeroProfile } from "@/components/HeroCard";
import heroData from "@/data/hero_identities.json";

export default function Home() {
  // Sort by rarity tier: Legendary → Epic → Rare → Common
  const rarityOrder: Record<string, number> = { Legendary: 0, Epic: 1, Rare: 2, Common: 3 };
  const heroes = [...(heroData as HeroProfile[])].sort(
    (a, b) => (rarityOrder[a.Rarity] ?? 99) - (rarityOrder[b.Rarity] ?? 99)
  );

  return (
    <BioSyncProvider>
      <main className="min-h-screen bg-[#020202] py-20 px-6 md:px-12 selection:bg-cyan-500 selection:text-white">
        <div className="max-w-[1800px] mx-auto">
          
          <BioSyncHeader />

          {/* Hero Grid — 5x4 layout: each rarity tier fills one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-12">
            {heroes.map((hero, index) => (
              <HeroCard key={index} hero={hero} />
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-[10px] font-mono tracking-[0.4em] uppercase">
            <p className="hover:text-white transition-colors cursor-default">Verified by Vertex AI // Gemini 3.1 Pro</p>
            <div className="h-1 w-1 bg-cyan-500 hidden md:block" />
            <p className="hover:text-cyan-500 transition-colors cursor-default">Hackathon 2026 // Project: Hero Identity</p>
            <div className="h-1 w-1 bg-cyan-500 hidden md:block" />
            <p className="hover:text-white transition-colors cursor-default">System Status: Optimal</p>
          </div>
        </div>
      </main>
    </BioSyncProvider>
  );
}
