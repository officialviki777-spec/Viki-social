import React, { useState } from 'react';
import { X, Search, Send, Link2, Share2, Check, Sparkles, MessageCircle } from 'lucide-react';
import { Post, User } from '../../types';
import { db } from '../../services/db';

interface ShareModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  isDark: boolean;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  post,
  currentUser,
  onClose,
  isDark,
}) => {
  const [search, setSearch] = useState('');
  const [sentUserIds, setSentUserIds] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const allUsers = db.getUsers().filter(u => u.id !== currentUser.id);

  const filteredUsers = allUsers.filter(
    u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendToUser = (targetUser: User) => {
    if (sentUserIds.includes(targetUser.id)) return;

    db.sendMessage({
      senderId: currentUser.id,
      receiverId: targetUser.id,
      text: `Shared a post by @${post.username}: "${post.caption?.slice(0, 50) || 'Photo'}"`,
      mediaUrl: post.mediaUrl,
    });

    setSentUserIds(prev => [...prev, targetUser.id]);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[85vh] transition-colors animate-fade-in ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Grab bar on mobile */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1 rounded-full bg-zinc-600/40" />
        </div>

        {/* Modal Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-100 bg-zinc-50'
          }`}
        >
          <div className="w-6" />
          <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>Share Post</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
            aria-label="Close share sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Preview Strip */}
        <div className={`p-3 border-b flex items-center gap-3 ${
          isDark ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-100 bg-zinc-50/50'
        }`}>
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-zinc-900">
            <img
              src={post.mediaUrl}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <span className="font-bold block truncate">@{post.username}</span>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
              {post.caption || 'Shared post'}
            </p>
          </div>
        </div>

        {/* Search Contacts */}
        <div className="p-3 border-b border-zinc-800/60">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl ${
              isDark ? 'bg-zinc-950 border border-zinc-800' : 'bg-zinc-100 border border-zinc-200'
            }`}
          >
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search friends to send to..."
              className="w-full bg-transparent text-xs focus:outline-none placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Friends List with 1-tap Send */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar max-h-64">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block px-1">
            Send via Direct Message
          </span>
          {filteredUsers.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">No users found.</p>
          ) : (
            filteredUsers.map(user => {
              const isSent = sentUserIds.includes(user.id);

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 rounded-2xl transition-colors ${
                    isDark ? 'hover:bg-zinc-800/60' : 'hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-purple-500/30">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-xs block text-zinc-100 dark:text-zinc-100">
                        {user.username}
                      </span>
                      <span className="text-[10px] text-zinc-400 block truncate max-w-[160px]">
                        {user.fullName}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendToUser(user)}
                    disabled={isSent}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSent
                        ? 'bg-zinc-800 text-purple-300 cursor-default'
                        : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white hover:opacity-90 active:scale-95 shadow-md shadow-purple-600/20'
                    }`}
                  >
                    {isSent ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span>Sent</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Action Buttons: Copy link, WhatsApp / External */}
        <div className={`p-3 border-t flex items-center justify-around gap-2 ${
          isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-100 bg-zinc-50'
        }`}>
          <button
            onClick={handleCopyLink}
            className={`flex-1 py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              copiedLink
                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                : isDark
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200'
                : 'bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-800'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-purple-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4 text-purple-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Post by @${post.username} on Viki Social`,
                  text: post.caption,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                handleCopyLink();
              }
            }}
            className={`flex-1 py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200'
                : 'bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-800'
            }`}
          >
            <Share2 className="w-4 h-4 text-pink-400" />
            <span>Share via...</span>
          </button>
        </div>
      </div>
    </div>
  );
};
