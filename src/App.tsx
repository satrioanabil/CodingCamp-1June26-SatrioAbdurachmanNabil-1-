import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HeaderCard } from './components/HeaderCard';
import { FocusTimerCard } from './components/FocusTimerCard';
import { TodoCard } from './components/TodoCard';
import { QuickLinksCard } from './components/QuickLinksCard';
import { TimerMode } from './types';
import { Sparkles, HelpCircle, CheckCircle } from 'lucide-react';

export default function App() {
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');

  // Ambient backgrounds depending on focus state
  const getAmbientBg = () => {
    switch (timerMode) {
      case 'shortBreak':
        return 'from-[#09090B] via-[#0A0A0C] to-[#0A1A12]';
      case 'longBreak':
        return 'from-[#09090B] via-[#0A0A0C] to-[#0C1122]';
      case 'focus':
      default:
        return 'from-[#09090B] via-[#0A0A0C] to-[#1A0E10]';
    }
  };

  const getAccentBlob = () => {
    switch (timerMode) {
      case 'shortBreak':
        return 'bg-emerald-500/10';
      case 'longBreak':
        return 'bg-indigo-500/10';
      case 'focus':
      default:
        return 'bg-rose-500/10';
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-tr ${getAmbientBg()} transition-colors duration-1000 px-4 py-8 md:py-12 flex flex-col items-center relative overflow-hidden`}>
      
      {/* Decorative Blur Ambient Circles in bg */}
      <div className={`absolute top-1/4 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-1000 ${getAccentBlob()}`} />
      <div className={`absolute bottom-1/4 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-1000 ${getAccentBlob()} opacity-70`} />

      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col gap-6 relative z-10">
        
        {/* Subtle Workspace Title */}
        <div className="flex items-center justify-between px-2 select-none">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="text-indigo-400 w-4 h-4 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Workspace / Ruang Kerja</span>
          </div>
          <div id="connection-indicator" className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-full shadow-2xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Sesi Aktif</span>
          </div>
        </div>

        {/* 1. Header Card (Clock, Greeting, Quotes) */}
        <HeaderCard />

        {/* 2. Main Dashboard Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Focus Timer Widget (Takes 5 cols on lg) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 w-full">
            <FocusTimerCard onModeChange={(mode) => setTimerMode(mode)} />
          </div>

          {/* Right Column: To-Do List Widget (Takes 7 cols on lg) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 w-full">
            <TodoCard />
          </div>
        </div>

        {/* 3. Footer Bento: Quick Links Widget (Takes full width) */}
        <QuickLinksCard />

        {/* Simple Foot Branding Accent */}
        <footer className="mt-8 text-center text-slate-500 text-xs font-medium select-none flex flex-col items-center gap-1">
          <p>© 2026 Dasbor Produktivitas Pribadi · Dirancang untuk Meningkatkan Fokus Selaras Kerja Nyata</p>
        </footer>

      </div>
    </div>
  );
}
