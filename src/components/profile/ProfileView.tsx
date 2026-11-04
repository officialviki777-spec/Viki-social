import React, { useState, useMemo } from 'react';
import { Settings, Grid, Bookmark, Film, ExternalLink, Heart, MessageCircle, ArrowLeft, Plus, MoreVertical, ShieldAlert, Ban, Globe } from 'lucide-react';
import { Post, User, Story, StoryHighlight, Reel } from '../../types';
import { db } from '../../services/db';
import { EditProfileModal } from './EditProfileModal';
import { FollowListModal } from './FollowListModal';
import { CreateHighlightModal } from './CreateHighlightModal';

interface ProfileViewProps {
  currentUser: User;
  profileUserId?: string;
  onBack?: () => void;
  onOpenSettings: () => void;
  onSelectPost: (post: Post) => void;
  onOpenDirectChat?: (userId: string) => void;
  onProfileUpdated: () => void;
  onOpenHighlightStories?: (stories: Story[], title: string) => void;
  onOpenUserStories?: (stories: Story[]) => void;
  isDark: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  profileUserId,
  onBack,
  onOpenSettings,
  onSelectPost,
  onOpenDirectChat,
  onProfileUpdated,
  onOpenHighlightStories,
  onOpenUserStories,
  isDark,
}) => {
  const isOwnProfile = !profileUserId || profileUserId === currentUser.id;
  const user = isOwnProfile ? currentUser : db.getUserById(profileUserId!) || currentUser;

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowList, setShowFollowList] = useState<{ title: string; ids: string[] } | null>(null);
  const [showCreateHighlightModal, setShowCreateHighlightModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate content or behavior');
  const [showToast, setShowToast] = useState<string | null>(null);

  const allPosts = useMemo(() => db.getPosts(), []);
  const allReels = useMemo(() => db.getReels(), []);

  const highlights = useMemo(() => {
    return db.getHighlights(user.id);
  }, [user.id, user.savedPostIds]);

  const userActiveStories = useMemo(() => {
    return db.getUserActiveStories(user.id);
  }, [user.id]);

  const userPosts = useMemo(() => {
    return allPosts.filter(p => p.userId === user.id);
  }, [allPosts, user.id]);

  const userReels = useMemo(() => {
    return allReels.filter(r => r.userId === user.id);
  }, [allReels, user.id]);

  const savedPosts = useMemo(() => {
    return allPosts.filter(p => user.savedPostIds?.includes(p.id));
  }, [allPosts, user.savedPostIds]);

  const isFollowing = currentUser.following?.includes(user.id);
  const isBlocked = currentUser.blockedUserIds?.includes(user.id);

  const handleToggleFollow = () => {
    db.toggleFollow(user.id, currentUser.id);
    onProfileUpdated();
  };

  const handleToggleBlock = () => {
    const blocked = db.toggleBlockUser(currentUser.id, user.id);
    setShowOptionsMenu(false);
    onProfileUpdated();
    setShowToast(blocked ? `@${user.username} has been blocked.` : `@${user.username} is unblocked.`);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    db.reportContent(currentUser.id, 'user', user.id, reportReason);
    setShowReportModal(false);
    setShowOptionsMenu(false);
    setShowToast('Report submitted for admin review. Thank you for keeping VIKI safe.');
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleOpenHighlight = (hl: StoryHighlight) => {
    const hlStories = hl.storyIds
      .map(id => db.getStoryById(id))
      .filter((s): s is Story => Boolean(s));

    if (hlStories.length > 0 && onOpenHighlightStories) {
      onOpenHighlightStories(hlStories, hl.title);
    } else {
      setShowToast('No stories in this highlight');
      setTimeout(() => setShowToast(null), 2000);
    }
  };

  return (
    <div className="w-full pb-16 select-none">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-16 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold shadow-xl">
            {showToast}
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div
        className={`sticky top-14 z-20 h-12 px-4 border-b flex items-center justify-between backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#08080C]/90 border-zinc-800 text-zinc-100'
            : 'bg-white/95 border-zinc-200 text-zinc-900'
        }`}
      >
        <div className="flex items-center gap-3">
          {!isOwnProfile && onBack && (
            <button onClick={onBack} className="p-1 hover:text-cyan-400" aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-1.5 font-extrabold text-sm tracking-tight">
            <span>@{user.username}</span>
            {user.isVerified && (
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[9px] font-black">
                ✓
              </span>
            )}
            {user.isPrivate && (
              <span className="text-[10px] text-zinc-400">🔒</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isOwnProfile ? (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowOptionsMenu(prev => !prev)}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showOptionsMenu && (
                <div className="absolute right-0 top-10 w-44 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1.5 z-30 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setShowOptionsMenu(false);
                      setShowReportModal(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-400 hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Report User</span>
                  </button>
                  <button
                    onClick={handleToggleBlock}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    <span>{isBlocked ? 'Unblock User' : 'Block User'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cover Photo Banner */}
      <div className="relative w-full h-32 bg-zinc-900 overflow-hidden">
        <img
          src={user.coverImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80'}
          alt="cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-black/30" />
      </div>

      {/* Profile Details & Stats */}
      <div className="px-4 pb-4 -mt-12 space-y-3 relative z-10">
        <div className="flex items-end justify-between gap-4">
          {/* Avatar with cyan active status */}
          <div className="relative">
            <div
              onClick={() => {
                if (userActiveStories.length > 0 && onOpenUserStories) {
                  onOpenUserStories(userActiveStories);
                }
              }}
              className={`w-22 h-22 rounded-full p-[3px] transition-transform active:scale-95 shadow-xl ${
                userActiveStories.length > 0
                  ? 'bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] cursor-pointer ring-2 ring-cyan-400/40'
                  : 'bg-zinc-800'
              }`}
            >
              <div className="w-full h-full rounded-full p-0.5 bg-[#08080C] overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            {user.isOnline && user.showOnlineStatus !== false && (
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#08080C]" title="Online now" />
            )}
          </div>

          {/* Stats counts */}
          <div className="flex-1 flex items-center justify-around text-center pt-8">
            <div>
              <span className="block font-black text-sm tracking-tight text-white">
                {userPosts.length}
              </span>
              <span className="text-[11px] text-zinc-500">posts</span>
            </div>
            <button
              onClick={() =>
                setShowFollowList({
                  title: 'Followers',
                  ids: user.followers || [],
                })
              }
              className="hover:opacity-80"
            >
              <span className="block font-black text-sm tracking-tight text-white">
                {user.followers?.length || 0}
              </span>
              <span className="text-[11px] text-zinc-500">followers</span>
            </button>
            <button
              onClick={() =>
                setShowFollowList({
                  title: 'Following',
                  ids: user.following || [],
                })
              }
              className="hover:opacity-80"
            >
              <span className="block font-black text-sm tracking-tight text-white">
                {user.following?.length || 0}
              </span>
              <span className="text-[11px] text-zinc-500">following</span>
            </button>
          </div>
        </div>

        {/* Bio & Country Section */}
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white">
              {user.fullName}
            </span>
            {user.country && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-zinc-300">
                <Globe className="w-3 h-3 text-cyan-400" />
                {user.country}
              </span>
            )}
          </div>

          <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
            {user.bio}
          </p>

          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1 mt-0.5"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{user.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {isOwnProfile ? (
            <>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 py-2 rounded-xl font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  setShowToast('Profile URL copied to clipboard!');
                  setTimeout(() => setShowToast(null), 2000);
                }}
                className="flex-1 py-2 rounded-xl font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 transition-colors"
              >
                Share Profile
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleToggleFollow}
                className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                  isFollowing
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black shadow-lg shadow-[#0066FF]/25'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={() => onOpenDirectChat && onOpenDirectChat(user.id)}
                className="flex-1 py-2 rounded-xl font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 transition-colors"
              >
                Message
              </button>
            </>
          )}
        </div>

        {/* Story Highlights */}
        <div className="pt-2">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
            {isOwnProfile && (
              <div
                onClick={() => setShowCreateHighlightModal(true)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-cyan-400/50 group-hover:border-cyan-400 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-zinc-900">
                    <Plus className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
                  </div>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">New</span>
              </div>
            )}

            {highlights.map(hl => (
              <div
                key={hl.id}
                onClick={() => handleOpenHighlight(hl)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] shadow-sm">
                  <div className="w-full h-full rounded-full p-0.5 overflow-hidden bg-[#08080C]">
                    <img
                      src={hl.coverUrl}
                      alt={hl.title}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-zinc-300 truncate max-w-[66px]">
                  {hl.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Tabs: Posts, Reels, Saved */}
      <div className="border-t border-zinc-800 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-all ${
            activeTab === 'posts'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          aria-label="Posts grid"
        >
          <Grid className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-all ${
            activeTab === 'reels'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
          aria-label="Reels grid"
        >
          <Film className="w-5 h-5" />
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-all ${
              activeTab === 'saved'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
            aria-label="Saved posts"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Grid Content */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-3 gap-0.5">
          {userPosts.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-zinc-500 text-xs">
              No posts yet.
            </div>
          ) : (
            userPosts.map(post => (
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
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    {post.likes.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    {post.comments.length}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-3 gap-0.5">
          {userReels.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-zinc-500 text-xs">
              No reels created yet.
            </div>
          ) : (
            userReels.map(reel => (
              <div
                key={reel.id}
                className="aspect-[9/16] bg-zinc-900 relative group cursor-pointer overflow-hidden"
              >
                <video
                  src={reel.videoUrl}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[11px] font-bold drop-shadow">
                  <Heart className="w-3 h-3 fill-white" />
                  {reel.likes.length}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-3 gap-0.5">
          {savedPosts.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-zinc-500 text-xs">
              No saved posts yet. Tap bookmark on any post to save here.
            </div>
          ) : (
            savedPosts.map(post => (
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
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          currentUser={user}
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={onProfileUpdated}
          isDark={isDark}
        />
      )}

      {showFollowList && (
        <FollowListModal
          title={showFollowList.title}
          userIds={showFollowList.ids}
          currentUser={currentUser}
          onClose={() => setShowFollowList(null)}
          onSelectUser={(uid) => {
            setShowFollowList(null);
            if (profileUserId !== uid) {
              // Open that user
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          isDark={isDark}
        />
      )}

      {showCreateHighlightModal && (
        <CreateHighlightModal
          currentUser={currentUser}
          onClose={() => setShowCreateHighlightModal(false)}
          onHighlightCreated={onProfileUpdated}
          isDark={isDark}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#08080C] border border-zinc-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Report @{user.username}
            </h3>
            <p className="text-xs text-zinc-400">
              Why are you reporting this account to VIKI administrators?
            </p>
            <div className="space-y-2">
              {[
                'Spam or fake account',
                'Inappropriate photos or content',
                'Harassment or hate speech',
                'Misinformation',
              ].map(reason => (
                <label key={reason} className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="radio"
                    name="report_reason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="accent-cyan-400"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                className="flex-1 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
