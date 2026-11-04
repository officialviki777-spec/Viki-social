import React, { useState } from 'react';
import { X, Heart, Trash2, Send } from 'lucide-react';
import { Post, User } from '../../types';
import { db } from '../../services/db';

interface CommentsModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onCommentAdded: () => void;
  isDark: boolean;
}

const QUICK_EMOJIS = ['❤️', '🔥', '💜', '😍', '👏', '🙌', '✨', '💯'];

export const CommentsModal: React.FC<CommentsModalProps> = ({
  post,
  currentUser,
  onClose,
  onCommentAdded,
  isDark,
}) => {
  const [commentText, setCommentText] = useState('');
  const [activeComments, setActiveComments] = useState(post.comments || []);

  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = db.addComment(post.id, currentUser.id, commentText.trim());
    setActiveComments(prev => [...prev, newComment]);
    setCommentText('');
    onCommentAdded();
  };

  const handleToggleLikeComment = (commentId: string) => {
    const isLiked = db.toggleLikeComment(post.id, commentId, currentUser.id);
    setActiveComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const likes = isLiked
            ? [...c.likes, currentUser.id]
            : c.likes.filter(id => id !== currentUser.id);
          return { ...c, likes };
        }
        return c;
      })
    );
  };

  const handleDeleteComment = (commentId: string) => {
    db.deleteComment(post.id, commentId);
    setActiveComments(prev => prev.filter(c => c.id !== commentId));
    onCommentAdded();
  };

  const handleQuickEmoji = (emoji: string) => {
    setCommentText(prev => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div
        className={`w-full max-w-lg h-[80vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl transition-colors ${
          isDark ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'bg-white text-zinc-900 border border-zinc-200'
        }`}
      >
        {/* Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1 rounded-full bg-zinc-500/40" />
        </div>

        {/* Modal Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDark ? 'border-zinc-800' : 'border-zinc-100'
        }`}>
          <div className="w-6" /> {/* spacer */}
          <h3 className="font-semibold text-sm tracking-tight">Comments</h3>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
            }`}
            aria-label="Close comments"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Post Caption as top row */}
        <div className={`p-4 border-b flex items-start gap-3 ${
          isDark ? 'border-zinc-800/80 bg-zinc-950/40' : 'border-zinc-100 bg-zinc-50/60'
        }`}>
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-purple-500/50">
            <img
              src={post.userAvatar}
              alt={post.username}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-semibold">{post.username}</span>
              {post.isVerified && (
                <span className="text-[10px] text-purple-400">✓</span>
              )}
              <span className="text-zinc-500 text-[10px]">
                {new Date(post.createdAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-zinc-300 dark:text-zinc-300">
              {post.caption}
            </p>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {activeComments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs text-zinc-400 mt-1">Start the conversation!</p>
            </div>
          ) : (
            activeComments.map(c => {
              const isLiked = c.likes?.includes(currentUser.id);
              const isOwn = c.userId === currentUser.id;

              return (
                <div key={c.id} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-zinc-700">
                      <img
                        src={c.userAvatar}
                        alt={c.username}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-200 dark:text-zinc-200">
                          {c.username}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(c.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="mt-0.5 text-zinc-300 leading-normal">{c.text}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-500">
                        {c.likes?.length > 0 && (
                          <span className="font-medium text-purple-400">
                            {c.likes.length} {c.likes.length === 1 ? 'like' : 'likes'}
                          </span>
                        )}
                        {isOwn && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Like comment button */}
                  <button
                    onClick={() => handleToggleLikeComment(c.id)}
                    className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                    aria-label="Like comment"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'text-red-500 fill-red-500' : ''
                      }`}
                    />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div className={`px-4 py-1.5 border-t flex items-center justify-between overflow-x-auto no-scrollbar gap-2 ${
          isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-100 bg-zinc-50'
        }`}>
          {QUICK_EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => handleQuickEmoji(emoji)}
              className="text-lg hover:scale-125 active:scale-95 transition-transform p-1 select-none"
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Bottom Input Area */}
        <form
          onSubmit={handleAddComment}
          className={`p-3 border-t flex items-center gap-2 ${
            isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-100 bg-white'
          }`}
        >
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`Add a comment as ${currentUser.username}...`}
            className={`flex-1 text-xs px-3 py-2 rounded-full focus:outline-none transition-colors ${
              isDark
                ? 'bg-zinc-800 text-white placeholder-zinc-500 focus:ring-1 focus:ring-purple-500'
                : 'bg-zinc-100 text-zinc-900 placeholder-zinc-400 focus:ring-1 focus:ring-purple-600'
            }`}
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`p-2 rounded-full font-semibold text-xs transition-colors ${
              commentText.trim()
                ? 'text-purple-400 hover:text-purple-300 active:scale-95'
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            aria-label="Post comment"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
