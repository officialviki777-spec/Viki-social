import React, { useState, useMemo } from 'react';
import { X, Check, Image as ImageIcon, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { Story, StoryHighlight, User } from '../../types';
import { db } from '../../services/db';

interface CreateHighlightModalProps {
  currentUser: User;
  onClose: () => void;
  onHighlightCreated: (highlight: StoryHighlight) => void;
  isDark: boolean;
  preselectedStoryId?: string;
}

export const CreateHighlightModal: React.FC<CreateHighlightModalProps> = ({
  currentUser,
  onClose,
  onHighlightCreated,
  isDark,
  preselectedStoryId,
}) => {
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [title, setTitle] = useState('');
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>(
    preselectedStoryId ? [preselectedStoryId] : []
  );
  const [coverUrl, setCoverUrl] = useState<string>('');

  // Get all user stories (active + archive)
  const userStories = useMemo(() => {
    const list = db.getUserAllStories(currentUser.id);
    // If current user is elena or has stories, returns them
    // If list is empty (e.g. newly registered user with no stories yet), offer sample stories to pick from
    if (list.length === 0) {
      return db.getAllStories();
    }
    return list;
  }, [currentUser.id]);

  const toggleSelectStory = (storyId: string) => {
    setSelectedStoryIds(prev => {
      if (prev.includes(storyId)) {
        return prev.filter(id => id !== storyId);
      } else {
        return [...prev, storyId];
      }
    });
  };

  const handleNext = () => {
    if (selectedStoryIds.length === 0) return;
    const firstStory = userStories.find(s => selectedStoryIds.includes(s.id));
    if (firstStory && !coverUrl) {
      setCoverUrl(firstStory.mediaUrl);
    }
    setStep('details');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStoryIds.length === 0) return;

    const highlightTitle = title.trim() || 'Highlight';
    const finalCover = coverUrl || (userStories.find(s => selectedStoryIds.includes(s.id))?.mediaUrl || '');

    const newHighlight = db.createHighlight({
      userId: currentUser.id,
      title: highlightTitle,
      coverUrl: finalCover,
      storyIds: selectedStoryIds,
    });

    onHighlightCreated(newHighlight);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden border shadow-2xl flex flex-col max-h-[85vh] transition-colors ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-zinc-800/80 bg-zinc-950' : 'border-zinc-100 bg-zinc-50'
          }`}
        >
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            {step === 'select' ? 'Select Stories' : 'New Highlight'}
          </span>
          {step === 'select' ? (
            <button
              onClick={handleNext}
              disabled={selectedStoryIds.length === 0}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                selectedStoryIds.length > 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="text-xs font-bold px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-500/20 hover:opacity-90"
            >
              Done
            </button>
          )}
        </div>

        {/* Modal Body */}
        {step === 'select' ? (
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-zinc-400">
                Stories Archive & Active Stories ({selectedStoryIds.length} selected)
              </span>
              {selectedStoryIds.length > 0 && (
                <button
                  onClick={() => setSelectedStoryIds([])}
                  className="text-[11px] text-purple-400 hover:text-purple-300 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {userStories.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto text-purple-400 opacity-60" />
                <p className="text-sm font-semibold text-zinc-300">No stories available</p>
                <p className="text-xs text-zinc-500">
                  Upload a photo or video to your story first to add it to your highlights!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {userStories.map(story => {
                  const isSelected = selectedStoryIds.includes(story.id);
                  const isExpired = new Date(story.expiresAt).getTime() < Date.now();

                  return (
                    <div
                      key={story.id}
                      onClick={() => toggleSelectStory(story.id)}
                      className={`relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group border transition-all ${
                        isSelected
                          ? 'ring-2 ring-purple-500 border-purple-400'
                          : 'border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={story.mediaUrl}
                        alt={story.caption || 'Story'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                      {/* Top Selection Checkbox Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                              : 'border-white/70 bg-black/40 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>

                      {/* Bottom Info: Date / Tag */}
                      <div className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white/90">
                        <span className="block truncate font-medium">
                          {story.caption || 'Story'}
                        </span>
                        <span className="text-[9px] text-zinc-400">
                          {new Date(story.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                          {isExpired && ' · Archive'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleCreate} className="p-5 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-6 flex-1 flex flex-col items-center justify-center">
              {/* Highlight Cover Preview */}
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 shadow-xl shadow-purple-600/25">
                  <div className={`w-full h-full rounded-full overflow-hidden p-0.5 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt="Highlight Cover"
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title input */}
              <div className="w-full max-w-xs space-y-1.5 text-center">
                <label className="text-xs font-semibold text-zinc-400">
                  Highlight Name
                </label>
                <input
                  type="text"
                  autoFocus
                  maxLength={24}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Highlights"
                  className={`w-full text-center px-4 py-2.5 rounded-2xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                  }`}
                />
                <p className="text-[11px] text-zinc-500">
                  {selectedStoryIds.length} {selectedStoryIds.length === 1 ? 'story' : 'stories'} included
                </p>
              </div>

              {/* Cover selector carousel */}
              <div className="w-full space-y-2">
                <span className="text-xs font-medium text-zinc-400 text-center block">
                  Select Cover
                </span>
                <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {userStories
                    .filter(s => selectedStoryIds.includes(s.id))
                    .map(s => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setCoverUrl(s.mediaUrl)}
                        className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          coverUrl === s.mediaUrl
                            ? 'border-purple-500 scale-105 shadow-md shadow-purple-500/30'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={s.mediaUrl}
                          alt="Cover candidate"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-xl shadow-pink-500/25 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Add to Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
