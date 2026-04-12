'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useBioSync } from '@/context/BioSyncContext';

export interface HeroProfile {
  name: string;
  alias: string;
  archetype: 'Titan' | 'Solo' | 'Navigator' | 'Scout' | 'Ghost' | 'Outrider' | 'Equalizer';
  sport: string;
  event: string;
  biometrics: {
    height: number;
    weight: number;
    age: number;
  };
  lore: string;
  ability: {
    name: string;
    description: string;
  };
}

interface HeroCardProps {
  hero: HeroProfile;
}

const themeMap = {
  Titan: {
    main: '#EF4444',
    bg: 'bg-red-950/20',
    border: 'border-red-500',
    text: 'text-red-500',
    tag: 'bg-red-500/20 text-red-100',
    image: '/assets/heroes/behemoth.png'
  },
  Solo: {
    main: '#E20074',
    bg: 'bg-pink-950/20',
    border: 'border-[#E20074]',
    text: 'text-[#E20074]',
    tag: 'bg-[#E20074]/20 text-pink-100',
    image: '/assets/heroes/solo.png'
  },
  Navigator: {
    main: '#3B82F6',
    bg: 'bg-blue-950/20',
    border: 'border-blue-500',
    text: 'text-blue-500',
    tag: 'bg-blue-500/20 text-blue-100',
    image: '/assets/heroes/netrunner.png'
  },
  Scout: {
    main: '#FACC15',
    bg: 'bg-yellow-950/20',
    border: 'border-yellow-400',
    text: 'text-yellow-400',
    tag: 'bg-yellow-400/20 text-yellow-100',
    image: '/assets/heroes/scout.png'
  },
  Ghost: {
    main: '#22C55E',
    bg: 'bg-green-950/20',
    border: 'border-green-500',
    text: 'text-green-500',
    tag: 'bg-green-500/20 text-green-100',
    image: '/assets/heroes/ghost.png'
  },
  Outrider: {
    main: '#A855F7',
    bg: 'bg-purple-950/20',
    border: 'border-purple-500',
    text: 'text-purple-500',
    tag: 'bg-purple-500/20 text-purple-100',
    image: '/assets/heroes/vanguard.png'
  },
  Equalizer: {
    main: '#22D3EE',
    bg: 'bg-cyan-950/20',
    border: 'border-cyan-400',
    text: 'text-cyan-400',
    tag: 'bg-cyan-400/20 text-cyan-100',
    image: '/assets/heroes/equalizer.png'
  }
};

