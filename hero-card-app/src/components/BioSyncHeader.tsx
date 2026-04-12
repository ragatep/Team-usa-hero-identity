'use client';

import React, { useState } from 'react';
import { useBioSync } from '@/context/BioSyncContext';

export const BioSyncHeader = () => {
  const { userBio, updateBio } = useBioSync();
  const [isOpen, setIsOpen] = useState(false);
  const [localBio, setLocalBio] = useState(userBio);

  const handleSync = () => {
    updateBio(localBio);
    setIsOpen(false);
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
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#E20074] font-bold mb-2">Height (CM)</label>
                <input 
                  type="number" 
                  value={localBio.height}
                  onChange={(e) => setLocalBio({...localBio, height: parseInt(e.target.value)})}
                  className="w-full bg-black border border-white/20 p-3 text-white font-mono focus:border-[#E20074] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#E20074] font-bold mb-2">Weight (KG)</label>
                <input 
                  type="number" 
                  value={localBio.weight}
                  onChange={(e) => setLocalBio({...localBio, weight: parseInt(e.target.value)})}
                  className="w-full bg-black border border-white/20 p-3 text-white font-mono focus:border-[#E20074] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#E20074] font-bold mb-2">Age</label>
                <input 
                  type="number" 
                  value={localBio.age}
                  onChange={(e) => setLocalBio({...localBio, age: parseInt(e.target.value)})}
                  className="w-full bg-black border border-white/20 p-3 text-white font-mono focus:border-[#E20074] outline-none"
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
