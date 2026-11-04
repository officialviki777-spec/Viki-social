/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { TabType, Post, User, Story } from './types';
import { db } from './services/db';

// Layout & Android chrome
import { AndroidStatusBar } from './components/layout/AndroidStatusBar';
import { AndroidGestureBar } from './components/layout/AndroidGestureBar';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';

// Features
import { StoriesTray } from './components/stories/StoriesTray';
import { StoryViewer } from './components/stories/StoryViewer';
import { PostCard } from './components/post/PostCard';
import { CreatePostModal } from './components/post/CreatePostModal';
import { ExploreView } from './components/explore/ExploreView';
import { DirectMessagesView } from './components/messages/DirectMessagesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { ReelsView } from './components/reels/ReelsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SettingsModal } from './components/settings/SettingsModal';
import { AuthModal } from './components/auth/AuthModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

export default function App() {
  // Theme state: dark mode as default for sleek Electric Blue & Cyan AMOLED theme
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('viki_social_theme');
    return saved ? saved === 'dark' : true;
  });

  // Device Frame View mode: Android Phone Mockup vs Responsive Web Mode
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(() => {
    const saved = localStorage.getItem('viki_social_device_frame');
    if (saved !== null) return saved === 'true';
    if (typeof window !== 'undefined') {
      const isMobileScreen = window.innerWidth < 640;
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      if (isMobileScreen || isStandalone) return false;
    }
    return true;
  });

  // User state
  const [currentUser, setCurrentUser] = useState<User>(() => db.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Modals & Sheets
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalMode, setCreateModalMode] = useState<'post' | 'story' | 'reel'>('post');
  const [isDirectMessagesOpen, setIsDirectMessagesOpen] = useState(false);
  const [directChatUserId, setDirectChatUserId] = useState<string | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Story Viewer
  const [activeStoryViewer, setActiveStoryViewer] = useState<{
    stories: Story[];
    initialIndex: number;
    highlightTitle?: string;
  } | null>(null);

  // Profile View target user (if inspecting another user's profile)
  const [viewingProfileUserId, setViewingProfileUserId] = useState<string | undefined>(undefined);

  // Detail post modal (e.g., opened from Explore or Profile grid)
  const [selectedPostDetail, setSelectedPostDetail] = useState<Post | null>(null);

  // In-app notifications/toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  // Data refresh ticks
  const [dataVersion, setDataVersion] = useState(0);
  const triggerRefresh = useCallback(() => {
    setDataVersion(v => v + 1);
    setCurrentUser(db.getCurrentUser());
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const handlePostCreated = useCallback(() => {
    triggerRefresh();
    if (createModalMode === 'reel') {
      setCurrentTab('reels');
      showToast('⚡ Your vertical Reel is now live!');
    } else {
      setCurrentTab('home');
      setViewingProfileUserId(undefined);
      setTimeout(() => {
        mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 120);
      showToast('⚡ Your post is now live on VIKI SOCIAL!');
    }
  }, [triggerRefresh, showToast, createModalMode]);

  // Android back button handling
  useEffect(() => {
    const handlePopState = () => {
      if (activeStoryViewer) {
        setActiveStoryViewer(null);
      } else if (isCreateModalOpen) {
        setIsCreateModalOpen(false);
      } else if (isDirectMessagesOpen) {
        setIsDirectMessagesOpen(false);
      } else if (isSettingsOpen) {
        setIsSettingsOpen(false);
      } else if (isAdminOpen) {
        setIsAdminOpen(false);
      } else if (selectedPostDetail) {
        setSelectedPostDetail(null);
      } else if (viewingProfileUserId) {
        setViewingProfileUserId(undefined);
      } else if (currentTab !== 'home') {
        setCurrentTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    activeStoryViewer,
    isCreateModalOpen,
    isDirectMessagesOpen,
    isSettingsOpen,
    isAdminOpen,
    selectedPostDetail,
    viewingProfileUserId,
    currentTab,
  ]);

  // Update HTML root class for dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('viki_social_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('viki_social_theme', 'light');
    }
  }, [isDark]);

  // Save device frame preference
  useEffect(() => {
    localStorage.setItem('viki_social_device_frame', isDeviceFrame ? 'true' : 'false');
  }, [isDeviceFrame]);

  // Retrieve stories, posts, and notifications
  const posts = db.getPosts();
  const stories = db.getStories();
  const notifications = db.getNotifications(currentUser.id);
  const hasUnreadNotifications = notifications.some(n => !n.isRead);

  // Calculate unread direct messages
  const allOtherUsers = db.getUsers().filter(u => u.id !== currentUser.id);
  const unreadMessagesCount = allOtherUsers.reduce((acc, user) => {
    const userMsgs = db.getMessagesForUsers(currentUser.id, user.id);
    const unread = userMsgs.filter(m => m.senderId === user.id && !m.isRead).length;
    return acc + unread;
  }, 0);

  // Handlers
  const handleToggleTheme = () => setIsDark(prev => !prev);
  const handleToggleDeviceFrame = () => setIsDeviceFrame(prev => !prev);

  const handleOpenStoryByUserId = (userId: string) => {
    const userStories = db.getUserActiveStories(userId);
    if (userStories.length > 0) {
      setActiveStoryViewer({ stories: userStories, initialIndex: 0 });
    } else {
      handleOpenUserProfile(userId);
    }
  };

  const handleOpenUserProfile = (userId: string) => {
    if (userId === currentUser.id) {
      setViewingProfileUserId(undefined);
      setCurrentTab('profile');
    } else {
      setViewingProfileUserId(userId);
      setCurrentTab('profile');
    }
  };

  const handleOpenDirectChatWithUser = (userId: string) => {
    setDirectChatUserId(userId);
    setIsDirectMessagesOpen(true);
  };

  const handleSwitchUser = (userId: string) => {
    const nextUser = db.setCurrentUser(userId);
    setCurrentUser(nextUser);
    setViewingProfileUserId(undefined);
    triggerRefresh();
  };

  const handleLogout = () => {
    setIsAuthModalOpen(true);
  };

  const handleResetData = () => {
    db.resetDatabase();
    triggerRefresh();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors ${
        isDark ? 'bg-[#050508] text-slate-100' : 'bg-zinc-100 text-zinc-900'
      }`}
    >
      {/* Outer wrapper: Android Phone Frame Mockup OR Full responsive */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isDeviceFrame
            ? 'max-w-[430px] h-[92vh] max-h-[920px] rounded-[48px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden relative'
            : 'max-w-2xl min-h-screen border-x border-zinc-900/40 relative'
        } ${isDark ? 'bg-[#08080C]' : 'bg-white'}`}
      >
        {/* 1. Android Status Bar */}
        <AndroidStatusBar isDark={isDark} />

        {/* 2. Top Header with custom VIKI SOCIAL Electric Blue & Cyan branding */}
        <TopHeader
          currentUser={currentUser}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          isDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={handleToggleDeviceFrame}
          onOpenCreatePost={() => {
            setCreateModalMode('post');
            setIsCreateModalOpen(true);
          }}
          onOpenNotifications={() => setCurrentTab('notifications')}
          hasUnreadNotifications={hasUnreadNotifications}
          onOpenMessages={() => {
            setDirectChatUserId(undefined);
            setIsDirectMessagesOpen(true);
          }}
          unreadMessagesCount={unreadMessagesCount}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-4 right-4 z-50 flex items-center justify-center pointer-events-none animate-fade-in">
            <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black text-xs font-black shadow-xl shadow-cyan-500/25 flex items-center gap-2 border border-white/20">
              <Sparkles className="w-4 h-4 text-black animate-pulse" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* 3. Main Scrollable Content Canvas */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {/* TAB 1: HOME FEED */}
          {currentTab === 'home' && (
            <div className="w-full pb-16">
              {/* Instagram-style Stories Carousel */}
              <StoriesTray
                stories={stories}
                currentUser={currentUser}
                onOpenUserStories={(userStories) =>
                  setActiveStoryViewer({ stories: userStories, initialIndex: 0 })
                }
                onAddStory={() => {
                  setCreateModalMode('story');
                  setIsCreateModalOpen(true);
                }}
                isDark={isDark}
              />

              {/* Feed Posts */}
              <div className="divide-y divide-zinc-900">
                {posts.length === 0 ? (
                  <div className="py-20 text-center text-zinc-500">
                    <p className="text-sm font-semibold">Your feed is quiet</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Be the first to create a post!
                    </p>
                    <button
                      onClick={() => {
                        setCreateModalMode('post');
                        setIsCreateModalOpen(true);
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-black font-bold text-xs"
                    >
                      Create Post
                    </button>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onPostUpdated={triggerRefresh}
                      onOpenProfile={handleOpenUserProfile}
                      onOpenStoryByUserId={handleOpenStoryByUserId}
                      isDark={isDark}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SEARCH & EXPLORE */}
          {currentTab === 'search' && (
            <ExploreView
              currentUser={currentUser}
              onSelectPost={(post) => setSelectedPostDetail(post)}
              onOpenProfile={handleOpenUserProfile}
              isDark={isDark}
            />
          )}

          {/* TAB 3: VERTICAL REELS */}
          {currentTab === 'reels' && (
            <ReelsView
              currentUser={currentUser}
              onOpenProfile={handleOpenUserProfile}
              isDark={isDark}
            />
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {currentTab === 'notifications' && (
            <NotificationsView
              currentUser={currentUser}
              onOpenProfile={handleOpenUserProfile}
              onNotificationRead={triggerRefresh}
              isDark={isDark}
            />
          )}

          {/* TAB 5: PROFILE */}
          {currentTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              profileUserId={viewingProfileUserId}
              onBack={() => setViewingProfileUserId(undefined)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onSelectPost={(post) => setSelectedPostDetail(post)}
              onOpenDirectChat={handleOpenDirectChatWithUser}
              onProfileUpdated={triggerRefresh}
              onOpenHighlightStories={(hlStories, title) =>
                setActiveStoryViewer({ stories: hlStories, initialIndex: 0, highlightTitle: title })
              }
              onOpenUserStories={(userStories) =>
                setActiveStoryViewer({ stories: userStories, initialIndex: 0 })
              }
              isDark={isDark}
            />
          )}
        </main>

        {/* 4. Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'create') {
              setCreateModalMode('post');
              setIsCreateModalOpen(true);
            } else {
              if (tab === 'profile' && viewingProfileUserId) {
                setViewingProfileUserId(undefined);
              }
              setCurrentTab(tab);
            }
          }}
          currentUser={currentUser}
          hasUnreadNotifications={hasUnreadNotifications}
          isDark={isDark}
        />

        {/* 5. Android Gesture Navigation Pill Bar */}
        <AndroidGestureBar isDark={isDark} />
      </div>

      {/* --- MODALS & OVERLAYS --- */}

      {/* 1. Create Post / Story / Reel Modal */}
      {isCreateModalOpen && (
        <CreatePostModal
          currentUser={currentUser}
          defaultMode={createModalMode}
          onClose={() => setIsCreateModalOpen(false)}
          onPostCreated={handlePostCreated}
          isDark={isDark}
        />
      )}

      {/* 2. Full-Screen Story Viewer */}
      {activeStoryViewer && activeStoryViewer.stories.length > 0 && (
        <StoryViewer
          stories={activeStoryViewer.stories}
          initialIndex={activeStoryViewer.initialIndex}
          highlightTitle={activeStoryViewer.highlightTitle}
          currentUser={currentUser}
          onClose={() => setActiveStoryViewer(null)}
          onStoryViewed={triggerRefresh}
          onStoryDeleted={() => {
            triggerRefresh();
            setActiveStoryViewer(null);
          }}
        />
      )}

      {/* 3. Direct Messages View */}
      {isDirectMessagesOpen && (
        <DirectMessagesView
          currentUser={currentUser}
          initialChatUserId={directChatUserId}
          onBack={() => {
            setIsDirectMessagesOpen(false);
            setDirectChatUserId(undefined);
            triggerRefresh();
          }}
          isDark={isDark}
        />
      )}

      {/* 4. Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          currentUser={currentUser}
          onClose={() => setIsAdminOpen(false)}
          onRefresh={triggerRefresh}
          isDark={isDark}
        />
      )}

      {/* 5. Settings & Privacy Modal */}
      {isSettingsOpen && (
        <SettingsModal
          currentUser={currentUser}
          onClose={() => setIsSettingsOpen(false)}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          isDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={handleToggleDeviceFrame}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
          onResetData={handleResetData}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {/* 6. Single Post Detail Modal */}
      {selectedPostDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 select-none">
          <div
            className={`w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl border shadow-2xl relative ${
              isDark ? 'bg-[#08080C] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <div className="sticky top-0 z-20 px-4 py-2.5 border-b backdrop-blur-md flex items-center justify-between bg-zinc-950/80 border-zinc-900">
              <span className="font-bold text-xs text-zinc-300">Post Detail</span>
              <button
                onClick={() => setSelectedPostDetail(null)}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
              >
                Close
              </button>
            </div>
            <PostCard
              post={selectedPostDetail}
              currentUser={currentUser}
              onPostUpdated={() => {
                triggerRefresh();
                const updated = db.getPostById(selectedPostDetail.id);
                if (updated) setSelectedPostDetail(updated);
              }}
              onOpenProfile={(uid) => {
                setSelectedPostDetail(null);
                handleOpenUserProfile(uid);
              }}
              onOpenStoryByUserId={handleOpenStoryByUserId}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* 7. User Sign Up and Login Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
            triggerRefresh();
          }}
          isDark={isDark}
        />
      )}

      {/* Offline Connectivity Toast */}
      <OfflineIndicator />
    </div>
  );
}
