import React, { useState } from 'react';
import { X, Lock, Bell, Moon, Sun, Smartphone, RefreshCw, LogOut, Shield, UserCheck, ChevronRight, Check, Download, Globe, Trash2, Key } from 'lucide-react';
import { User } from '../../types';
import { db } from '../../services/db';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { firebaseConfig } from '../../services/firebase';

interface SettingsModalProps {
  currentUser: User;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onSwitchUser: (userId: string) => void;
  onLogout: () => void;
  onResetData: () => void;
  onOpenAdmin?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  onClose,
  isDark,
  onToggleTheme,
  isDeviceFrame,
  onToggleDeviceFrame,
  onSwitchUser,
  onLogout,
  onResetData,
  onOpenAdmin,
}) => {
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivate || false);
  const [showOnline, setShowOnline] = useState(currentUser.showOnlineStatus !== false);
  const [allowDMs, setAllowDMs] = useState(true);
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [showSwitchAccounts, setShowSwitchAccounts] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passUpdated, setPassUpdated] = useState(false);

  const allUsers = db.getUsers();

  const handleTogglePrivate = () => {
    const nextVal = !isPrivate;
    setIsPrivate(nextVal);
    db.updateProfile(currentUser.id, { isPrivate: nextVal });
  };

  const handleToggleOnline = () => {
    const nextVal = !showOnline;
    setShowOnline(nextVal);
    db.updateProfile(currentUser.id, { showOnlineStatus: nextVal });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length >= 4) {
      db.updateProfile(currentUser.id, { password: newPassword.trim() });
      setPassUpdated(true);
      setTimeout(() => {
        setPassUpdated(false);
        setShowChangePass(false);
        setNewPassword('');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <div
        className={`w-full max-w-md max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl border flex flex-col transition-colors ${
          isDark
            ? 'bg-[#08080C] border-zinc-800 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-100 bg-zinc-50'
          }`}
        >
          <div className="w-5" />
          <h3 className="font-extrabold text-sm tracking-tight text-white">Settings & Privacy</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-xs">
          {/* Admin shortcut button */}
          {onOpenAdmin && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-900/40 via-cyan-950/40 to-blue-900/40 border border-cyan-500/30 text-white flex items-center justify-between hover:border-cyan-400 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs text-cyan-300 block">Admin Control Panel</span>
                  <span className="text-[10px] text-zinc-400">User management, moderation & stats</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Section: Firebase Hosting & Deployment Live Info */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Firebase Deployment</span>
            </h4>

            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-semibold">Firebase Project:</span>
                <span className="font-mono text-cyan-300 font-bold">viki-social-app</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-semibold">Live Web URL:</span>
                <a
                  href="https://viki-social-app.web.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-mono text-[11px] font-bold"
                >
                  viki-social-app.web.app ↗
                </a>
              </div>
              <p className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/80 leading-relaxed">
                Automated continuous deployment is set up via GitHub Actions.
              </p>
            </div>
          </div>

          {/* Section: Privacy & Security */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Privacy & Security</span>
            </h4>

            <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              {/* Private Account */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-white">Private Account</span>
                  <span className="text-[11px] text-zinc-400">Only approved followers can see your posts.</span>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePrivate}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isPrivate ? 'bg-cyan-500 justify-end' : 'bg-zinc-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-black shadow-md" />
                </button>
              </div>

              {/* Show Online Status */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div>
                  <span className="font-semibold block text-white">Active Online Status</span>
                  <span className="text-[11px] text-zinc-400">Show a green indicator when you are active.</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleOnline}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    showOnline ? 'bg-cyan-500 justify-end' : 'bg-zinc-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-black shadow-md" />
                </button>
              </div>

              {/* Change Password */}
              <div className="pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowChangePass(!showChangePass)}
                  className="w-full flex items-center justify-between text-left text-zinc-300 hover:text-white"
                >
                  <span className="font-semibold">Change Password</span>
                  <Key className="w-4 h-4 text-cyan-400" />
                </button>

                {showChangePass && (
                  <form onSubmit={handleSavePassword} className="mt-2.5 space-y-2">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 4 chars)"
                      required
                      className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-bold text-xs"
                    >
                      {passUpdated ? 'Password Updated!' : 'Update Password'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Section: Display & Appearance */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Appearance</span>
            </h4>

            <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-white">
                    {isDark ? 'Electric Dark Theme' : 'Light Theme'}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Electric Blue, Cyan & Deep Black
                  </span>
                </div>
                <button
                  onClick={onToggleTheme}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold hover:bg-cyan-500/20 flex items-center gap-1.5"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>Toggle</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div>
                  <span className="font-semibold block text-white">
                    Android Phone Mockup Frame
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    View with Android status bar and gesture pill
                  </span>
                </div>
                <button
                  onClick={onToggleDeviceFrame}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isDeviceFrame ? 'bg-cyan-500 justify-end' : 'bg-zinc-700 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-black shadow-md" />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Mobile App & PWA */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Install VIKI SOCIAL</span>
            </h4>
            <PWAInstallButton variant="card" />
          </div>

          {/* Section: Switch Account */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Switch Account</span>
              </h4>
              <button
                onClick={() => setShowSwitchAccounts(!showSwitchAccounts)}
                className="text-[11px] text-cyan-400 hover:underline font-bold"
              >
                {showSwitchAccounts ? 'Hide' : 'Switch'}
              </button>
            </div>

            {showSwitchAccounts && (
              <div className="p-2 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                {allUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u.id);
                      onClose();
                    }}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'hover:bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.username}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs">@{u.username}</span>
                    </div>
                    {u.id === currentUser.id && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section: Danger Zone & Logout */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            {confirmReset ? (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                <p className="font-bold text-xs">Reset posts, reels, and stories back to fresh defaults?</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onResetData();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 font-medium text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full p-3 rounded-2xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/40 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-zinc-400" />
                  <span className="font-semibold">Reset Demo Database</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>
            )}

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full p-3 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center justify-between transition-colors font-bold"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Log Out (@{currentUser.username})</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
