'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useBioSync } from '@/context/BioSyncContext';

export interface HeroProfile {
  Name: string;
  alias: string;
  Archetype: 'Tank' | 'DPS' | 'DPS (DoT)' | 'Support' | 'Controller';
  Rarity: 'Legendary' | 'Epic' | 'Rare' | 'Common';
  Sport: string;
  Event: string;
  Height: string;
  Weight: string;
  Age: number | string | null;
  lore: string;
  ability: {
    name: string;
    description: string;
  };
  imagePath?: string;
}

interface HeroCardProps {
  hero: HeroProfile;
}

const archetypeThemes = {
  'Tank': {
    main: '#DC2626', // Crimson
    bg: 'from-red-950/80 to-black',
    icon: 'T'
  },
  'DPS': {
    main: '#2563EB', // Electric Blue
    bg: 'from-blue-950/80 to-black',
    icon: 'D'
  },
  'DPS (DoT)': {
    main: '#06B6D4', // Aqua Blue
    bg: 'from-cyan-950/80 to-black',
    icon: 'D'
  },
  'Support': {
    main: '#10B981', // Jade Green
    bg: 'from-green-950/80 to-black',
    icon: 'S'
  },
  'Controller': {
    main: '#8B5CF6', // Neon Purple
    bg: 'from-purple-950/80 to-black',
    icon: 'C'
  }
};

const rarityThemes = {
  'Legendary': {
    color: '#FCD34D', // Pastel Gold
    glow: 'shadow-[0_0_15px_#FCD34D88]',
    border: 'border-yellow-200'
  },
  'Epic': {
    color: '#C084FC', // Pastel Purple
    glow: 'shadow-[0_0_15px_#C084FC88]',
    border: 'border-purple-300'
  },
  'Rare': {
    color: '#93C5FD', // Pastel Blue
    glow: 'shadow-[0_0_15px_#93C5FD88]',
    border: 'border-blue-300'
  },
  'Common': {
    color: '#86EFAC', // Pastel Green
    glow: 'shadow-[0_0_15px_#86EFAC88]',
    border: 'border-green-300'
  }
};

