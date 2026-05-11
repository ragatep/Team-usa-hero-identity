'use client';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { useBioSync } from '@/context/BioSyncContext';

export interface HeroProfile {
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
    summary: string;
    description: string;
  };
  imagePath?: string;
}

interface HeroCardProps {
  hero: HeroProfile;
}

const archetypeThemes = {
  'Tank': {
    main: '#991B1B', // Deep Crimson
    bg: 'from-red-950/80 to-black',
    icon: 'T'
  },
  'DPS': {
    main: '#2563EB', // Electric Blue
    bg: 'from-blue-950/80 to-black',
    icon: 'D'
  },
  'DPS (DoT)': {
    main: '#0891B2', // Aqua Blue
    bg: 'from-cyan-950/80 to-black',
    icon: 'D'
  },
  'Support': {
    main: '#00A36C', // Jade Green
    bg: 'from-emerald-950/80 to-black',
    icon: 'S'
  },
  'Controller': {
    main: '#A855F7', // Neon Purple
    bg: 'from-purple-950/80 to-black',
    icon: 'C'
  }
};

const rarityThemes = {
  'Legendary': {
    color: '#FFD700', // Neon Gold
    glow: 'shadow-[0_0_25px_#FFD700AA]',
    border: 'border-yellow-400'
  },
  'Epic': {
    color: '#D8B4FE', // Vibrant Purple
    glow: 'shadow-[0_0_25px_#D8B4FEAA]',
    border: 'border-purple-400'
  },
  'Rare': {
    color: '#60A5FA', // Vibrant Blue
    glow: 'shadow-[0_0_25px_#60A5FAAA]',
    border: 'border-blue-400'
  },
  'Common': {
    color: '#4ADE80', // Vibrant Green
    glow: 'shadow-[0_0_25px_#4ADE80AA]',
    border: 'border-green-400'
  }
};

