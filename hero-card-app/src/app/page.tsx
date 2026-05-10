'use client';

import { useState, useEffect } from 'react';
import { BioSyncProvider, useBioSync } from "@/context/BioSyncContext";
import { BioSyncHeader } from "@/components/BioSyncHeader";
import { HeroCard, HeroProfile } from "@/components/HeroCard";
import heroData from "@/data/hero_identities.json";

function HeroGrid() {
  const { userBio } = useBioSync();
  const [dealtCards, setDealtCards] = useState<number[]>([]);
  const [dealStarted, setDealStarted] = useState(false);

  // Sort by rarity tier: Legendary → Epic → Rare → Common
  const rarityOrder: Record<string, number> = { Legendary: 0, Epic: 1, Rare: 2, Common: 3 };
  const heroes = [...(heroData as HeroProfile[])].sort(
    (a, b) => (rarityOrder[a.Rarity] ?? 99) - (rarityOrder[b.Rarity] ?? 99)
  );

  // Casino dealing sequence: triggered when user syncs biometrics
  useEffect(() => {
    if (userBio.isSynced && !dealStarted) {
      setDealStarted(true);
      setDealtCards([]);
      
      // Deal cards one-by-one with staggered delays
      // Row-by-row, left-to-right (5 cards per row, 4 rows)
      heroes.forEach((_, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        // Base delay: 400ms after sync completes
        // Row stagger: each row waits for the previous row to mostly finish
        // Col stagger: each card in a row is dealt 150ms apart
        const delay = 400 + (row * 850) + (col * 150);
        
        setTimeout(() => {
          setDealtCards(prev => [...prev, index]);
        }, delay);
      });
    }
  }, [userBio.isSynced]);

  // Before sync: show an atmospheric placeholder
  if (!userBio.isSynced) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="relative">
          <div className="text-[#E20074]/20 text-8xl font-black font-[Orbitron] animate-pulse">
            ◆
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 border-2 border-[#E20074]/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <p className="mt-8 text-white/30 font-mono text-xs tracking-[0.5em] uppercase">
          Awaiting Bio-Sync Uplink
        </p>
        <p className="mt-2 text-white/15 font-mono text-[10px] tracking-widest uppercase">
          Sync your biometrics to initialize the hero database
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Grid — 5x4 layout: each rarity tier fills one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-12">
        {heroes.map((hero, index) => {
          const isDealt = dealtCards.includes(index);
          
          return (
            <div
              key={index}
              className="transition-all ease-out"
              style={{
                opacity: isDealt ? 1 : 0,
                transform: isDealt
                  ? 'translateY(0) rotateZ(0deg) scale(1)'
                  : 'translateY(-80px) rotateZ(-6deg) scale(0.8)',
                transitionDuration: '800ms',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <HeroCard hero={hero} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <BioSyncProvider>
      <main className="min-h-screen bg-[#020202] py-20 px-6 md:px-12 selection:bg-cyan-500 selection:text-white">
        <div className="max-w-[1800px] mx-auto">
          
          <BioSyncHeader />

          <HeroGrid />

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
