import React, { useState, useMemo } from 'react';
import { Search, X, User as UserIcon, Hash, Heart, MessageCircle, Globe } from 'lucide-react';
import { Post, User } from '../../types';
import { db } from '../../services/db';

interface ExploreViewProps {
  currentUser: User;
  onSelectPost: (post: Post) => void;
  onOpenProfile: (userId: string) => void;
  isDark: boolean;
}

const TRENDING_TAGS = [
  'vikisocial',
  'electricblue',
  'cyanvibes',
  'mumbai',
  'dubai',
  'reels',
  'nightcity',
  'cinematic',
  'android',
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  currentUser,
  onSelectPost,
  onOpenProfile,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'accounts' | 'tags'>('all');

  const allPosts = useMemo(() => db.getPosts(), []);
  const allUsers = useMemo(() => db.getUsers(), []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().replace(/^@/, '');
    return allUsers.filter(
      u =>
        u.username.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q)
    );
  }, [allUsers, searchQuery]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    if (selectedTag) {
      return allPosts.filter(p => p.tags?.includes(selectedTag.toLowerCase()));
    }
    if (!searchQuery.trim()) {
      return allPosts;
    }
    const q = searchQuery.toLowerCase();
    return allPosts.filter(
      p =>
        p.caption.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q.replace(/^#/, ''))) ||
        p.location?.toLowerCase().includes(q)
    );
  }, [allPosts, searchQuery, selectedTag]);

  return (
    <div className="w-full pb-16 select-none">
      {/* 1. Search Bar */}
      <div
        className={`sticky top-14 z-20 px-4 py-3 border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#08080C]/90 border-zinc-800'
            : 'bg-white/95 border-zinc-200'
        }`}
      >
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all ${
            isDark
              ? 'bg-zinc-900 border-zinc-800 focus-within:border-cyan-400'
              : 'bg-zinc-100 border-zinc-200 focus-within:border-cyan-600'
          }`}
        >
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedTag(null);
            }}
            placeholder="Search accounts, #hashtags, or country..."
            className={`w-full bg-transparent text-xs focus:outline-none placeholder-zinc-500 ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs when searching */}
        {searchQuery.trim() && (
          <div className="flex items-center gap-2 mt-2.5">
            {[
              { id: 'all', label: 'Top' },
              { id: 'accounts', label: 'Accounts' },
              { id: 'tags', label: 'Tags' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'accounts' | 'tags')}
                className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Trending Tags Carousel */}
        {!searchQuery.trim() && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5">
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-2.5 py-1 rounded-xl bg-cyan-400 text-black text-[11px] font-black flex items-center gap-1 shrink-0"
              >
                <span>Clear: #{selectedTag}</span>
                <X className="w-3 h-3" />
              </button>
            )}
            {TRENDING_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black shadow-md'
                    : 'bg-zinc-900 text-zinc-300 hover:text-cyan-400 border border-zinc-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Search Results View */}
      {searchQuery.trim() ? (
        <div className="p-4 space-y-4">
          {/* User Results */}
          {(activeTab === 'all' || activeTab === 'accounts') && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Accounts
              </span>
              {filteredUsers.length === 0 ? (
                <div className="text-zinc-500 text-xs py-2">No matching accounts found</div>
              ) : (
                <div className="divide-y divide-zinc-800/80 rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => onOpenProfile(user.id)}
                      className="p-3 flex items-center justify-between hover:bg-zinc-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-cyan-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-white">@{user.username}</span>
                            {user.isVerified && <span className="text-cyan-400 text-xs">✓</span>}
                          </div>
                          <span className="text-[11px] text-zinc-400">
                            {user.fullName} {user.country ? `• ${user.country}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-cyan-400 font-bold hover:underline">
                        View
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Posts Grid for Search */}
          {(activeTab === 'all' || activeTab === 'tags') && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Posts ({filteredPosts.length})
              </span>
              {filteredPosts.length === 0 ? (
                <div className="text-zinc-500 text-xs py-2">No matching posts found</div>
              ) : (
                <div className="grid grid-cols-3 gap-0.5 rounded-2xl overflow-hidden">
                  {filteredPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => onSelectPost(post)}
                      className="aspect-square bg-zinc-900 relative group cursor-pointer overflow-hidden"
                    >
                      <img
                        src={post.mediaUrl}
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>{post.likes.length}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 3. Explore Mosaic Grid */
        <div className="grid grid-cols-3 gap-0.5">
          {filteredPosts.map((post, idx) => {
            const isLarge = idx % 9 === 1 || idx % 9 === 7;
            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className={`relative bg-zinc-900 group cursor-pointer overflow-hidden ${
                  isLarge ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                }`}
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    {post.likes.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    {post.comments.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
