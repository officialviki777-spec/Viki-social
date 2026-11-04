import React from 'react';
import { Send, Sun, Moon, Smartphone, Monitor, Heart, Shield, PlusSquare } from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { User } from '../../types';

interface TopHeaderProps {
  currentUser: User;
  isDark: boolean;
  onToggleTheme: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onOpenMessages: () => void;
  unreadMessagesCount: number;
  onOpenNotifications?: () => void;
  hasUnreadNotifications?: boolean;
  onOpenCreatePost?: () => void;
  onOpenAdmin?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  isDark,
  onToggleTheme,
  isDeviceFrame,
  onToggleDeviceFrame,
  onOpenMessages,
  unreadMessagesCount,
  onOpenNotifications,
  hasUnreadNotifications = false,
  onOpenCreatePost,
  onOpenAdmin,
}) => {
  return (
    <header
      className={`sticky top-0 z-30 h-14 px-4 flex items-center justify-between border-b backdrop-blur-xl transition-colors ${
        isDark
          ? 'bg-[#08080C]/95 border-zinc-800/80 text-white shadow-sm'
          : 'bg-white/95 border-zinc-200 text-zinc-900 shadow-sm'
      }`}
    >
      {/* Brand Zone: Custom VIKI SOCIAL Electric Blue & Cyan Logo */}
      <div className="flex items-center gap-2.5 select-none cursor-pointer">
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0066FF] via-[#0A84FF] to-[#00F0FF] p-[2px] flex items-center justify-center shadow-lg shadow-[#0066FF]/25 group">
          <div className="w-full h-full bg-[#08080C] rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#00F0FF] via-[#38BDF8] to-[#FFFFFF] font-black text-lg tracking-tighter">
              V
            </span>
            <div className="absolute inset-0 bg-[#00F0FF]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-[#0066FF] via-[#0A84FF] to-[#00F0FF] bg-clip-text text-transparent">
            VIKI
          </span>
          <span className="text-xl font-extrabold tracking-tight ml-1 text-white dark:text-white">
            SOCIAL
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] ml-1 shadow-[0_0_8px_#00F0FF] animate-pulse" />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1">
        {/* Admin Dashboard shortcut if admin */}
        {currentUser.role === 'admin' && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            title="Admin Dashboard"
            className="p-2 rounded-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
            aria-label="Admin Dashboard"
          >
            <Shield className="w-4 h-4" />
          </button>
        )}

        {/* PWA Install Button */}
        <PWAInstallButton variant="header" />

        {/* Frame Toggle */}
        <button
          onClick={onToggleDeviceFrame}
          title={isDeviceFrame ? 'Switch to Full Width View' : 'Switch to Android Frame View'}
          className={`p-2 rounded-full transition-colors ${
            isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/80' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
          aria-label="Toggle device frame"
        >
          {isDeviceFrame ? (
            <Monitor className="w-4 h-4" />
          ) : (
            <Smartphone className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`p-2 rounded-full transition-colors ${
            isDark ? 'text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800/80' : 'text-zinc-600 hover:text-blue-600 hover:bg-zinc-100'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Create Post Header Action */}
        {onOpenCreatePost && (
          <button
            onClick={onOpenCreatePost}
            title="Create Post"
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'text-zinc-300 hover:text-cyan-400 hover:bg-zinc-800/80' : 'text-zinc-700 hover:text-blue-600 hover:bg-zinc-100'
            }`}
            aria-label="Create new post"
          >
            <PlusSquare className="w-5 h-5" />
          </button>
        )}

        {/* Notifications Heart Action */}
        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            className={`relative p-2 rounded-full transition-colors ${
              isDark ? 'text-zinc-300 hover:text-cyan-400 hover:bg-zinc-800/80' : 'text-zinc-700 hover:text-blue-600 hover:bg-zinc-100'
            }`}
            aria-label="Notifications"
          >
            <Heart className="w-5 h-5" />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-[#08080C] shadow-[0_0_8px_#00F0FF]" />
            )}
          </button>
        )}

        {/* Direct Messages Icon */}
        <button
          onClick={onOpenMessages}
          className={`relative p-2 rounded-full transition-colors ${
            isDark ? 'text-zinc-200 hover:text-white hover:bg-zinc-800/80' : 'text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
          aria-label="Direct messages"
        >
          <Send className="w-5 h-5 -rotate-12" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#08080C] shadow-md">
              {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
