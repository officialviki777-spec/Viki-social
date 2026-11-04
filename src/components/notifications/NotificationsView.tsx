import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, UserPlus, CheckCheck, Bell } from 'lucide-react';
import { AppNotification, User } from '../../types';
import { db } from '../../services/db';

interface NotificationsViewProps {
  currentUser: User;
  onOpenProfile: (userId: string) => void;
  onNotificationRead: () => void;
  isDark: boolean;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  currentUser,
  onOpenProfile,
  onNotificationRead,
  isDark,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setNotifications(db.getNotifications(currentUser.id));
  }, [currentUser.id]);

  const handleMarkAllRead = () => {
    db.markAllNotificationsRead(currentUser.id);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    onNotificationRead();
  };

  const handleToggleFollow = (userId: string) => {
    db.toggleFollow(userId, currentUser.id);
    onNotificationRead();
  };

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-fuchsia-500 fill-fuchsia-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full pb-16">
      {/* Header */}
      <div
        className={`sticky top-14 z-20 px-4 py-3 border-b backdrop-blur-md flex items-center justify-between transition-colors ${
          isDark
            ? 'bg-zinc-950/90 border-zinc-900 text-zinc-100'
            : 'bg-white/95 border-zinc-100 text-zinc-900'
        }`}
      >
        <h2 className="text-base font-bold tracking-tight">Notifications</h2>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="p-3 space-y-1">
        {notifications.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-40 text-purple-400" />
            <p className="text-sm font-semibold">No notifications yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              When people like, comment or follow you, they will appear here.
            </p>
          </div>
        ) : (
          notifications.map(notif => {
            const isFollowing = currentUser.following.includes(notif.senderId);

            return (
              <div
                key={notif.id}
                onClick={() => db.markNotificationRead(notif.id)}
                className={`p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                  !notif.isRead
                    ? isDark
                      ? 'bg-purple-950/20 border border-purple-900/30'
                      : 'bg-purple-50/70 border border-purple-200/50'
                    : isDark
                    ? 'hover:bg-zinc-900/60'
                    : 'hover:bg-zinc-100'
                }`}
              >
                {/* Left info with avatar and badge */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProfile(notif.senderId);
                    }}
                    className="relative cursor-pointer shrink-0"
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-zinc-700">
                      <img
                        src={notif.senderAvatar}
                        alt={notif.senderUsername}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow">
                      {getIconForType(notif.type)}
                    </div>
                  </div>

                  <div className="text-xs flex-1 min-w-0 leading-relaxed">
                    <p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProfile(notif.senderId);
                        }}
                        className="font-bold hover:underline mr-1 text-zinc-100 dark:text-zinc-100"
                      >
                        {notif.senderUsername}
                      </button>
                      <span className="text-zinc-400 dark:text-zinc-400">
                        {notif.text}
                      </span>
                    </p>
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Right Action: Follow back button OR post thumbnail */}
                {notif.type === 'follow' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFollow(notif.senderId);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                      isFollowing
                        ? isDark
                          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                        : 'bg-purple-600 text-white hover:bg-purple-500 shadow-sm'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow Back'}
                  </button>
                ) : notif.postMediaUrl ? (
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-zinc-800 bg-zinc-900">
                    <img
                      src={notif.postMediaUrl}
                      alt="Post media"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
