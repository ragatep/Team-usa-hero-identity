'use client';

import React, { useState, useEffect } from 'react';
import { useBioSync } from '@/context/BioSyncContext';

export const BioSyncHeader = () => {
  const { userBio, updateBio } = useBioSync();
  const [isOpen, setIsOpen] = useState(false);
  const [localBio, setLocalBio] = useState(userBio);
  
  // Separate state for Feet and Inches when in Imperial mode
  const [localFeet, setLocalFeet] = useState(0);
  const [localInches, setLocalInches] = useState(0);

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalBio(userBio);
      if (userBio.unitSystem === 'imperial') {
        setLocalFeet(Math.floor(userBio.height / 12));
        setLocalInches(userBio.height % 12);
      }
    }
  }, [isOpen, userBio]);

  // Handle unit switching and conversions
  const toggleUnitSystem = (system: 'metric' | 'imperial') => {
    if (system === localBio.unitSystem) return;

    if (system === 'imperial') {
      // Metric to Imperial: height (cm) -> inches, weight (kg) -> lbs
      const totalInches = Math.round(localBio.height * 0.393701);
      const newLbs = Math.round(localBio.weight * 2.20462);
      setLocalFeet(Math.floor(totalInches / 12));
      setLocalInches(totalInches % 12);
      setLocalBio({ ...localBio, unitSystem: 'imperial', height: totalInches, weight: newLbs });
    } else {
      // Imperial to Metric: height (inches) -> cm, weight (lbs) -> kg
      const currentTotalInches = localFeet * 12 + localInches;
      const newCm = Math.round(currentTotalInches * 2.54);
      const newKg = Math.round(localBio.weight * 0.453592);
      setLocalBio({ ...localBio, unitSystem: 'metric', height: newCm, weight: newKg });
    }
  };

  // Update total inches whenever feet or inches change in imperial mode
  useEffect(() => {
    if (localBio.unitSystem === 'imperial') {
      setLocalBio(prev => ({ ...prev, height: localFeet * 12 + localInches }));
    }
  }, [localFeet, localInches]);

  const handleSync = () => {
    updateBio(localBio);
    setIsOpen(false);
  };

  // Validation Helpers
  const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent typing negative signs, exponents, decimals, or plus signs
    if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const parsePositiveInt = (val: string) => {
    // Strip out anything that isn't a digit, then parse to integer (default to 0 if empty)
    const cleaned = val.replace(/\D/g, '');
    return cleaned === '' ? 0 : parseInt(cleaned, 10);
  };

  return (
    <header className="mb-16 border-l-8 border-[#E20074] pl-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-6xl md:text-8xl font-[900] text-white uppercase tracking-tighter font-[Orbitron] leading-[0.8] mb-4 text-glow italic">
            Digital<br/>Mirror
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-[#E20074] font-mono tracking-[0.3em] text-sm uppercase font-bold">
              Team USA // Hero Identity Database
            </p>
            <div className="h-[2px] w-20 bg-white/10" />
            <div className={`h-3 w-3 rounded-full animate-pulse ${userBio.isSynced ? 'bg-green-500' : 'bg-[#E20074]'}`} title={userBio.isSynced ? 'Synced' : 'Not Synced'} />
          </div>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="group relative px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#E20074] hover:text-white transition-all transform hover:-skew-x-12"
        >
          {userBio.isSynced ? 'Re-Sync Biometrics' : 'Sync Your Biometrics'}
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-[#E20074]" />
        </button>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="w-full max-w-md bg-zinc-900 border-2 border-white p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 bg-white/5 rotate-45 translate-x-10 -translate-y-10" />
            
            <h2 className="text-3xl font-black text-white uppercase italic mb-6 font-[Orbitron]">User Bio-Sync</h2>
            
            <div className="space-y-6">
              
              {/* Unit Toggle */}
              <div className="flex bg-black p-1 border border-white/20">
                <button 
                  onClick={() => toggleUnitSystem('metric')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${localBio.unitSystem === 'metric' ? 'bg-[#E20074] text-white' : 'text-white/50 hover:text-white'}`}
                >
                  Metric
                </button>
                <button 
                  onClick={() => toggleUnitSystem('imperial')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${localBio.unitSystem === 'imperial' ? 'bg-[#E20074] text-white' : 'text-white/50 hover:text-white'}`}
                >
                  Imperial
                </button>
              </div>

              {/* Height Input */}
              {localBio.unitSystem === 'metric' ? (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#E20074] font-bold mb-2">Height (CM)</label>
                  <input 
                    type="number" 
                    min="0"
                    onKeyDown={preventInvalidChars}
                    value={localBio.height || ''}
                    onChange={(e) => setLocalBio({...localBio, height: parsePositiveInt(e.target.value)})}
                    className="w-full bg-black border border-white/20 p-3 text-white font-mono focus:border-[#E20074] outline-none"
                    placeholder="0"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#E20074] font-bold mb-2">Height</label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                       <input 
                         type="number"
                         min="0"
                         onKeyDown={preventInvalidChars}
                         value={localFeet || ''}
                         onChange={(e) => setLocalFeet(parsePositiveInt(e.target.value))}
                         className="w-full bg-black border border-white/20 p-3 text-white font-mono focus:border-[#E20074] outline-none"
                         placeholder="0"
                       />
                       <span className="absolute right-4 top-3 text-white/50 font-mono text-xs mt-1 pointer-events-none">FT</span>
                    </div>
                    <div className="flex-1 relative">
                       <input 
                         type="number"
                         min="0"
                         onKeyDown={preventInvalidChars}
                         value={localInches || ''}
                         onChange={(e) => setLocalInches(parsePositiveInt(e.target.value))}
                         className="w-full bg-black border border-white/20 p-3 text-white font-mono focus:border-[#E20074] outline-none"
                         placeholder="0"
                       />
                       <span className="absolute right-4 top-3 text-white/50 font-mono text-xs mt-1 pointer-events-none">IN</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Weight Input */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#E20074] font-bold mb-2">
                  Weight ({localBio.unitSystem === 'metric' ? 'KG' : 'LBS'})
                </label>
                <input 
                  type="number"
                  min="0"
                  onKeyDown={preventInvalidChars}
                  value={localBio.weight || ''}
                  onChange={(e) => setLocalBio({...localBio, weight: parsePositiveInt(e.target.value)})}
                  className="w-full bg-black border border-white/20 p-3 text-white font-mono focus:border-[#E20074] outline-none"
                  placeholder="0"
                />
              </div>

              {/* Age Input */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#E20074] font-bold mb-2">Age</label>
                <input 
                  type="number"
                  min="0"
                  onKeyDown={preventInvalidChars}
                  value={localBio.age || ''}
                  onChange={(e) => setLocalBio({...localBio, age: parsePositiveInt(e.target.value)})}
                  className="w-full bg-black border border-white/20 p-3 text-white font-mono focus:border-[#E20074] outline-none"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSync}
                  className="flex-1 bg-white text-black font-black uppercase py-4 hover:bg-[#E20074] hover:text-white transition-colors"
                >
                  Confirm Sync
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="px-6 border border-white/20 text-white font-bold uppercase transition-colors hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
