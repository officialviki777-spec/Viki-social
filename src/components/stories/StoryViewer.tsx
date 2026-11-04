import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  Send,
  Check,
  Trash2,
  Bookmark,
  Plus,
  Eye,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { Story, User, StoryHighlight } from '../../types';
import { db } from '../../services/db';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  currentUser: User;
  onClose: () => void;
  onStoryViewed: (storyId: string) => void;
  highlightTitle?: string;
  onStoryDeleted?: (storyId: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  currentUser,
  onClose,
  onStoryViewed,
  highlightTitle,
  onStoryDeleted,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sentHeart, setSentHeart] = useState(false);
  const [sentReply, setSentReply] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Video audio state
  const [isMuted, setIsMuted] = useState(true);

  // Modals inside story viewer
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [showHighlightDrawer, setShowHighlightDrawer] = useState(false);
  const [newHighlightTitle, setNewHighlightTitle] = useState('');
  const [showNewHighlightInput, setShowNewHighlightInput] = useState(false);

  // User highlights
  const [userHighlights, setUserHighlights] = useState<StoryHighlight[]>([]);

  const currentStory = stories[currentIndex];
  const progressIntervalRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isOwner = currentStory && currentStory.userId === currentUser.id;
  const isLikedByMe = Boolean(currentStory?.likes?.includes(currentUser.id));

  // Load user highlights when highlight drawer opens
  useEffect(() => {
    if (showHighlightDrawer) {
      setUserHighlights(db.getHighlights(currentUser.id));
    }
  }, [showHighlightDrawer, currentUser.id]);

  // Mark current story as viewed
  useEffect(() => {
    if (currentStory) {
      db.markStoryViewed(currentStory.id, currentUser.id);
      onStoryViewed(currentStory.id);
    }
  }, [currentIndex, currentStory, currentUser.id, onStoryViewed]);

  // Calculate relative time
  const getRelativeTime = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${Math.floor(diffHour / 24)}d ago`;
  };

  // Story auto-advance timer
  const effectiveIsPaused = isPaused || showViewersModal || showHighlightDrawer;

  useEffect(() => {
    setProgress(0);
    setSentHeart(false);
    setSentReply(false);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    const stepMs = 50;
    // 5 seconds for image, 7 seconds for video fallback
    const totalDuration = currentStory?.mediaType === 'video' ? 7000 : 5000;
    const increment = (stepMs / totalDuration) * 100;

    progressIntervalRef.current = window.setInterval(() => {
      if (!effectiveIsPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + increment;
        });
      }
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentIndex, effectiveIsPaused, currentStory?.mediaType]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Like reaction
  const handleToggleLike = () => {
    if (!currentStory) return;
    const liked = db.toggleLikeStory(currentStory.id, currentUser.id);
    if (liked) {
      setSentHeart(true);
      db.sendMessage({
        senderId: currentUser.id,
        receiverId: currentStory.userId,
        text: `❤️ Liked your story`,
      });
      setTimeout(() => setSentHeart(false), 1800);
    }
    onStoryViewed(currentStory.id);
  };

  // Reply message
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentStory) return;
    db.sendMessage({
      senderId: currentUser.id,
      receiverId: currentStory.userId,
      text: `Replied to story: "${replyText.trim()}"`,
    });
    setReplyText('');
    setSentReply(true);
    setTimeout(() => setSentReply(false), 2200);
  };

  // Delete own story
  const handleDeleteStory = () => {
    if (!currentStory) return;
    if (window.confirm('Delete this story?')) {
      db.deleteStory(currentStory.id);
      if (onStoryDeleted) onStoryDeleted(currentStory.id);
      if (stories.length <= 1) {
        onClose();
      } else {
        if (currentIndex >= stories.length - 1) {
          setCurrentIndex(stories.length - 2);
        }
      }
    }
  };

  // Add to existing highlight
  const handleAddToHighlight = (highlight: StoryHighlight) => {
    if (!currentStory) return;
    db.addStoryToHighlight(highlight.id, currentStory.id);
    setToastMessage(`Added to ${highlight.title} 💜`);
    setShowHighlightDrawer(false);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Create new highlight from this story
  const handleCreateNewHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHighlightTitle.trim() || !currentStory) return;

    db.createHighlight({
      userId: currentUser.id,
      title: newHighlightTitle.trim(),
      coverUrl: currentStory.mediaUrl,
      storyIds: [currentStory.id],
    });

    setToastMessage(`Created highlight "${newHighlightTitle.trim()}" ✨`);
    setNewHighlightTitle('');
    setShowNewHighlightInput(false);
    setShowHighlightDrawer(false);
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (!currentStory) return null;

  // Viewers list
  const viewersList = (currentStory.viewers || [])
    .map(uid => db.getUserById(uid))
    .filter((u): u is User => Boolean(u));

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-xl select-none">
      <div
        className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-3xl overflow-hidden bg-zinc-950 flex flex-col justify-between shadow-2xl"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* 1. Dynamic Segmented Progress Bars */}
        <div className="absolute top-2 left-0 right-0 z-30 px-3 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div
              key={s.id}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* 2. Story Header (User, Highlight title, Timestamp, Volume, Options, Close) */}
        <div className="absolute top-5 left-0 right-0 z-30 px-4 py-2 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full ring-2 ring-purple-500 overflow-hidden shrink-0">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-white text-sm font-semibold tracking-tight">
                  {currentStory.username}
                </span>
                {currentStory.isVerified && (
                  <span className="text-[10px] text-purple-400 bg-purple-950/70 border border-purple-500/40 rounded-full px-1">
                    ✓
                  </span>
                )}
                {highlightTitle && (
                  <span className="text-xs font-semibold text-fuchsia-300">
                    · {highlightTitle}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-white/70">
                {getRelativeTime(currentStory.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle for Videos */}
            {currentStory.mediaType === 'video' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(prev => !prev);
                  if (videoRef.current) {
                    videoRef.current.muted = !isMuted;
                  }
                }}
                className="p-2 text-white/80 hover:text-white rounded-full bg-black/40 backdrop-blur-md active:scale-95 transition-all"
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            {/* Delete button if story owner */}
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStory();
                }}
                className="p-2 text-white/80 hover:text-red-400 rounded-full bg-black/40 backdrop-blur-md active:scale-95 transition-all"
                title="Delete Story"
                aria-label="Delete story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full bg-black/40 backdrop-blur-md active:scale-95 transition-all"
              aria-label="Close story"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3. Media Canvas */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
          {currentStory.mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={currentStory.mediaUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt="Story media"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          )}

          {/* Optional Caption overlay */}
          {currentStory.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20 text-center pointer-events-none">
              <span className="inline-block px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md text-white text-sm font-medium shadow-lg max-w-full truncate">
                {currentStory.caption}
              </span>
            </div>
          )}

          {/* Left tap zone for previous story */}
          <div
            onClick={handlePrev}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
          />

          {/* Right tap zone for next story */}
          <div
            onClick={handleNext}
            className="absolute right-0 top-0 bottom-0 w-2/3 z-10 cursor-pointer"
          />

          {/* Floating heart burst animation */}
          {sentHeart && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-bounce">
              <Heart className="w-24 h-24 text-fuchsia-500 fill-fuchsia-500 drop-shadow-2xl" />
            </div>
          )}
        </div>

        {/* 4. Bottom Interactive Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
          {isOwner ? (
            /* OWNER CONTROLS: Viewers Drawer trigger + Add to Highlight */
            <div className="flex items-center justify-between gap-3 px-1">
              {/* Seen by X Viewers */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewersModal(true);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-md hover:bg-zinc-800 transition-colors"
              >
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-white text-xs font-semibold">
                  Activity ({currentStory.viewers?.length || 0})
                </span>
                {viewersList.length > 0 && (
                  <div className="flex -space-x-1.5 ml-1">
                    {viewersList.slice(0, 3).map(v => (
                      <img
                        key={v.id}
                        src={v.avatar}
                        alt={v.username}
                        referrerPolicy="no-referrer"
                        className="w-4 h-4 rounded-full border border-black object-cover"
                      />
                    ))}
                  </div>
                )}
              </button>

              {/* Add to Highlight Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHighlightDrawer(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>Highlight</span>
              </button>
            </div>
          ) : (
            /* VIEWER CONTROLS: Reply to author + Like reaction */
            <div className="flex items-center gap-2">
              <form
                onSubmit={handleSendReply}
                className="flex-1 flex items-center gap-2 bg-zinc-900/80 border border-zinc-700/60 rounded-full px-4 py-2 backdrop-blur-md"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Send message to ${currentStory.username}...`}
                  className="flex-1 bg-transparent text-white text-xs placeholder-zinc-400 focus:outline-none"
                />
                {replyText.trim() && (
                  <button
                    type="submit"
                    className="text-purple-400 hover:text-purple-300 font-semibold text-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Heart reaction button */}
              <button
                onClick={handleToggleLike}
                className={`p-2.5 rounded-full transition-all active:scale-125 ${
                  isLikedByMe || sentHeart
                    ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30'
                    : 'bg-zinc-900/80 text-white hover:text-fuchsia-400 border border-zinc-700/60'
                }`}
                title="Like story"
                aria-label="Send like to story"
              >
                <Heart
                  className={`w-5 h-5 ${isLikedByMe || sentHeart ? 'fill-current' : ''}`}
                />
              </button>
            </div>
          )}
        </div>

        {/* 5. In-Story Toast Notification */}
        {(sentReply || toastMessage) && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-3.5 py-2 rounded-full bg-purple-600/95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xl backdrop-blur-md animate-fade-in border border-white/20">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{toastMessage || `Message sent to ${currentStory.username}`}</span>
          </div>
        )}

        {/* 6. Viewers Sheet / Drawer */}
        {showViewersModal && (
          <div
            className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end"
            onClick={() => setShowViewersModal(false)}
          >
            <div
              className="w-full bg-zinc-950 border-t border-zinc-800 rounded-t-3xl max-h-[60%] flex flex-col p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-sm text-white">
                    Viewers ({currentStory.viewers?.length || 0})
                  </span>
                </div>
                <button
                  onClick={() => setShowViewersModal(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-3">
                {viewersList.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500 text-xs">
                    No viewers yet. Check back soon!
                  </div>
                ) : (
                  viewersList.map(v => (
                    <div key={v.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={v.avatar}
                          alt={v.username}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-500/50"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white">{v.username}</span>
                            {v.isVerified && (
                              <span className="text-[9px] text-purple-400">✓</span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500">{v.fullName}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500">Viewed</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 7. Highlight Selector Drawer */}
        {showHighlightDrawer && (
          <div
            className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end"
            onClick={() => setShowHighlightDrawer(false)}
          >
            <div
              className="w-full bg-zinc-950 border-t border-zinc-800 rounded-t-3xl max-h-[70%] flex flex-col p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-purple-400 fill-current" />
                  <span className="font-bold text-sm text-white">Add to Highlight</span>
                </div>
                <button
                  onClick={() => setShowHighlightDrawer(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* New Highlight form */}
              {showNewHighlightInput ? (
                <form onSubmit={handleCreateNewHighlight} className="py-4 space-y-3">
                  <input
                    type="text"
                    autoFocus
                    value={newHighlightTitle}
                    onChange={(e) => setNewHighlightTitle(e.target.value)}
                    placeholder="Highlight Name (e.g. Vibes, Tokyo, Studio)"
                    className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewHighlightInput(false)}
                      className="flex-1 py-2 rounded-xl bg-zinc-900 text-zinc-400 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newHighlightTitle.trim()}
                      className="flex-1 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs disabled:opacity-50"
                    >
                      Create & Add
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-4 space-y-3">
                  <button
                    onClick={() => setShowNewHighlightInput(true)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-zinc-900/90 border border-purple-500/40 hover:border-purple-500 flex items-center gap-3 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-300">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white">New Highlight</span>
                      <span className="text-[10px] text-zinc-400">
                        Create a highlight collection with this story
                      </span>
                    </div>
                  </button>

                  <div className="text-[11px] font-semibold text-zinc-500 pt-1">
                    Your Highlights
                  </div>

                  <div className="max-h-48 overflow-y-auto no-scrollbar space-y-2">
                    {userHighlights.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-4">
                        No highlights yet. Tap "+ New Highlight" above!
                      </p>
                    ) : (
                      userHighlights.map(hl => {
                        const alreadyIn = hl.storyIds.includes(currentStory.id);
                        return (
                          <div
                            key={hl.id}
                            onClick={() => !alreadyIn && handleAddToHighlight(hl)}
                            className={`p-2 rounded-2xl flex items-center justify-between transition-colors ${
                              alreadyIn
                                ? 'bg-zinc-900/40 cursor-default opacity-60'
                                : 'bg-zinc-900/80 hover:bg-zinc-800/90 cursor-pointer border border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={hl.coverUrl}
                                alt={hl.title}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-500"
                              />
                              <div>
                                <span className="block text-xs font-bold text-white">
                                  {hl.title}
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                  {hl.storyIds.length} {hl.storyIds.length === 1 ? 'story' : 'stories'}
                                </span>
                              </div>
                            </div>

                            {alreadyIn ? (
                              <span className="text-[10px] text-purple-400 font-semibold px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30">
                                Included
                              </span>
                            ) : (
                              <span className="text-[10px] text-fuchsia-400 font-semibold">
                                + Add
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
