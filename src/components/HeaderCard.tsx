import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, Quote, Edit2, Check, User, Sparkles } from 'lucide-react';
import { MotivationalQuote } from '../types';

const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  { text: "Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya.", author: "Abraham Lincoln" },
  { text: "Jangan batasi tantanganmu, tantang batasanmu.", author: "Anonim" },
  { text: "Fokuslah pada hasil akhir, bukan pada hambatan di sepanjang jalan.", author: "Anonim" },
  { text: "Satu langkah kecil hari ini adalah awal dari kemajuan hebat besok.", author: "Pepatah" },
  { text: "Produktivitas bukanlah tentang sibuk sepanjang waktu, tapi tentang efektivitas kerja.", author: "Anonim" },
  { text: "Kerja cerdas jauh lebih bernilai dari sekadar kerja keras tanpa arah.", author: "Anonim" },
  { text: "Waktumu terbatas, jadi jangan sia-siakan untuk menjalani hidup orang lain.", author: "Steve Jobs" }
];

export function HeaderCard() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem('productiv_user_name');
    if (saved) return saved;
    // Default to email prefix if available, otherwise User
    return "Satrio";
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(userName);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set initial default name from context if email exists on load and user has never customized it
  useEffect(() => {
    if (!localStorage.getItem('productiv_user_name')) {
      const email = "satrioanabil@gmail.com";
      if (email && email.includes('@')) {
        const prefix = email.split('@')[0];
        // Capitalize first letter and sanitize
        const cleaned = prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[^a-zA-Z0-9]/g, ' ');
        setUserName(cleaned);
        setNameInput(cleaned);
        localStorage.setItem('productiv_user_name', cleaned);
      }
    }
  }, []);

  // Determine greeting based on Indonesian timezone / local hour (from 2026-06-06 local time)
  const getGreeting = (): { text: string; icon: string; bg: string; textCol: string } => {
    const hour = currentTime.getHours();
    if (hour >= 4 && hour < 11) {
      return { text: "Selamat Pagi", icon: "🌅", bg: "from-amber-500/10 to-orange-500/10", textCol: "text-amber-700" };
    } else if (hour >= 11 && hour < 15) {
      return { text: "Selamat Siang", icon: "☀️", bg: "from-blue-500/10 to-amber-500/10", textCol: "text-orange-700" };
    } else if (hour >= 15 && hour < 18) {
      return { text: "Selamat Sore", icon: "🌇", bg: "from-orange-500/10 to-rose-500/10", textCol: "text-rose-700" };
    } else {
      return { text: "Selamat Malam", icon: "🌙", bg: "from-indigo-500/10 to-slate-900/10", textCol: "text-indigo-400" };
    }
  };

  const greeting = getGreeting();

  // Date Formatting Indonesian Locale style
  const formatDateIndo = (date: Date): string => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setUserName(trimmed);
      localStorage.setItem('productiv_user_name', trimmed);
      setIsEditingName(false);
    }
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const selectedQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div id="greeting-root" className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden relative backdrop-blur-md">
      {/* Dynamic Ambient Background Glow in corner */}
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 blur-3xl pointer-events-none" />

      {/* Greeting and Clock Details */}
      <div className="flex-1 flex flex-col gap-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-2xl">{greeting.icon}</span>
          <div className="flex items-center gap-2 text-white">
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">
              {greeting.text},
            </h1>
            
            <AnimatePresence mode="wait">
              {isEditingName ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-1.5"
                  key="edit-form"
                >
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') {
                        setNameInput(userName);
                        setIsEditingName(false);
                      }
                    }}
                    className="px-2 py-0.5 text-base md:text-lg border-b-2 border-indigo-500 bg-white/5 text-white focus:outline-none rounded font-medium max-w-[150px] transition-all"
                    autoFocus
                    maxLength={20}
                  />
                  <button 
                    onClick={handleSaveName}
                    className="p-1 hover:bg-white/5 text-emerald-400 rounded-lg transition-colors cursor-pointer"
                    title="Simpan nama"
                  >
                    <Check size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-1 group"
                  key="display-name"
                >
                  <span className="text-2xl md:text-3xl font-serif italic text-indigo-300 relative">
                    {userName}
                  </span>
                  <button 
                    onClick={() => {
                      setNameInput(userName);
                      setIsEditingName(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer inline-flex items-center"
                    title="Ubah nama"
                  >
                    <Edit2 size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Date Section */}
        <div className="flex flex-wrap items-center gap-3 text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-500" />
            {formatDateIndo(currentTime)}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-500" />
            Pukul <span className="font-mono font-bold text-indigo-200 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">{currentTime.toLocaleTimeString('id-ID')}</span>
          </span>
        </div>

        {/* Motivational Quotes Banner */}
        <div 
          onClick={handleNextQuote}
          className="mt-2 text-xs md:text-sm text-slate-400 bg-white/5 p-3.5 rounded-2xl border border-white/10 hover:border-indigo-500/30 flex items-start gap-2.5 transition-all cursor-pointer group hover:bg-white/10 relative max-w-2xl select-none"
          title="Klik untuk ganti kutipan motivasi"
        >
          <Quote size={16} className="text-slate-500 group-hover:text-indigo-350 transition-colors shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="italic leading-relaxed">"{selectedQuote.text}"</p>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
              <Sparkles size={10} className="text-indigo-400 shrink-0" />
              — {selectedQuote.author}
            </p>
          </div>
        </div>
      </div>

      {/* Styled Clock Display Widget */}
      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 gap-4 shrink-0 relative z-10">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Waktu Saat Ini</p>
          <p className="text-4xl md:text-5xl font-light tracking-tighter text-white font-mono tabular-nums">
            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">Zona Waktu: WIB (GMT+7)</p>
        </div>
      </div>
    </div>
  );
}