const parseMetric = (val: string | number) => {
  if (!val || val === 'NA') return 0;
  const parsed = parseInt(String(val).replace(/[^0-9.-]/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
};

// --- Extracted Card Faces Component ---
// This allows us to render the exact same card in the grid AND in the modal.
const CardFaces = ({ hero, archTheme, rarityTheme, displayHeight, displayWeight, diffHeight, diffWeight, heightUnit, weightUnit, diffHeightUnit, diffWeightUnit, userBio, imageSrc, isExpanded }: any) => (
  <>
    {/* FRONT: COMIC ILLUSTRATION */}
    <div 
      className="absolute inset-0 backface-hidden rounded-md border-2 overflow-hidden bg-zinc-900 transition-all duration-500"
      style={{ 
        borderColor: rarityTheme.color,
        boxShadow: `inset 0 0 40px ${archTheme.main}44, 0 0 20px ${rarityTheme.color}66`
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${archTheme.bg} z-0`} />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
         <div className="relative w-full h-full">
           <Image 
             src={imageSrc} 
             alt={hero.Name}
             fill
             className="object-contain object-center drop-shadow-2xl mix-blend-normal"
             priority
             unoptimized
           />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20 pointer-events-none" />
      </div>

      <div className="absolute top-4 right-4 z-30">
         <div className="relative h-14 w-14 flex items-center justify-center">
            <div 
              className={`absolute inset-0 bg-black rotate-45 transform scale-90 border-2 ${rarityTheme.glow}`} 
              style={{ borderColor: rarityTheme.color }}
            />
            <span className="relative z-10 text-2xl font-black font-[Orbitron]" style={{ color: rarityTheme.color }}>
              {archTheme.icon}
            </span>
         </div>
      </div>

      <div className="absolute bottom-6 left-6 z-30 space-y-3 w-[80%]">
         <div className="flex flex-wrap gap-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-black border border-white/20 shadow-[2px_2px_0_0_#000]" style={{ color: rarityTheme.color }}>
               {hero.Rarity}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border border-black shadow-[2px_2px_0_0_#000]" style={{ backgroundColor: `${archTheme.main}44`, color: archTheme.main }}>
               {hero.Archetype}
            </span>
         </div>
         <div className="bg-black/95 backdrop-blur-md p-4 border-l-4 transform skew-x-[-12deg] shadow-2xl" style={{ borderColor: rarityTheme.color }}>
            <h2 className="text-xl font-[900] text-white uppercase italic tracking-tighter leading-tight transform skew-x-[12deg] break-words">
               {hero.alias}
            </h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1 transform skew-x-[12deg] break-words">{hero.Name}</p>
         </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-1 z-30" style={{ backgroundColor: rarityTheme.color }} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 pointer-events-none mix-blend-overlay z-40" />
    </div>

    {/* BACK: BIO-SHEET */}
    <div 
      className="absolute inset-0 backface-hidden rotate-y-180 rounded-md border-2 bg-zinc-950 p-5 flex flex-col justify-center text-center overflow-hidden transition-all duration-500"
      style={{ 
        borderColor: rarityTheme.color,
        boxShadow: `inset 0 0 100px ${archTheme.main}22, 0 0 20px ${rarityTheme.color}44`
      }}
    >
       <div className="absolute inset-0 bg-gradient-to-t from-black to-zinc-900/50 z-0" />
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 z-0" />
       
       <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-[0.05] select-none pointer-events-none z-0">
          <span className="text-[200px] font-black italic" style={{ color: archTheme.main }}>{archTheme.icon}</span>
       </div>

       <div className="relative z-10 flex flex-col h-full justify-center gap-3 py-2">
          <div>
            <h3 className="text-2xl font-[900] italic uppercase tracking-tighter leading-none mb-1 break-words" style={{ color: rarityTheme.color }}>
              {hero.alias}
            </h3>
            <p className="text-[8px] text-white/40 uppercase tracking-[0.2em] font-bold">{hero.Sport} // {hero.Event}</p>
          </div>

          <div className="h-[2px] w-16 mx-auto my-2" style={{ backgroundColor: `${archTheme.main}88` }} />

          <p className={`${isExpanded ? 'text-[11px] leading-relaxed' : 'text-[9px] leading-tight'} font-medium text-zinc-300 italic max-w-[280px] mx-auto flex-grow flex items-center justify-center transition-all`}>
            "{hero.lore}"
          </p>

          <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10 mx-auto w-full max-w-[280px] my-2">
             <div>
                <p className="text-[8px] text-white/30 uppercase font-black mb-0.5">Height</p>
                <p className="text-[14px] font-black text-white leading-none">
                  {displayHeight !== undefined && displayHeight !== null ? displayHeight : '--'}
                  <span className="text-[9px] text-white/40 ml-0.5">{heightUnit}</span>
                </p>
                {userBio.isSynced && diffHeight !== null && (
                  <p className={`text-[8px] mt-0.5 font-mono font-bold ${diffHeight >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {diffHeight >= 0 ? `+${diffHeight}` : diffHeight}{diffHeightUnit}
                  </p>
                )}
             </div>
             <div>
                <p className="text-[8px] text-white/30 uppercase font-black mb-0.5">Weight</p>
                <p className="text-[14px] font-black text-white leading-none">
                  {displayWeight !== undefined && displayWeight !== null ? displayWeight : '--'}
                  <span className="text-[9px] text-white/40 ml-0.5">{weightUnit}</span>
                </p>
                {userBio.isSynced && diffWeight !== null && (
                  <p className={`text-[8px] mt-0.5 font-mono font-bold ${diffWeight >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {diffWeight >= 0 ? `+${diffWeight}` : diffWeight}{diffWeightUnit}
                  </p>
                )}
             </div>
             <div>
                <p className="text-[8px] text-white/30 uppercase font-black mb-0.5">Age</p>
                <p className="text-[14px] font-black text-white leading-none">{hero.Age || '--'}</p>
                {userBio.isSynced && (
                  <p className="text-[8px] mt-0.5 font-mono font-bold text-white/40">
                     {userBio.age}yr
                  </p>
                )}
             </div>
          </div>

          <div className="pt-0">
             <div className="inline-block px-2 py-0.5 bg-black border border-red-600 transform -skew-x-12 mb-1 shadow-[2px_2px_0_0_#000]">
                <p className="text-[9px] font-black text-red-500 uppercase italic tracking-widest transform skew-x-12">
                   {hero.ability.name}
                </p>
             </div>
             <p className="text-[9px] text-white/70 leading-snug max-w-[280px] mx-auto overflow-visible">
                {hero.ability.description}
             </p>
          </div>
       </div>
    </div>
  </>
);

export const HeroCard: React.FC<HeroCardProps> = ({ hero }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const { userBio } = useBioSync();
  
  const archTheme = archetypeThemes[hero.Archetype] || archetypeThemes['DPS'];
  const rarityTheme = rarityThemes[hero.Rarity] || rarityThemes['Common'];

  const isImperial = userBio.unitSystem === 'imperial';

  const baseHeroHeightCm = parseMetric(hero.Height);
  const baseHeroWeightKg = parseMetric(hero.Weight);

  let displayHeight: string | number = baseHeroHeightCm || '--';
  let heightUnit = baseHeroHeightCm ? 'cm' : '';
  let displayWeight: string | number = baseHeroWeightKg || '--';
  let weightUnit = baseHeroWeightKg ? 'kg' : '';

  let mathHeroHeight = baseHeroHeightCm;
  let mathHeroWeight = baseHeroWeightKg;

  if (isImperial && baseHeroHeightCm && baseHeroWeightKg) {
    const totalInches = Math.round(baseHeroHeightCm * 0.393701);
    mathHeroHeight = totalInches;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    displayHeight = `${feet}'${inches}"`;
    heightUnit = ''; // no suffix needed since we use standard feet/inches notation

    mathHeroWeight = Math.round(baseHeroWeightKg * 2.20462);
    displayWeight = mathHeroWeight;
    weightUnit = 'lbs';
  }

  const diffHeight = mathHeroHeight ? userBio.height - mathHeroHeight : null;
  const diffWeight = mathHeroWeight ? userBio.weight - mathHeroWeight : null;
  const diffHeightUnit = isImperial ? 'in' : 'cm';
  const diffWeightUnit = isImperial ? 'lbs' : 'kg';

  const placeholderImage = `/assets/heroes/${hero.Archetype.replace(/[^a-zA-Z]/g, '').toLowerCase()}.png`;
  const imageSrc = hero.imagePath || placeholderImage;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isExpanded]);

  const cardFacesProps = { hero, archTheme, rarityTheme, displayHeight, displayWeight, diffHeight, diffWeight, heightUnit, weightUnit, diffHeightUnit, diffWeightUnit, userBio, imageSrc };

  return (
    <>
      {/* 1. Grid Card View */}
      <div 
        className="group relative w-full h-[550px] perspective-1000 cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <div className="relative w-full h-full duration-1000 preserve-3d transition-all hover:scale-105">
           {/* In the grid, we only ever show the front. Clicking it opens the modal. */}
           <CardFaces {...cardFacesProps} isExpanded={false} />
        </div>
      </div>

      {/* 2. Expanded Modal View */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300">
          {/* Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            onClick={() => {
               setIsExpanded(false);
               setTimeout(() => setIsFlipped(false), 300); // Wait for modal to close before flipping back
            }}
          />
          
          {/* Centered, Scaled-Up Card */}
          <div 
            className="relative z-10 w-full max-w-[360px] h-[550px] perspective-1000 cursor-pointer transform scale-100 sm:scale-110 md:scale-125 lg:scale-150 transition-all hover:scale-105 sm:hover:scale-[1.15] md:hover:scale-[1.30] lg:hover:scale-[1.55]"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full duration-1000 preserve-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
               <CardFaces {...cardFacesProps} isExpanded={true} />
            </div>
            
            {/* Flip Hint */}
            <div className={`absolute -bottom-16 inset-x-0 text-center text-white/50 text-xs font-mono tracking-widest uppercase transition-opacity duration-500 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
               Tap to reveal Bio-Sync Data
            </div>
          </div>
        </div>
      )}
    </>
  );
};
