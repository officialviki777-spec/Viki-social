export type MediaType = 'image' | 'video';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  website?: string;
  country?: string;
  countryCode?: string;
  followers: string[]; // user IDs
  following: string[]; // user IDs
  isVerified?: boolean;
  isPrivate?: boolean;
  isOnline?: boolean;
  showOnlineStatus?: boolean;
  blockedUserIds?: string[];
  role?: 'user' | 'admin';
  isSuspended?: boolean;
  savedPostIds: string[];
  password?: string;
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  likes: string[]; // user IDs
  createdAt: string;
  replies?: PostComment[];
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  mediaUrl: string;
  mediaType: MediaType;
  filter?: string;
  caption: string;
  location?: string;
  tags: string[];
  likes: string[]; // user IDs
  comments: PostComment[];
  createdAt: string;
  isReported?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  mediaUrl: string;
  mediaType: MediaType;
  caption?: string;
  filter?: string;
  createdAt: string;
  expiresAt: string;
  viewers: string[]; // user IDs
  likes?: string[]; // user IDs
}

export interface StoryHighlight {
  id: string;
  userId: string;
  title: string;
  coverUrl: string;
  storyIds: string[];
  createdAt: string;
}

export interface Reel {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  videoUrl: string;
  caption: string;
  audioTrack: string;
  likes: string[];
  comments: PostComment[];
  sharesCount: number;
  tags: string[];
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  mediaUrl?: string;
  createdAt: string;
  isRead: boolean;
  isLiked?: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  otherUser: User;
  lastMessage?: DirectMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  senderId: string;
  senderUsername: string;
  senderAvatar: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message';
  postId?: string;
  postMediaUrl?: string;
  text?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReportedItem {
  id: string;
  reporterId: string;
  targetType: 'post' | 'user' | 'reel' | 'comment';
  targetId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  details?: string;
}

export type TabType = 'home' | 'search' | 'reels' | 'create' | 'notifications' | 'profile';

export interface CountryInfo {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}
