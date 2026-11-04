import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Check, Volume2, VolumeX, Play, Trash2 } from 'lucide-react';
import { Post, User } from '../../types';
import { db } from '../../services/db';
import { CommentsModal } from './CommentsModal';
import { ShareModal } from './ShareModal';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onPostUpdated: () => void;
  onOpenProfile?: (userId: string) => void;
  onOpenStoryByUserId?: (userId: string) => void;
  isDark: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onPostUpdated,
  onOpenProfile,
  onOpenStoryByUserId,
  isDark,
}) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser.id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isSaved, setIsSaved] = useState(currentUser.savedPostIds?.includes(post.id) || false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isExpandedCaption, setIsExpandedCaption] = useState(false);
  const [quickComment, setQuickComment] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Last tap timestamp for double-tap detection
  const [lastTap, setLastTap] = useState(0);

  const handleToggleLike = () => {
    const nextState = db.toggleLikePost(post.id, currentUser.id);
    setIsLiked(nextState);
    setLikesCount(prev => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    onPostUpdated();
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!isLiked) {
        handleToggleLike();
      }
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
    setLastTap(now);
  };

  const handleToggleSave = () => {
    const nextSaved = db.toggleSavePost(post.id, currentUser.id);
    setIsSaved(nextSaved);
    onPostUpdated();
  };

  const handleQuickCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickComment.trim()) return;
    db.addComment(post.id, currentUser.id, quickComment.trim());
    setQuickComment('');
    onPostUpdated();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setShowOptionsMenu(false);
    }, 1500);
  };

  const handleDeletePost = () => {
    setShowOptionsMenu(false);
    db.deletePost(post.id);
    onPostUpdated();
  };

  // Filter styles
  const getFilterStyle = (filter?: string) => {
    switch (filter) {
      case 'purple':
        return 'contrast(115%) saturate(135%) hue-rotate(280deg)';
      case 'cyber':
        return 'contrast(125%) saturate(160%) hue-rotate(250deg)';
      case 'sunset':
        return 'contrast(110%) saturate(130%) sepia(30%) hue-rotate(-20deg)';
      case 'monolith':
        return 'grayscale(100%) contrast(130%)';
      case 'vintage':
        return 'sepia(45%) contrast(95%) saturate(85%)';
      default:
        return 'none';
    }
  };

  return (
    <article
      className={`border-b transition-colors ${
        isDark
          ? 'bg-zinc-950 border-zinc-900/90 text-zinc-100'
          : 'bg-white border-zinc-100 text-zinc-900'
      }`}
    >
      {/* 1. Post Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              if (onOpenStoryByUserId) {
                onOpenStoryByUserId(post.userId);
              } else if (onOpenProfile) {
                onOpenProfile(post.userId);
              }
            }}
            className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] cursor-pointer active:scale-95 transition-transform shadow-sm"
          >
            <div className={`w-full h-full rounded-full p-0.5 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
              <img
                src={post.userAvatar}
                alt={post.username}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <button
                onClick={() => onOpenProfile && onOpenProfile(post.userId)}
                className="font-bold text-xs tracking-tight hover:underline cursor-pointer"
              >
                {post.username}
              </button>
              {post.isVerified && (
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[9px] font-black">
                  ✓
                </span>
              )}
            </div>
            {post.location && (
              <span className="text-[11px] text-zinc-400 dark:text-zinc-400 block mt-0.5">
                {post.location}
              </span>
            )}
          </div>
        </div>

        {/* Options Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'hover:bg-zinc-900 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
            }`}
            aria-label="Post options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* Dropdown menu */}
          {showOptionsMenu && (
            <div
              className={`absolute right-0 top-8 w-44 rounded-2xl shadow-2xl py-2 z-30 border text-xs font-medium backdrop-blur-xl ${
                isDark
                  ? 'bg-zinc-900/95 border-zinc-800 text-zinc-200'
                  : 'bg-white/95 border-zinc-200 text-zinc-800'
              }`}
            >
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2.5 text-left hover:bg-cyan-500/10 hover:text-cyan-400 flex items-center justify-between"
              >
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                {copiedLink && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
              <button
                onClick={() => {
                  handleToggleSave();
                  setShowOptionsMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                {isSaved ? 'Remove from Saved' : 'Save Post'}
              </button>
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  if (onOpenProfile) onOpenProfile(post.userId);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                View Profile
              </button>
              {post.userId !== currentUser.id && (
                <button
                  onClick={() => {
                    db.reportContent(currentUser.id, 'post', post.id, 'Reported by user as inappropriate');
                    setShowOptionsMenu(false);
                    alert('Post reported to VIKI SOCIAL moderation team.');
                  }}
                  className="w-full px-4 py-2.5 text-left text-amber-400 hover:bg-amber-500/10"
                >
                  Report Post
                </button>
              )}
              {post.userId === currentUser.id && (
                <button
                  onClick={handleDeletePost}
                  className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Post</span>
                </button>
              )}
              <button
                onClick={() => setShowOptionsMenu(false)}
                className="w-full px-4 py-2.5 text-left text-zinc-400 hover:bg-zinc-800/40"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Media Viewport */}
      <div
        onClick={handleDoubleTap}
        className="relative w-full aspect-square bg-zinc-900 overflow-hidden cursor-pointer select-none group"
      >
        {post.mediaType === 'video' ? (
          <div
            className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
            onClick={(e) => {
              if (videoRef.current) {
                if (isPlaying) {
                  videoRef.current.pause();
                  setIsPlaying(false);
                } else {
                  videoRef.current.play();
                  setIsPlaying(true);
                }
              }
            }}
          >
            <video
              ref={videoRef}
              src={post.mediaUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
              style={{ filter: getFilterStyle(post.filter) }}
            />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 text-white backdrop-blur-md z-10"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.caption}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ filter: getFilterStyle(post.filter) }}
          />
        )}

        {/* Double-tap Heart Burst Animation */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-scale-heart">
            <Heart className="w-28 h-28 text-white fill-white drop-shadow-2xl opacity-95" />
          </div>
        )}
      </div>

      {/* 3. Post Actions Row */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            className="transition-transform active:scale-125 focus:outline-none"
            aria-label="Like post"
          >
            <Heart
              className={`w-6 h-6 transition-all duration-200 ${
                isLiked
                  ? 'text-pink-500 fill-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)] scale-110'
                  : isDark
                  ? 'text-zinc-200 hover:text-pink-400'
                  : 'text-zinc-800 hover:text-pink-600'
              }`}
            />
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowCommentsModal(true)}
            className={`transition-colors active:scale-110 focus:outline-none ${
              isDark ? 'text-zinc-200 hover:text-purple-400' : 'text-zinc-800 hover:text-purple-600'
            }`}
            aria-label="Comment on post"
          >
            <MessageCircle className="w-6 h-6 -scale-x-100" />
          </button>

          {/* Share Button (Opens Instagram-style Direct Share Sheet) */}
          <button
            onClick={() => setShowShareModal(true)}
            className={`transition-colors active:scale-110 focus:outline-none ${
              isDark ? 'text-zinc-200 hover:text-pink-400' : 'text-zinc-800 hover:text-pink-600'
            }`}
            aria-label="Share post"
          >
            <Send className="w-5 h-5 -rotate-12" />
          </button>
        </div>

        {/* Bookmark / Save Button */}
        <button
          onClick={handleToggleSave}
          className="transition-transform active:scale-125 focus:outline-none"
          aria-label="Save post"
        >
          <Bookmark
            className={`w-6 h-6 transition-colors ${
              isSaved
                ? 'text-purple-400 fill-purple-400'
                : isDark
                ? 'text-zinc-200 hover:text-purple-400'
                : 'text-zinc-800 hover:text-purple-600'
            }`}
          />
        </button>
      </div>

      {/* 4. Instagram-style Likes Row */}
      <div className="px-4 py-1 text-xs">
        {likesCount > 1 ? (
          <p className="tracking-tight text-zinc-300 dark:text-zinc-300">
            Liked by <span className="font-bold text-white cursor-pointer hover:underline">
              {post.likes[0] ? (db.getUserById(post.likes[0])?.username || 'elena_visuals') : 'sophia_travels'}
            </span> and <span className="font-bold text-white cursor-pointer hover:underline">
              {(likesCount - 1).toLocaleString()} {likesCount - 1 === 1 ? 'other' : 'others'}
            </span>
          </p>
        ) : likesCount === 1 ? (
          <p className="tracking-tight text-zinc-300 dark:text-zinc-300">
            Liked by <span className="font-bold text-white cursor-pointer hover:underline">
              {post.likes[0] ? (db.getUserById(post.likes[0])?.username || 'elena_visuals') : 'elena_visuals'}
            </span>
          </p>
        ) : (
          <span className="font-semibold text-zinc-400">
            Be the first to <button onClick={handleToggleLike} className="text-pink-400 hover:underline">like this</button>
          </span>
        )}
      </div>

      {/* 5. Caption & Tags */}
      <div className="px-4 text-xs leading-relaxed">
        <span className="font-bold mr-1.5">{post.username}</span>
        <span className={isExpandedCaption ? '' : 'line-clamp-2'}>
          {post.caption}
        </span>
        {post.caption.length > 90 && (
          <button
            onClick={() => setIsExpandedCaption(!isExpandedCaption)}
            className="text-zinc-400 hover:text-zinc-300 ml-1 font-medium inline-block text-[11px]"
          >
            {isExpandedCaption ? 'less' : 'more'}
          </button>
        )}
      </div>

      {/* 6. Comments Preview Link */}
      <div className="px-4 py-1.5">
        {post.comments?.length > 0 ? (
          <button
            onClick={() => setShowCommentsModal(true)}
            className="text-zinc-400 hover:text-zinc-300 text-xs"
          >
            View all {post.comments.length} comments
          </button>
        ) : (
          <button
            onClick={() => setShowCommentsModal(true)}
            className="text-zinc-500 hover:text-zinc-400 text-xs"
          >
            Add a comment...
          </button>
        )}
      </div>

      {/* 7. Quick Comment Input on Post */}
      <form
        onSubmit={handleQuickCommentSubmit}
        className={`px-4 pb-3 pt-1 flex items-center gap-2 ${
          isDark ? 'text-zinc-400' : 'text-zinc-500'
        }`}
      >
        <input
          type="text"
          value={quickComment}
          onChange={(e) => setQuickComment(e.target.value)}
          placeholder="Add a comment..."
          className={`flex-1 text-xs py-1.5 px-3 rounded-full bg-transparent border focus:outline-none transition-colors ${
            isDark
              ? 'border-zinc-800/80 focus:border-purple-500 text-zinc-100 placeholder-zinc-500'
              : 'border-zinc-200 focus:border-purple-600 text-zinc-900 placeholder-zinc-400'
          }`}
        />
        {quickComment.trim() && (
          <button
            type="submit"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            Post
          </button>
        )}
      </form>

      {/* Comments Slide-up Modal */}
      {showCommentsModal && (
        <CommentsModal
          post={post}
          currentUser={currentUser}
          onClose={() => setShowCommentsModal(false)}
          onCommentAdded={onPostUpdated}
          isDark={isDark}
        />
      )}

      {/* Instagram-style Share Sheet Modal */}
      {showShareModal && (
        <ShareModal
          post={post}
          currentUser={currentUser}
          onClose={() => setShowShareModal(false)}
          isDark={isDark}
        />
      )}
    </article>
  );
};