const parseMetric = (val: string | number) => {
  if (!val || val === 'NA') return 0;
  const parsed = parseInt(String(val).replace(/[^0-9.-]/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
};

// --- Extracted Card Faces Component ---
const CardFaces = ({ hero, archTheme, rarityTheme, displayHeight, displayWeight, diffHeight, diffWeight, heightUnit, weightUnit, diffHeightUnit, diffWeightUnit, userBio, imageSrc, isExpanded, syncScore }: any) => (
  <>
    {/* FRONT: TCG-STYLE CARD */}
    <div 
      className="absolute inset-0 backface-hidden rounded-lg overflow-hidden transition-all duration-500 animate-neon-flicker"
      style={{ 
        background: `linear-gradient(135deg, ${rarityTheme.color}, ${rarityTheme.color}AA, ${rarityTheme.color}66, ${rarityTheme.color}AA, ${rarityTheme.color})`,
        padding: '6px',
        boxShadow: `0 0 40px ${rarityTheme.color}44, 0 0 80px ${rarityTheme.color}11`
      }}
    >
      {/* Circuit-board texture overlay on the frame */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 48%, ${rarityTheme.color}22 49%, ${rarityTheme.color}22 51%, transparent 52%),
            linear-gradient(0deg, transparent 48%, ${rarityTheme.color}22 49%, ${rarityTheme.color}22 51%, transparent 52%)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Corner accent clips */}
      <div className="absolute top-0 left-0 w-6 h-6 z-[2]" style={{ borderTop: `4px solid ${rarityTheme.color}`, borderLeft: `4px solid ${rarityTheme.color}` }} />
      <div className="absolute top-0 right-0 w-6 h-6 z-[2]" style={{ borderTop: `4px solid ${rarityTheme.color}`, borderRight: `4px solid ${rarityTheme.color}` }} />
      <div className="absolute bottom-0 left-0 w-6 h-6 z-[2]" style={{ borderBottom: `4px solid ${rarityTheme.color}`, borderLeft: `4px solid ${rarityTheme.color}` }} />
      <div className="absolute bottom-0 right-0 w-6 h-6 z-[2]" style={{ borderBottom: `4px solid ${rarityTheme.color}`, borderRight: `4px solid ${rarityTheme.color}` }} />

      {/* Inner card body */}
      <div className="relative w-full h-full rounded-md overflow-hidden bg-[#050505] flex flex-col z-[3]">
        
        {/* === TOP BAR: Name + Alias + Hex Icon (Right) === */}
        <div className="relative z-20 px-4 pt-4 pb-3 flex items-start gap-2" style={{ backgroundColor: '#050505' }}>
            {/* Name block — takes full width */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h2 
                className="text-[19px] text-white uppercase leading-tight break-words glitch-hover tracking-tight"
                style={{ 
                  fontFamily: "'Oxanium', sans-serif",
                  fontWeight: 900,
                  textShadow: `0 0 15px ${rarityTheme.color}88, 2px 2px 0px rgba(0,0,0,0.8)`
                }}
              >
                {hero.alias}
              </h2>
              
              {/* SYNC STATUS BAR (Layer 3) */}
              <div className="flex items-center gap-2 mt-1.5 opacity-90">
                <div className="flex-1 h-[4px] bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                  <div 
                    className="h-full transition-all duration-1000 shadow-[0_0_10px_currentcolor]"
                    style={{ 
                      width: userBio.isSynced ? `${syncScore}%` : '0%',
                      backgroundColor: userBio.isSynced ? rarityTheme.color : '#222',
                      boxShadow: userBio.isSynced ? `0 0 15px ${rarityTheme.color}` : 'none'
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono font-black tracking-tighter" style={{ color: userBio.isSynced ? rarityTheme.color : '#333' }}>
                  {userBio.isSynced ? `SYNC_${syncScore}%` : 'SYNC_AWAITING'}
                </span>
              </div>
            </div>

          {/* Hexagonal Archetype Icon — Right */}
          <div className="flex-shrink-0 relative w-11 h-13 flex items-center justify-center">
            <div 
              className="w-10 h-11 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              style={{ 
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                backgroundColor: rarityTheme.color
              }}
            >
              <div 
                className="w-[34px] h-[38px] flex items-center justify-center"
                style={{ 
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  backgroundColor: '#050505'
                }}
              >
                <span className="text-xl font-black font-[Orbitron]" style={{ color: rarityTheme.color }}>
                  {archTheme.icon}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* === PORTRAIT ART BOX === */}
        <div className="relative flex-1 mx-2 mb-0 rounded-sm overflow-hidden border border-white/5 cyber-scanline shadow-inner">
          {/* Subtle Archetype ambient glow (Reduced significantly as backgrounds are now baked-in) */}
          <div 
            className="absolute inset-0 z-0 opacity-30"
            style={{ 
              background: `radial-gradient(circle at 50% 20%, ${archTheme.main}44 0%, transparent 70%)`
            }}
          />

          {/* Character portrait */}
          <div className="relative w-full h-full z-10 flex items-center justify-center">
            <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-700">
              <Image 
                src={imageSrc} 
                alt={hero.alias}
                fill
                className="object-contain object-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Rarity + Archetype Sport badges overlaid on portrait with premium scrim */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="px-3 pb-3 pt-8" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
              <div className="flex gap-2">
                <span 
                  className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-black/20 shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                  style={{ backgroundColor: rarityTheme.color, color: '#000' }}
                >
                  {hero.Rarity}
                </span>
                <span 
                  className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                  style={{ backgroundColor: archTheme.main, color: '#fff' }}
                >
                  {hero.Archetype} {hero.Sport}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* === ABILITY SECTION === */}
        <div className="px-3 py-2.5 flex-shrink-0" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="inline-block px-1.5 py-0.5 bg-red-700 text-[9px] font-black text-white uppercase tracking-wider leading-none flex-shrink-0 border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {hero.ability.name}
            </span>
            <div className="flex-1" />
            {hero.veteranBonus > 0 && (
              <span 
                className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider leading-none border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: `${rarityTheme.color}33`, color: rarityTheme.color }}
              >
                VET +{hero.veteranBonus}
              </span>
            )}
          </div>
          <p className="text-[10px] text-white/70 leading-relaxed">
            {hero.ability.summary || hero.ability.description}
          </p>
        </div>

        {/* === BOTTOM TRIM: Serial === */}
        <div className="flex items-center justify-center px-3 py-1.5 border-t" style={{ borderColor: `${rarityTheme.color}44`, backgroundColor: '#050505' }}>
          <span className="text-[6px] font-mono uppercase tracking-[0.2em] text-white/25">
            TC-GJ-2026 // SERIALIZED DATA STREAM
          </span>
        </div>
      </div>
    </div>

    {/* BACK: BIO-SHEET */}
    <div 
      className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg overflow-hidden transition-all duration-500 animate-neon-flicker"
      style={{ 
        background: `linear-gradient(135deg, ${rarityTheme.color}, ${rarityTheme.color}88, ${rarityTheme.color}44, ${rarityTheme.color}88, ${rarityTheme.color})`,
        padding: '6px',
        boxShadow: `0 0 30px ${rarityTheme.color}66, 0 0 60px ${rarityTheme.color}22`
      }}
    >
      {/* Corner accent clips */}
      <div className="absolute top-0 left-0 w-5 h-5 z-[2]" style={{ borderTop: `3px solid ${rarityTheme.color}`, borderLeft: `3px solid ${rarityTheme.color}` }} />
      <div className="absolute top-0 right-0 w-5 h-5 z-[2]" style={{ borderTop: `3px solid ${rarityTheme.color}`, borderRight: `3px solid ${rarityTheme.color}` }} />
      <div className="absolute bottom-0 left-0 w-5 h-5 z-[2]" style={{ borderBottom: `3px solid ${rarityTheme.color}`, borderLeft: `3px solid ${rarityTheme.color}` }} />
      <div className="absolute bottom-0 right-0 w-5 h-5 z-[2]" style={{ borderBottom: `3px solid ${rarityTheme.color}`, borderRight: `3px solid ${rarityTheme.color}` }} />

      {/* Inner card body */}
      <div className="relative w-full h-full rounded-md bg-[#0a0a0a] p-5 flex flex-col justify-center text-center overflow-hidden z-[3]">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-zinc-900/50 z-0" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 z-0" />
        
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-[0.05] select-none pointer-events-none z-0">
           <span className="text-[200px] font-black italic" style={{ color: archTheme.main }}>{archTheme.icon}</span>
        </div>

        <div className="relative z-10 flex flex-col h-full justify-start gap-3 pt-6 pb-2">
           <div>
             <h3 className="text-2xl font-[900] italic uppercase tracking-tighter leading-none mb-1 break-words glitch-hover" style={{ color: rarityTheme.color }}>
               {hero.alias}
             </h3>
             <p className="text-[8px] text-white/40 uppercase tracking-[0.2em] font-bold">{hero.Sport} // {hero.Event}</p>
           </div>

           <div className="h-[2px] w-16 mx-auto my-2" style={{ backgroundColor: `${archTheme.main}88` }} />

           <p className={`${isExpanded ? 'text-[11px] leading-relaxed' : 'text-[9px] leading-tight'} font-medium text-zinc-300 italic max-w-[280px] mx-auto transition-all`}>
             &quot;{hero.lore}&quot;
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
              <div className="inline-block px-2 py-0.5 bg-red-700 mb-1 shadow-lg">
                 <p className="text-[9px] font-black text-white uppercase italic tracking-widest">
                    {hero.ability.name}
                 </p>
              </div>
              <p className="text-[10px] text-white/70 leading-snug max-w-[280px] mx-auto overflow-visible">
                 {hero.ability.description}
              </p>
           </div>
        </div>

        {/* SOURCE QUERY FOOTER (Layer 4) */}
        <div className="mt-auto pt-4 opacity-20 border-t border-white/5">
          <p className="text-[7px] font-mono tracking-widest text-white uppercase">
            SOURCE_QUERY: SELECT * FROM `TEAM_USA_HACKATHON` WHERE ATHLETE_ID = '{hero.Year}_{hero.Sport.substring(0,3).toUpperCase()}'
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

  const diffHeightUnit = isImperial ? 'in' : 'cm';
  const diffWeightUnit = isImperial ? 'lbs' : 'kg';

  const diffHeight = mathHeroHeight ? userBio.height - mathHeroHeight : null;
  const diffWeight = mathHeroWeight ? userBio.weight - mathHeroWeight : null;

  // --- LAYER 3: SYNC SCORE CALCULATION ---
  // Calculates how closely the user matches the athlete's biometrics
  let syncScore = 0;
  if (userBio.isSynced && mathHeroHeight && mathHeroWeight) {
    const hDiffPct = Math.abs(userBio.height - mathHeroHeight) / mathHeroHeight;
    const wDiffPct = Math.abs(userBio.weight - mathHeroWeight) / mathHeroWeight;
    const avgDiff = (hDiffPct + wDiffPct) / 2;
    // 100% sync if perfect match, decreases as difference grows
    syncScore = Math.max(0, Math.min(100, Math.round(100 - (avgDiff * 250))));
  }

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

  const cardFacesProps = { hero, archTheme, rarityTheme, displayHeight, displayWeight, diffHeight, diffWeight, heightUnit, weightUnit, diffHeightUnit, diffWeightUnit, userBio, imageSrc, syncScore };

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

      {/* 2. Expanded Modal View — rendered via Portal to escape transform context */}
      {isExpanded && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-12" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {/* Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            onClick={() => {
               setIsExpanded(false);
               setTimeout(() => setIsFlipped(false), 300);
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
        </div>,
        document.body
      )}
    </>
  );
};
