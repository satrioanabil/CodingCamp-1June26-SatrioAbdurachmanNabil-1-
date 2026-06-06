import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, ExternalLink, Plus, Trash2, Globe, Search, Mail, Calendar, HelpCircle, X, Compass } from 'lucide-react';
import { QuickLink } from '../types';

export function QuickLinksCard() {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('productiv_quick_links');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse quick links localstorage schema", e);
      }
    }
    // Pre-seeded required links: Google, Gmail, Kalender
    return [
      {
        id: '1',
        title: 'Google Search',
        url: 'https://www.google.com',
        iconName: 'search',
        clickCount: 0,
        isCustom: false
      },
      {
        id: '2',
        title: 'Gmail Inbox',
        url: 'https://mail.google.com',
        iconName: 'mail',
        clickCount: 0,
        isCustom: false
      },
      {
        id: '3',
        title: 'Google Calendar',
        url: 'https://calendar.google.com',
        iconName: 'calendar',
        clickCount: 0,
        isCustom: false
      }
    ];
  });

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [newIcon, setNewIcon] = useState<string>('globe');

  // Sync to local data persistence
  useEffect(() => {
    localStorage.setItem('productiv_quick_links', JSON.stringify(links));
  }, [links]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = newTitle.trim();
    let cleanUrl = newUrl.trim();
    if (!cleanTitle || !cleanUrl) return;

    // Help prepending http protocols if missing
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const newLink: QuickLink = {
      id: `link-${Date.now()}`,
      title: cleanTitle,
      url: cleanUrl,
      iconName: newIcon,
      clickCount: 0,
      isCustom: true
    };

    setLinks([...links, newLink]);
    setNewTitle('');
    setNewUrl('');
    setNewIcon('globe');
    setShowAddForm(false);
  };

  const deleteLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering navigation
    if (window.confirm("Hapus tautan cepat ini?")) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  const incrementClick = (id: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, clickCount: l.clickCount + 1 } : l));
  };

  // Rendering Helper for Icons
  const renderIcon = (name: string) => {
    const classes = "w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110";
    switch (name) {
      case 'search':
        return <Search className={`${classes} text-blue-400`} />;
      case 'mail':
        return <Mail className={`${classes} text-red-400`} />;
      case 'calendar':
        return <Calendar className={`${classes} text-emerald-400`} />;
      case 'compass':
        return <Compass className={`${classes} text-indigo-400`} />;
      case 'globe':
      default:
        return <Globe className={`${classes} text-purple-400`} />;
    }
  };

  const getPresetConfig = (name: string) => {
    return 'bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/10/80 text-slate-200 transition-all';
  };

  return (
    <div id="quick-links-container" className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 backdrop-blur-md">
      
      {/* Container Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link className="text-indigo-400 shrink-0" size={19} />
          <h2 className="font-serif italic text-white text-xl tracking-tight">Tautan Cepat</h2>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`p-2 rounded-xl transition-all cursor-pointer ${showAddForm ? 'bg-white/10 text-white border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          title="Tambah tautan cepat baru"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* Dynamic Link Add Modals/Forms */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3"
          >
            <form onSubmit={handleAddLink} className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                Tambah Tautan Baru
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nama situs (misal: YouTube)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 bg-white/5 text-white placeholder-slate-500 font-medium"
                />
                
                <input
                  type="text"
                  required
                  placeholder="URL situs (misal: www.youtube.com)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 bg-white/5 text-white placeholder-slate-500 font-medium"
                />
              </div>

              {/* Icon Picker Block */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Pilih Ikon:</span>
                <div className="flex items-center gap-1">
                  {(['globe', 'compass', 'search', 'mail', 'calendar'] as const).map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewIcon(ic)}
                      className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        newIcon === ic 
                          ? 'bg-indigo-600/90 text-white border-indigo-500/50 shadow-sm' 
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {ic === 'globe' && <Globe size={13} />}
                      {ic === 'compass' && <Compass size={13} />}
                      {ic === 'search' && <Search size={13} />}
                      {ic === 'mail' && <Mail size={13} />}
                      {ic === 'calendar' && <Calendar size={13} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer border border-white/10 hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-black bg-white hover:bg-slate-200 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Tambah
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookmarks Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {links.map((link) => (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => incrementClick(link.id)}
            className={`group p-4 rounded-2xl border flex items-center justify-between gap-3 text-slate-200 transition-all duration-300 hover:shadow-lg cursor-pointer ${getPresetConfig(link.iconName)}`}
            whileHover={{ y: -3 }}
            id={`quick-link-${link.id}`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Icon */}
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-3xs flex items-center justify-center shrink-0">
                {renderIcon(link.iconName)}
              </div>
              {/* Site Details */}
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-slate-200 transition-colors group-hover:text-white leading-tight">
                  {link.title}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {link.url.replace(/^https?:\/\/(www\.)?/i, '')}
                </p>
              </div>
            </div>

            {/* Hover Actions: External link indicator or Garbage trash for custom */}
            <div className="shrink-0 flex items-center gap-1.5">
              {link.isCustom ? (
                <button
                  onClick={(e) => deleteLink(link.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                  title="Hapus bookmark"
                >
                  <Trash2 size={13} />
                </button>
              ) : (
                <ExternalLink size={13} className="text-slate-500 group-hover:text-slate-300 group-hover:scale-110 transition-all shrink-0" />
              )}
            </div>
          </motion.a>
        ))}
      </div>

    </div>
  );
}
