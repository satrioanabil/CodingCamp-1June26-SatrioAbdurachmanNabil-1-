import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Square, Trash2, Plus, Calendar, Tag, Check, Filter, Layers, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

export function TodoCard() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('productiv_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse tasks storage", e);
      }
    }
    // Preseed default Indonesian productivity tasks
    return [
      {
        id: 'task-1',
        text: 'Selesaikan sesi fokus 25 menit menggunakan Focus Timer pagi ini',
        completed: false,
        createdAt: Date.now() - 3600000 * 2,
        category: 'Belajar',
        priority: 'high'
      },
      {
        id: 'task-2',
        text: 'Buat perencanaan target harian sebelum mulai beraktivitas',
        completed: true,
        createdAt: Date.now() - 3600000 * 5,
        category: 'Kerja',
        priority: 'medium'
      },
      {
        id: 'task-3',
        text: 'Minum segelas air putih hangat demi menjaga hidrasi tubuh',
        completed: false,
        createdAt: Date.now() - 1800000,
        category: 'Kesehatan',
        priority: 'low'
      }
    ];
  });

  const [inputVal, setInputVal] = useState<string>('');
  const [category, setCategory] = useState<string>('Kerja');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const categories = ['Kerja', 'Pribadi', 'Belajar', 'Kesehatan'];

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('productiv_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = inputVal.trim();
    if (!cleanText) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: cleanText,
      completed: false,
      createdAt: Date.now(),
      category,
      priority
    };

    setTasks([newTask, ...tasks]);
    setInputVal('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityBadge = (p: 'low' | 'medium' | 'high') => {
    switch (p) {
      case 'high':
        return <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">Tinggi</span>;
      case 'medium':
        return <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">Sedang</span>;
      case 'low':
      default:
        return <span className="text-[10px] bg-slate-900/40 text-slate-400 border border-slate-500/15 px-2 py-0.5 rounded-full font-bold">Rendah</span>;
    }
  };

  const getCategoryColor = (cat: string): string => {
    switch (cat) {
      case 'Kerja': return 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300';
      case 'Pribadi': return 'bg-purple-950/40 border-purple-500/20 text-purple-300';
      case 'Belajar': return 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300';
      case 'Kesehatan': return 'bg-pink-950/40 border-pink-500/20 text-pink-300';
      default: return 'bg-slate-900/40 border-slate-500/15 text-slate-350';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'active') return !task.completed;
    if (activeTab === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div id="todo-list-container" className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 backdrop-blur-md">
      
      {/* Container Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-indigo-400 shrink-0" size={20} />
          <h2 className="font-serif italic text-white text-xl tracking-tight">Daftar Tugas</h2>
          <span className="text-xs bg-indigo-550/20 text-indigo-300 border border-indigo-500/15 px-2 py-0.5 rounded-full font-bold font-mono">
            {activeCount} Aktif
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 p-1 rounded-xl self-start sm:self-auto border border-white/10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Semua ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'active' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Aktif ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'completed' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Selesai ({completedCount})
          </button>
        </div>
      </div>

      {/* Simplified Addition Form */}
      <form onSubmit={handleAddTask} className="flex flex-col gap-3.5 bg-white/5 p-4 border border-white/10 rounded-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Tambah tugas baru..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium"
            maxLength={100}
          />
          <button
            type="submit"
            className="p-3 bg-white text-black hover:bg-slate-200 rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-200 hover:scale-[1.03] active:scale-95 shrink-0 cursor-pointer text-xs font-bold"
            title="Tambah tugas"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Categories & Priorities Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Category Badges Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1 shrink-0">
              <Tag size={12} /> Kategori:
            </span>
            <div className="flex gap-1 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer text-[11px] ${
                    category === cat
                      ? 'bg-indigo-600/90 text-white border-indigo-500/50 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Levels Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
              Prioritas:
            </span>
            <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2.5 py-0.5 rounded-md font-semibold transition-all capitalize cursor-pointer text-[11px] ${
                    priority === p
                      ? p === 'high' ? 'bg-red-500 text-white' : p === 'medium' ? 'bg-amber-600/80 text-white' : 'bg-slate-650 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p === 'high' ? 'Tinggi' : p === 'medium' ? 'Sedang' : 'Rendah'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* Task List Grid with animated entrances */}
      <div id="todo-tasks-scroll-area" className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 flex flex-col items-center gap-3 bg-white/5 border border-dashed border-white/10 rounded-2xl"
            >
              <CheckCircle2 size={36} className="text-slate-600" />
              <div>
                <p className="text-slate-400 text-sm font-semibold">Tidak ada tugas dalam kategori ini</p>
                <p className="text-slate-500 text-xs mt-0.5">Mulai isi daftar tugas harian Anda di atas!</p>
              </div>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                id={`task-item-${task.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  task.completed 
                    ? 'bg-white/5 border-white/5 text-slate-500' 
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-200'
                }`}
              >
                {/* Checkbox Trigger + Label */}
                <div className="flex-1 flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 cursor-pointer shrink-0 transition-transform hover:scale-105 active:scale-95 text-indigo-400"
                    title={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
                  >
                    {task.completed ? (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-black font-bold flex-shrink-0">
                        ✓
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex-shrink-0 bg-transparent hover:bg-indigo-500/10" />
                    )}
                  </button>

                  <div className="flex-1">
                    <p className={`text-sm font-semibold leading-relaxed break-words ${task.completed ? 'line-through text-slate-500 font-normal' : 'text-slate-200'}`}>
                      {task.text}
                    </p>
                    
                    {/* Metadata Badges */}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                </div>

                {/* Garbage Delete Action */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all cursor-pointer self-start"
                  title="Hapus tugas"
                >
                  <Trash2 size={15} />
                </button>

              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Progress overview */}
      {tasks.length > 0 && (
        <div className="mt-2 border-t border-white/10 pt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Kemajuan Harian</span>
            <span>{Math.round((completedCount / tasks.length) * 100)}% Selesai</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
            <motion.div
              className="bg-indigo-505 bg-indigo-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
