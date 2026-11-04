import React from 'react';
import { Home, Search, Film, Plus } from 'lucide-react';
import { TabType, User } from '../../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentUser: User;
  hasUnreadNotifications: boolean;
  isDark: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  isDark,
}) => {
  return (
    <nav
      className={`sticky bottom-0 z-40 w-full h-14 border-t backdrop-blur-lg flex items-center justify-around px-2 select-none transition-colors ${
        isDark
          ? 'bg-[#08080C]/95 border-zinc-800 text-zinc-400'
          : 'bg-white/95 border-zinc-200 text-zinc-600'
      }`}
    >
      {/* 1. Home Tab */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
          currentTab === 'home'
            ? 'text-cyan-400'
            : isDark
            ? 'text-zinc-400 hover:text-zinc-200'
            : 'text-zinc-600 hover:text-zinc-900'
        }`}
        aria-label="Home Feed"
      >
        <Home
          className={`w-6 h-6 transition-transform ${
            currentTab === 'home' ? 'scale-110 fill-cyan-400 text-cyan-400' : ''
          }`}
        />
      </button>

      {/* 2. Search / Explore Tab */}
      <button
        onClick={() => onSelectTab('search')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
          currentTab === 'search'
            ? 'text-cyan-400'
            : isDark
            ? 'text-zinc-400 hover:text-zinc-200'
            : 'text-zinc-600 hover:text-zinc-900'
        }`}
        aria-label="Search and Explore"
      >
        <Search
          className={`w-6 h-6 transition-transform ${
            currentTab === 'search' ? 'scale-110 stroke-[2.5] text-cyan-400' : ''
          }`}
        />
      </button>

      {/* 3. Create Button (Electric Blue to Cyan Glow) */}
      <button
        onClick={() => onSelectTab('create')}
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] text-black shadow-lg shadow-[#0066FF]/30 active:scale-95 hover:shadow-[#00F0FF]/40 hover:scale-105 transition-all"
        aria-label="Create Post or Story"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* 4. Reels Tab */}
      <button
        onClick={() => onSelectTab('reels')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
          currentTab === 'reels'
            ? 'text-cyan-400'
            : isDark
            ? 'text-zinc-400 hover:text-zinc-200'
            : 'text-zinc-600 hover:text-zinc-900'
        }`}
        aria-label="Reels Short Videos"
      >
        <Film
          className={`w-6 h-6 transition-transform ${
            currentTab === 'reels' ? 'scale-110 stroke-[2.5] text-cyan-400' : ''
          }`}
        />
      </button>

      {/* 5. Profile Tab */}
      <button
        onClick={() => onSelectTab('profile')}
        className="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all"
        aria-label="Profile"
      >
        <div
          className={`w-7 h-7 rounded-full p-[2px] transition-all relative ${
            currentTab === 'profile'
              ? 'ring-2 ring-cyan-400 shadow-md shadow-cyan-400/30 scale-105'
              : 'hover:opacity-80'
          }`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover"
          />
          {currentUser.isOnline && currentUser.showOnlineStatus !== false && (
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black" />
          )}
        </div>
      </button>
    </nav>
  );
};
