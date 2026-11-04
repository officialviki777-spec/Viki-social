import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Music2, Sparkles, Send, Check } from 'lucide-react';
import { Reel, User } from '../../types';
import { db } from '../../services/db';

interface ReelsViewProps {
  currentUser: User;
  onOpenProfile: (userId: string) => void;
  isDark: boolean;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  currentUser,
  onOpenProfile,
  isDark,
}) => {
  const [reels, setReels] = useState<Reel[]>(() => db.getReels());
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCommentsReel, setActiveCommentsReel] = useState<Reel | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [copiedReelId, setCopiedReelId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Refresh reels on mount
    setReels(db.getReels());
  }, []);

  // Handle scroll snap to switch active reel
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollY = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollY / height);
    if (index !== activeReelIndex && index >= 0 && index < reels.length) {
      setActiveReelIndex(index);
    }
  };

  useEffect(() => {
    // Play active video, pause others
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeReelIndex && isPlaying) {
        video.play().catch(() => {
          // Autoplay policy fallback
          video.muted = true;
          setIsMuted(true);
          video.play().catch(e => console.log('Video autoplay prevented', e));
        });
      } else {
        video.pause();
      }
    });
  }, [activeReelIndex, isPlaying]);

  const toggleLike = (reelId: string) => {
    db.toggleLikeReel(reelId, currentUser.id);
    setReels(db.getReels());
    if (activeCommentsReel && activeCommentsReel.id === reelId) {
      setActiveCommentsReel(db.getReelById(reelId) || null);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentsReel || !commentInput.trim()) return;
    db.addReelComment(activeCommentsReel.id, currentUser.id, commentInput);
    setCommentInput('');
    setReels(db.getReels());
    setActiveCommentsReel(db.getReelById(activeCommentsReel.id) || null);
  };

  const handleShare = (reel: Reel) => {
    if (navigator.share) {
      navigator.share({
        title: `VIKI SOCIAL Reel by @${reel.username}`,
        text: reel.caption,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedReelId(reel.id);
      setTimeout(() => setCopiedReelId(null), 2000);
    }
  };

  if (reels.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-12 h-12 text-cyan-400 mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-white">No Reels Yet</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs">
          Be the first to create vertical short-videos on VIKI SOCIAL!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative flex-1 w-full h-[calc(100vh-7rem)] overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black select-none"
    >
      {reels.map((reel, idx) => {
        const isLiked = reel.likes.includes(currentUser.id);
        const isActive = idx === activeReelIndex;

        return (
          <div
            key={reel.id}
            className="relative w-full h-full snap-start snap-always flex items-center justify-center overflow-hidden bg-zinc-950"
          >
            {/* Background Looping Reel Video */}
            <video
              ref={el => { videoRefs.current[idx] = el; }}
              src={reel.videoUrl}
              loop
              playsInline
              muted={isMuted}
              onClick={() => setIsPlaying(prev => !prev)}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Sound Toggle Button (Top Right) */}
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/70 active:scale-95 transition-all"
              aria-label="Toggle sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-zinc-300" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Right Action Rail (Like, Comment, Share, Audio) */}
            <div className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-5">
              {/* Like Button */}
              <button
                onClick={() => toggleLike(reel.id)}
                className="flex flex-col items-center gap-1 group"
                aria-label="Like reel"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-active:scale-90 transition-transform">
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {reel.likes.length}
                </span>
              </button>

              {/* Comment Button */}
              <button
                onClick={() => setActiveCommentsReel(reel)}
                className="flex flex-col items-center gap-1 group"
                aria-label="Comments"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-active:scale-90 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {reel.comments.length}
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => handleShare(reel)}
                className="flex flex-col items-center gap-1 group"
                aria-label="Share reel"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-active:scale-90 transition-transform">
                  {copiedReelId === reel.id ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-5 h-5 text-white" />
                  )}
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {copiedReelId === reel.id ? 'Copied' : reel.sharesCount || 0}
                </span>
              </button>
            </div>

            {/* Bottom Caption & User Details */}
            <div className="absolute left-4 right-16 bottom-6 z-20 flex flex-col gap-2 text-white">
              {/* Creator Info */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenProfile(reel.userId)}
                  className="flex items-center gap-2 group"
                >
                  <img
                    src={reel.userAvatar}
                    alt={reel.username}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-400 shadow-md"
                  />
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-sm drop-shadow group-hover:text-cyan-300 transition-colors">
                      @{reel.username}
                    </span>
                    {reel.isVerified && (
                      <span className="text-cyan-400 font-bold text-xs">✓</span>
                    )}
                  </div>
                </button>
              </div>

              {/* Caption */}
              <p className="text-xs text-zinc-100 font-medium line-clamp-2 drop-shadow leading-relaxed">
                {reel.caption}
              </p>

              {/* Audio Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 w-fit">
                <Music2 className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="text-[10px] font-semibold text-zinc-200 truncate max-w-[160px]">
                  {reel.audioTrack}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Reel Comments Bottom Sheet */}
      {activeCommentsReel && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end">
          <div
            className={`w-full max-h-[60vh] rounded-t-3xl border-t flex flex-col shadow-2xl ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            {/* Sheet Handle & Header */}
            <div className="p-3 border-b flex items-center justify-between border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Comments ({activeCommentsReel.comments.length})
              </span>
              <button
                onClick={() => setActiveCommentsReel(null)}
                className="text-xs font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar max-h-72">
              {activeCommentsReel.comments.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                activeCommentsReel.comments.map(c => (
                  <div key={c.id} className="flex gap-2.5 items-start">
                    <img
                      src={c.userAvatar}
                      alt={c.username}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-500/30"
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-white mr-1.5">@{c.username}</span>
                      <span className="text-zinc-300">{c.text}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input Form */}
            <form onSubmit={handleAddComment} className="p-3 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                placeholder="Add a comment to this reel..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-bold text-xs disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
