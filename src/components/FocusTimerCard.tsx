import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Award, Settings, Bell, Zap, Volume2, Coffee, Moon } from 'lucide-react';
import { TimerMode, TimerConfig } from '../types';

interface FocusTimerCardProps {
  onModeChange?: (mode: TimerMode) => void;
}

export function FocusTimerCard({ onModeChange }: FocusTimerCardProps) {
  // Config durations in seconds
  const [config, setConfig] = useState<TimerConfig>({
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  });

  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(config.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Custom inputs in minutes
  const [focusInput, setFocusInput] = useState<number>(25);
  const [shortInput, setShortInput] = useState<number>(5);
  const [longInput, setLongInput] = useState<number>(15);

  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    return Number(localStorage.getItem('productiv_completed_sessions') || '0');
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = mode === 'focus' ? config.focus : mode === 'shortBreak' ? config.shortBreak : config.longBreak;

  // Sync state when mode or config changes
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'focus') setTimeLeft(config.focus);
      else if (mode === 'shortBreak') setTimeLeft(config.shortBreak);
      else if (mode === 'longBreak') setTimeLeft(config.longBreak);
    }
  }, [mode, config]);

  // Pass active mode updates back to parent to change background color ambiance
  useEffect(() => {
    if (onModeChange) {
      onModeChange(mode);
    }
  }, [mode]);

  // Audio finish sound synthesis (Web Audio API)
  const playFinishChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playNote = (frequency: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      // Warm rising notes
      playNote(523.25, ctx.currentTime, 0.6); // C5
      playNote(659.25, ctx.currentTime + 0.15, 0.6); // E5
      playNote(783.99, ctx.currentTime + 0.3, 0.8); // G5
      playNote(1046.50, ctx.currentTime + 0.45, 1.2); // C6
    } catch (err) {
      console.warn("Audio playback context was blocked by user permission rules.", err);
    }
  };

  // Timer Tick Handler
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playFinishChime();
            
            // Post-timer transitions
            if (mode === 'focus') {
              const nextSessions = completedSessions + 1;
              setCompletedSessions(nextSessions);
              localStorage.setItem('productiv_completed_sessions', nextSessions.toString());
              
              // Automatically switch to short break or long break
              const shouldBeLong = nextSessions > 0 && nextSessions % 4 === 0;
              setMode(shouldBeLong ? 'longBreak' : 'shortBreak');
            } else {
              setMode('focus');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, completedSessions, soundEnabled]);

  // Control Functions
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'focus') setTimeLeft(config.focus);
    else if (mode === 'shortBreak') setTimeLeft(config.shortBreak);
    else if (mode === 'longBreak') setTimeLeft(config.longBreak);
  };

  const handleModeSwitch = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
  };

  const applyCustomSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFocus = Math.max(1, Math.min(180, focusInput)) * 60;
    const cleanShort = Math.max(1, Math.min(60, shortInput)) * 60;
    const cleanLong = Math.max(1, Math.min(60, longInput)) * 60;

    setConfig({
      focus: cleanFocus,
      shortBreak: cleanShort,
      longBreak: cleanLong,
    });
    
    setShowSettings(false);
  };

  // Time Formatter
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Styling helpers
  const getThemeColors = () => {
    switch (mode) {
      case 'shortBreak':
        return {
          theme: 'emerald',
          bg: 'bg-emerald-500/90',
          text: 'text-emerald-400',
          border: 'border-emerald-500/10',
          ring: 'text-emerald-400',
          hoverBg: 'hover:bg-emerald-500',
          softBg: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
          track: 'text-white/5',
        };
      case 'longBreak':
        return {
          theme: 'indigo',
          bg: 'bg-indigo-600/90',
          text: 'text-indigo-400',
          border: 'border-indigo-500/10',
          ring: 'text-indigo-400',
          hoverBg: 'hover:bg-indigo-500',
          softBg: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
          track: 'text-white/5',
        };
      case 'focus':
      default:
        return {
          theme: 'rose',
          bg: 'bg-indigo-500/90',
          text: 'text-indigo-400',
          border: 'border-indigo-500/10',
          ring: 'text-indigo-500',
          hoverBg: 'hover:bg-indigo-600',
          softBg: 'bg-white/5 text-white border border-white/10',
          track: 'text-white/5',
        };
    }
  };

  const colors = getThemeColors();

  // Circular calculations
  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (totalDuration - timeLeft) / totalDuration;
  const strokeDashoffset = circumference * (1 - progressPercent);

  return (
    <div id="focus-timer-container" className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 relative select-none backdrop-blur-md">
      
      {/* Top action block */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="text-indigo-400 shrink-0" size={17} />
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400">Focus Timer</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${soundEnabled ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 line-through hover:text-slate-400'}`}
            title={soundEnabled ? "Nonaktifkan suara lonceng" : "Aktifkan suara lonceng"}
          >
            <Volume2 size={18} />
          </button>

          {/* Settings Config Trigger */}
          <button
            onClick={() => {
              setFocusInput(Math.round(config.focus / 60));
              setShortInput(Math.round(config.shortBreak / 60));
              setLongInput(Math.round(config.longBreak / 60));
              setShowSettings(!showSettings);
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${showSettings ? colors.softBg : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            title="Pengaturan durasi timer"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Preset tabs selector */}
      <div className="grid grid-cols-3 gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10">
        <button
          onClick={() => handleModeSwitch('focus')}
          className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'focus' 
              ? 'bg-white/10 text-white shadow-sm font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap size={13} /> Focus
        </button>
        <button
          onClick={() => handleModeSwitch('shortBreak')}
          className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'shortBreak' 
              ? 'bg-white/10 text-white shadow-sm font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Coffee size={13} /> Rehat Pendek
        </button>
        <button
          onClick={() => handleModeSwitch('longBreak')}
          className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'longBreak' 
              ? 'bg-white/10 text-white shadow-sm font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Moon size={13} /> Rehat Panjang
        </button>
      </div>

      {/* Timer Dial and Display */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        <div className="relative w-56 h-56 flex items-center justify-center">
          
          {/* Radial circular progress diagram */}
          <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 220 220">
            {/* Background Circle channel */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              className="text-white/5"
              strokeWidth="6"
              fill="transparent"
              stroke="currentColor"
            />
            {/* Top Indicator Accent Ring */}
            <motion.circle
              cx="110"
              cy="110"
              r={radius}
              className={`${colors.ring} stroke-current transition-colors`}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ ease: "linear", duration: isRunning ? 1 : 0.4 }}
              strokeLinecap="round"
            />
          </svg>

          {/* Inner Text Widget */}
          <div className="flex flex-col items-center justify-center z-10">
            <span className="text-5xl font-extralight tracking-tighter text-white font-sans tabular-nums leading-none">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-2.5">
              {mode === 'focus' ? 'Deep Work' : 'Break Time'}
            </span>
          </div>

        </div>
      </div>

      {/* Timer Controls Row */}
      <div className="flex items-center justify-center gap-3">
        {/* Reset Button */}
        <button
          onClick={resetTimer}
          className="p-3 bg-white/5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Ulangi timer"
        >
          <RotateCcw size={17} />
        </button>

        {/* Start / Pause Button */}
        {isRunning ? (
          <button
            onClick={toggleTimer}
            className="px-8 py-3.5 border border-white/20 hover:border-white/40 hover:bg-white/10 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-white w-40"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Pause size={13} fill="currentColor" />
              <span>JEDA</span>
            </div>
          </button>
        ) : (
          <button
            onClick={toggleTimer}
            className="px-8 py-3.5 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer w-40"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Play size={13} fill="currentColor" />
              <span>MULAI</span>
            </div>
          </button>
        )}
      </div>

      {/* Stats Counter & Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Award size={18} />
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Sesi Terselesaikan</p>
            <p className="text-sm font-semibold text-slate-200">{completedSessions} Sesi Pomodoro</p>
          </div>
        </div>
        
        {/* Reset history button */}
        <button
          onClick={() => {
            if (window.confirm("Apakah Anda yakin ingin menghapus data sesi terselesaikan?")) {
              setCompletedSessions(0);
              localStorage.setItem('productiv_completed_sessions', '0');
            }
          }}
          className="text-[9px] bg-white/5 border border-white/10 text-slate-400 hover:text-white px-2.5 py-1 rounded-md tracking-wider font-semibold select-none transition-all cursor-pointer uppercase"
        >
          Hapus
        </button>
      </div>

      {/* Configuration Slider modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 pt-5 mt-2 flex flex-col gap-4 overflow-hidden"
          >
            <form onSubmit={applyCustomSettings} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                <Settings size={14} /> Atur Durasi (Menit)
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Fokus</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={focusInput}
                    onChange={(e) => setFocusInput(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-xl font-mono text-center text-sm font-bold bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Rehat Sejenak</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={shortInput}
                    onChange={(e) => setShortInput(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-xl font-mono text-center text-sm font-bold bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Rehat Lama</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={longInput}
                    onChange={(e) => setLongInput(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-white/10 rounded-xl font-mono text-center text-sm font-bold bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200/60 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-black bg-white rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
