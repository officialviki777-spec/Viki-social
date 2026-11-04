import React from 'react';
import { Plus } from 'lucide-react';
import { Story, User } from '../../types';

interface StoriesTrayProps {
  stories: Story[];
  currentUser: User;
  onOpenUserStories: (userStories: Story[]) => void;
  onAddStory: () => void;
  isDark: boolean;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  stories,
  currentUser,
  onOpenUserStories,
  onAddStory,
  isDark,
}) => {
  // Current user's active stories (expires after 24h)
  const myStories = stories.filter(s => s.userId === currentUser.id);

  // Group other users' stories
  const otherUsersMap = new Map<string, { user: { id: string; username: string; avatar: string; isVerified?: boolean }; stories: Story[] }>();

  stories
    .filter(s => s.userId !== currentUser.id)
    .forEach(story => {
      if (!otherUsersMap.has(story.userId)) {
        otherUsersMap.set(story.userId, {
          user: {
            id: story.userId,
            username: story.username,
            avatar: story.userAvatar,
            isVerified: story.isVerified,
          },
          stories: [story],
        });
      } else {
        otherUsersMap.get(story.userId)!.stories.push(story);
      }
    });

  const otherUserGroups = Array.from(otherUsersMap.values());

  return (
    <div
      className={`w-full py-3 px-3.5 border-b overflow-x-auto no-scrollbar flex items-center gap-4 transition-colors ${
        isDark ? 'border-zinc-900 bg-zinc-950/60' : 'border-zinc-100 bg-zinc-50/60'
      }`}
    >
      {/* 1. "Your Story" item */}
      <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
        <div className="relative">
          <div
            onClick={() => {
              if (myStories.length > 0) {
                onOpenUserStories(myStories);
              } else {
                onAddStory();
              }
            }}
            className={`w-[66px] h-[66px] rounded-full p-[2.5px] transition-transform active:scale-95 ${
              myStories.length > 0
                ? 'bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500/30'
                : 'border-2 border-dashed border-cyan-500/40 hover:border-cyan-400'
            }`}
          >
            <div className={`w-full h-full rounded-full p-0.5 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
              <img
                src={currentUser.avatar}
                alt="Your story"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Plus icon badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddStory();
            }}
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black flex items-center justify-center border-2 border-zinc-950 shadow-md hover:scale-110 active:scale-90 transition-transform"
            title="Add Story"
            aria-label="Add story"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
        <span
          className={`text-[11px] font-medium tracking-tight truncate max-w-[68px] ${
            isDark ? 'text-zinc-300' : 'text-zinc-700'
          }`}
        >
          Your Story
        </span>
      </div>

      {/* 2. Other users' grouped stories */}
      {otherUserGroups.map(({ user, stories: userStoryList }) => {
        // True if any story in this user's stack has not been viewed yet
        const hasUnviewed = userStoryList.some(s => !s.viewers.includes(currentUser.id));

        return (
          <div
            key={user.id}
            onClick={() => onOpenUserStories(userStoryList)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div
              className={`w-[66px] h-[66px] rounded-full p-[2.5px] transition-transform group-hover:scale-105 active:scale-95 ${
                hasUnviewed
                  ? 'bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500/30'
                  : isDark
                  ? 'border border-zinc-800'
                  : 'border border-zinc-300'
              }`}
            >
              <div className={`w-full h-full rounded-full p-0.5 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
                <img
                  src={user.avatar}
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span
              className={`text-[11px] font-medium tracking-tight truncate max-w-[68px] ${
                hasUnviewed
                  ? isDark
                    ? 'text-zinc-200 font-semibold'
                    : 'text-zinc-900 font-semibold'
                  : 'text-zinc-500'
              }`}
            >
              {user.username}
            </span>
          </div>
        );
      })}
    </div>
  );
};
