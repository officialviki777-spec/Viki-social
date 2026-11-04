import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { User } from '../../types';
import { db } from '../../services/db';

interface FollowListModalProps {
  title: string;
  userIds: string[];
  currentUser: User;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  isDark: boolean;
}

export const FollowListModal: React.FC<FollowListModalProps> = ({
  title,
  userIds,
  currentUser,
  onClose,
  onSelectUser,
  isDark,
}) => {
  const [search, setSearch] = useState('');
  const allUsers = db.getUsers();
  const listUsers = allUsers.filter(u => userIds.includes(u.id));

  const filtered = listUsers.filter(
    u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFollow = (targetId: string) => {
    db.toggleFollow(targetId, currentUser.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-sm h-[520px] rounded-3xl overflow-hidden shadow-2xl border flex flex-col transition-colors ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'border-zinc-800' : 'border-zinc-100'
          }`}
        >
          <div className="w-5" />
          <h3 className="font-bold text-sm tracking-tight capitalize">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-zinc-800/60">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
              isDark ? 'bg-zinc-950' : 'bg-zinc-100'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-xs focus:outline-none placeholder-zinc-500"
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No users found.
            </div>
          ) : (
            filtered.map(user => {
              const isFollowing = currentUser.following.includes(user.id);
              const isSelf = currentUser.id === user.id;

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 rounded-2xl transition-colors ${
                    isDark ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-100'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectUser(user.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-1 ring-purple-500/30">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-xs truncate">
                          {user.username}
                        </span>
                        {user.isVerified && (
                          <span className="text-[10px] text-purple-400">✓</span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 block truncate">
                        {user.fullName}
                      </span>
                    </div>
                  </div>

                  {!isSelf && (
                    <button
                      onClick={() => handleToggleFollow(user.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                        isFollowing
                          ? isDark
                            ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                          : 'bg-purple-600 text-white hover:bg-purple-500'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