export const HeroCard: React.FC<HeroCardProps> = ({ hero }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { userBio } = useBioSync();
  const theme = themeMap[hero.archetype] || themeMap.Solo;

  // Comparison Logic
  const heightDiff = userBio.height - hero.biometrics.height;
  const weightDiff = userBio.weight - hero.biometrics.weight;

  return (
    <div 
      className="group relative w-full h-[550px] perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full duration-1000 preserve-3d transition-all ${isFlipped ? 'rotate-y-180 scale-105' : 'hover:scale-102'}`}>
        
        {/* FRONT: COMIC ILLUSTRATION */}
        <div 
          className="absolute inset-0 backface-hidden rounded-md border-2 overflow-hidden bg-zinc-900 transition-all duration-500"
          style={{ 
            borderColor: theme.main,
            boxShadow: `inset 0 0 40px ${theme.main}22, 0 0 20px ${theme.main}66`,
            filter: `drop-shadow(0 0 15px ${theme.main}44)`
          }}
        >
          {/* Main Illustration */}
          <div className="absolute inset-0 z-0">
            <Image 
              src={theme.image} 
              alt={hero.name}
              fill
              className="object-cover opacity-100"
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>

          {/* Letter Marker (Upper Right - Hexagonal Style) */}
          <div className="absolute top-4 right-4 z-20">
             <div className="relative h-14 w-14 flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-black rotate-45 transform scale-90 border-2" 
                  style={{ borderColor: theme.main }}
                />
                <span className="relative z-10 text-2xl font-black text-white font-[Orbitron]">{hero.archetype.charAt(0)}</span>
             </div>
          </div>

          {/* Bottom Labels (Flat Tags) */}
          <div className="absolute bottom-6 left-6 z-20 space-y-3">
             <div className="flex gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border border-black shadow-[2px_2px_0_0_#000] ${theme.tag}`}>
                   {hero.archetype}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-black text-white border border-white/20 shadow-[2px_2px_0_0_#000]">
                   {hero.sport}
                </span>
             </div>
             <div className="bg-black/95 backdrop-blur-md p-4 border-l-4 border-white transform skew-x-[-12deg] shadow-2xl">
                <h2 className="text-2xl font-[900] text-white uppercase italic tracking-tighter leading-none transform skew-x-[12deg]">
                   {hero.alias}
                </h2>
             </div>
          </div>

          {/* Grainy Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 pointer-events-none mix-blend-overlay" />
        </div>

        {/* BACK: BIO-SHEET */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-md border-2 bg-zinc-950 p-10 flex flex-col justify-center text-center overflow-hidden transition-all duration-500"
          style={{ 
            borderColor: theme.main,
            boxShadow: `inset 0 0 100px ${theme.main}11, 0 0 20px ${theme.main}44`,
            filter: `drop-shadow(0 0 15px ${theme.main}44)`
          }}
        >
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10" />
           
           {/* Archetype Watermark */}
           <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-[0.03] select-none pointer-events-none">
              <span className="text-[200px] font-black italic">{hero.archetype.charAt(0)}</span>
           </div>

           {/* Centered Content */}
           <div className="relative z-10 space-y-6">
              <div>
                <h3 className={`text-4xl font-[900] italic uppercase tracking-tighter ${theme.text} leading-none mb-2 break-words`}>{hero.alias}</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">{hero.sport} // {hero.event}</p>
              </div>

              <div className="h-[2px] w-24 bg-white/20 mx-auto" />

              <p className="text-xs font-medium text-zinc-300 italic max-w-[280px] mx-auto leading-relaxed">
                "{hero.lore}"
              </p>

              {/* Stats Grid with User Sync */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10 mx-auto max-w-[300px]">
                 <div>
                    <p className="text-[8px] text-white/30 uppercase font-black mb-1">Height</p>
                    <p className="text-lg font-black text-white leading-none">{hero.biometrics.height}<span className="text-[10px] text-white/40 ml-0.5">cm</span></p>
                    {userBio.isSynced && (
                      <p className={`text-[9px] mt-1 font-mono font-bold ${heightDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {heightDiff >= 0 ? `+${heightDiff}` : heightDiff}cm
                      </p>
                    )}
                 </div>
                 <div>
                    <p className="text-[8px] text-white/30 uppercase font-black mb-1">Weight</p>
                    <p className="text-lg font-black text-white leading-none">{hero.biometrics.weight}<span className="text-[10px] text-white/40 ml-0.5">kg</span></p>
                    {userBio.isSynced && (
                      <p className={`text-[9px] mt-1 font-mono font-bold ${weightDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {weightDiff >= 0 ? `+${weightDiff}` : weightDiff}kg
                      </p>
                    )}
                 </div>
                 <div>
                    <p className="text-[8px] text-white/30 uppercase font-black mb-1">Age</p>
                    <p className="text-lg font-black text-white leading-none">{hero.biometrics.age}</p>
                    {userBio.isSynced && (
                      <p className="text-[9px] mt-1 font-mono font-bold text-white/40">
                         {userBio.age}yr
                      </p>
                    )}
                 </div>
              </div>

              {/* Ability - Bold Section */}
              <div className="pt-2">
                 <div className={`inline-block px-4 py-1.5 bg-black border-2 ${theme.border} transform -skew-x-12 mb-3 shadow-[4px_4px_0_0_#000]`}>
                    <p className="text-[11px] font-black text-white uppercase italic tracking-widest transform skew-x-12">
                       {hero.ability.name}
                    </p>
                 </div>
                 <p className="text-[11px] text-white/70 leading-relaxed max-w-[260px] mx-auto">
                    {hero.ability.description}
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
