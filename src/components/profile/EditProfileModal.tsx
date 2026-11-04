import React, { useState, useRef } from 'react';
import { Camera, Check, Image as ImageIcon } from 'lucide-react';
import { User } from '../../types';
import { db, COUNTRIES } from '../../services/db';
import { mediaStorage } from '../../services/indexedDb';

interface EditProfileModalProps {
  currentUser: User;
  onClose: () => void;
  onProfileUpdated: () => void;
  isDark: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  onClose,
  onProfileUpdated,
  isDark,
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [coverImage, setCoverImage] = useState(currentUser.coverImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80');
  const [country, setCountry] = useState(currentUser.country || 'India');
  const [countryCode, setCountryCode] = useState(currentUser.countryCode || 'IN');
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivate || false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(currentUser.showOnlineStatus !== false);
  const [isSaved, setIsSaved] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const mediaId = `avatar_${Date.now()}_${currentUser.id}`;
      const url = await mediaStorage.saveMedia(mediaId, file);
      setAvatar(url);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setAvatar(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const mediaId = `cover_${Date.now()}_${currentUser.id}`;
      const url = await mediaStorage.saveMedia(mediaId, file);
      setCoverImage(url);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setCoverImage(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateProfile(currentUser.id, {
      fullName: fullName.trim(),
      username: username.trim().toLowerCase().replace(/^@/, ''),
      bio: bio.trim(),
      website: website.trim(),
      avatar,
      coverImage,
      country,
      countryCode,
      isPrivate,
      showOnlineStatus,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onProfileUpdated();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <div
        className={`w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border transition-colors ${
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
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
          <h3 className="font-bold text-sm tracking-tight text-white">Edit Profile</h3>
          <button
            onClick={handleSave}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : 'Save'}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* Cover & Avatar Zone */}
          <div className="relative mb-6">
            {/* Cover photo */}
            <div
              onClick={() => coverInputRef.current?.click()}
              className="w-full h-28 rounded-2xl overflow-hidden relative group cursor-pointer border border-zinc-800"
            >
              <img
                src={coverImage}
                alt="cover"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Change Cover</span>
                </div>
              </div>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />

            {/* Avatar overlapping */}
            <div
              onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-5 left-4 group cursor-pointer"
            >
              <div className="w-18 h-18 rounded-full overflow-hidden ring-3 ring-cyan-400 bg-zinc-950 relative shadow-xl">
                <img
                  src={avatar}
                  alt={username}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="pt-2 text-[11px] text-zinc-400">
            Tap the cover or avatar image to upload from your gallery.
          </div>

          {/* Full Name */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs text-zinc-500">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Country
            </label>
            <select
              value={countryCode}
              onChange={(e) => {
                const found = COUNTRIES.find(c => c.code === e.target.value);
                if (found) {
                  setCountry(found.name);
                  setCountryCode(found.code);
                }
              }}
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-400 focus:outline-none"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={150}
              className="w-full p-3 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-400 focus:outline-none resize-none"
            />
            <span className="text-[10px] text-zinc-500 block text-right">
              {bio.length}/150
            </span>
          </div>

          {/* Website Link */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Privacy Toggles */}
          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Private Account</span>
                <span className="text-[10px] text-zinc-400 block">Only approved followers can see your posts</span>
              </div>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={e => setIsPrivate(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Show Online Status</span>
                <span className="text-[10px] text-zinc-400 block">Allow friends to see when you are active</span>
              </div>
              <input
                type="checkbox"
                checked={showOnlineStatus}
                onChange={e => setShowOnlineStatus(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
