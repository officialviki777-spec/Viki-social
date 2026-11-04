import {
  AppNotification,
  DirectMessage,
  Post,
  Story,
  StoryHighlight,
  User,
  Reel,
  ReportedItem,
  CountryInfo,
} from '../types';

// Assets
import cyberpunkImg from '../assets/images/viki_cyberpunk_neon_1793453380162.jpg';
import portraitImg from '../assets/images/viki_portrait_creator_1793453380952.jpg';
import coffeeImg from '../assets/images/viki_coffee_minimal_1793453380794.jpg';
import mountainImg from '../assets/images/viki_travel_mountain_1793453381677.jpg';
import workspaceImg from '../assets/images/viki_tech_workspace_1793453381321.jpg';

const STORAGE_KEYS = {
  USERS: 'viki_social_users',
  POSTS: 'viki_social_posts',
  STORIES: 'viki_social_stories',
  HIGHLIGHTS: 'viki_social_highlights',
  REELS: 'viki_social_reels',
  MESSAGES: 'viki_social_messages',
  NOTIFICATIONS: 'viki_social_notifications',
  REPORTS: 'viki_social_reports',
  CURRENT_USER_ID: 'viki_social_current_user_id',
  THEME: 'viki_social_theme',
  DEVICE_FRAME: 'viki_social_device_frame',
};

// Global Country list
export const COUNTRIES: CountryInfo[] = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
];

// Seed users
export const INITIAL_USERS: User[] = [
  {
    id: 'user_viki_official',
    username: 'viki_social',
    fullName: 'VIKI SOCIAL Official',
    email: 'admin@vikisocial.app',
    phoneNumber: '+14155550199',
    country: 'United States',
    countryCode: 'US',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80',
    bio: 'Official VIKI SOCIAL Hub ⚡ Electric Blue & Cyan next-gen creator network worldwide. Connect, post, share stories & reels.',
    website: 'https://viki-social-app.web.app',
    followers: ['user_aarav', 'user_elena', 'user_vikram', 'user_sophia', 'user_zayd'],
    following: ['user_aarav', 'user_elena', 'user_vikram'],
    isVerified: true,
    isPrivate: false,
    isOnline: true,
    showOnlineStatus: true,
    role: 'admin',
    savedPostIds: ['post_1', 'post_3'],
    blockedUserIds: [],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'user_aarav',
    username: 'aarav_sharma',
    fullName: 'Aarav Sharma',
    email: 'aarav@mumbai.tech',
    phoneNumber: '+919876543210',
    country: 'India',
    countryCode: 'IN',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    bio: 'Mobile Engineer & Visual Creator from Mumbai 🇮🇳 Building sleek Android gestures & capturing neon shorelines ⚡',
    website: 'https://aarav.dev',
    followers: ['user_viki_official', 'user_elena', 'user_zayd'],
    following: ['user_viki_official', 'user_elena', 'user_vikram'],
    isVerified: true,
    isPrivate: false,
    isOnline: true,
    showOnlineStatus: true,
    role: 'user',
    savedPostIds: ['post_1'],
    blockedUserIds: [],
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: 'user_elena',
    username: 'elena_visuals',
    fullName: 'Elena Rostova',
    email: 'elena@studio.design',
    phoneNumber: '+447911123456',
    country: 'United Kingdom',
    countryCode: 'GB',
    avatar: portraitImg,
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80',
    bio: 'Cinematic visual designer & night photographer 📸 Cyan & electric blue aesthetics ⚡ London / Berlin',
    website: 'https://elenarostova.art',
    followers: ['user_viki_official', 'user_aarav', 'user_vikram', 'user_sophia'],
    following: ['user_viki_official', 'user_sophia', 'user_aarav'],
    isVerified: true,
    isPrivate: false,
    isOnline: true,
    showOnlineStatus: true,
    role: 'user',
    savedPostIds: ['post_2'],
    blockedUserIds: [],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'user_zayd',
    username: 'zayd_dubai',
    fullName: 'Zayd Al-Mansoor',
    email: 'zayd@emirates.ae',
    phoneNumber: '+971501234567',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&auto=format&fit=crop&q=80',
    bio: 'Architect & drone pilot in Dubai 🇦🇪 Chasing skyscrapers, future tech, and desert horizons 🚁',
    website: 'https://zayd.ae',
    followers: ['user_viki_official', 'user_aarav'],
    following: ['user_viki_official', 'user_elena'],
    isVerified: true,
    isPrivate: false,
    isOnline: false,
    showOnlineStatus: true,
    role: 'user',
    savedPostIds: [],
    blockedUserIds: [],
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
  {
    id: 'user_vikram',
    username: 'vikram_codes',
    fullName: 'Vikram Joshi',
    email: 'vikram@android.dev',
    phoneNumber: '+919811223344',
    country: 'India',
    countryCode: 'IN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    bio: 'Full-stack & Android developer 💻 Electric blue keyboard setup ☕ Open source contributor',
    website: 'https://github.com/vikram',
    followers: ['user_viki_official', 'user_elena'],
    following: ['user_viki_official', 'user_elena', 'user_sophia'],
    isVerified: false,
    isPrivate: false,
    isOnline: true,
    showOnlineStatus: true,
    role: 'user',
    savedPostIds: ['post_1'],
    blockedUserIds: [],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'user_sophia',
    username: 'sophia_travels',
    fullName: 'Sophia Chen',
    email: 'sophia@wanders.world',
    phoneNumber: '+12125550188',
    country: 'United States',
    countryCode: 'US',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
    bio: 'Alpine summits & twilight horizons 🏔️ Exploring national parks and sharing worldwide views 🎒',
    website: 'https://sophiachen.blog',
    followers: ['user_viki_official', 'user_elena', 'user_vikram'],
    following: ['user_viki_official', 'user_elena'],
    isVerified: true,
    isPrivate: false,
    isOnline: true,
    showOnlineStatus: true,
    role: 'user',
    savedPostIds: [],
    blockedUserIds: [],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

// Seed posts
export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_elena',
    username: 'elena_visuals',
    userAvatar: portraitImg,
    isVerified: true,
    mediaUrl: cyberpunkImg,
    mediaType: 'image',
    caption: 'Rain reflections and neon hums in the city. The contrast between electric blue lighting and deep black shadows is unmatched ⚡💎 What city has your favorite night aesthetic?\n\n#vikisocial #electricblue #neonlights #nightcity #cinematic #cyberpunk',
    location: 'Neo Arcade District, London',
    tags: ['vikisocial', 'electricblue', 'neonlights', 'nightcity', 'cinematic', 'cyberpunk'],
    likes: ['user_viki_official', 'user_aarav', 'user_vikram', 'user_sophia', 'user_zayd'],
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        userId: 'user_aarav',
        username: 'aarav_sharma',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        text: 'The electric cyan highlights in this shot are extraordinary Elena! 🔥',
        likes: ['user_elena'],
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'c_2',
        postId: 'post_1',
        userId: 'user_viki_official',
        username: 'viki_social',
        userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        text: 'Featured on the VIKI SOCIAL worldwide explore feed! ⚡🌐',
        likes: ['user_elena', 'user_aarav'],
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'post_2',
    userId: 'user_aarav',
    username: 'aarav_sharma',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Sunset along the Arabian Sea coastline. The cyan tide reflecting against golden sand is pure peace 🌊🇮🇳 Sharing from Mumbai!\n\n#mumbai #india #coastline #travel #goldenhour #vikisocial',
    location: 'Marine Drive, Mumbai, India',
    tags: ['mumbai', 'india', 'coastline', 'travel', 'goldenhour', 'vikisocial'],
    likes: ['user_viki_official', 'user_elena', 'user_zayd'],
    comments: [
      {
        id: 'c_3',
        postId: 'post_2',
        userId: 'user_zayd',
        username: 'zayd_dubai',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        text: 'Beautiful horizon Aarav! Reminds me of our Jumeirah sunset here in Dubai 🇦🇪',
        likes: ['user_aarav'],
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
  },
  {
    id: 'post_3',
    userId: 'user_vikram',
    username: 'vikram_codes',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    isVerified: false,
    mediaUrl: workspaceImg,
    mediaType: 'image',
    caption: 'Deep focus workstation configured with dual monitors and cyan ambient LEDs. Built our Android APK with Capacitor today! ⚡🚀 Smooth 60fps animations.\n\n#androiddev #developer #setup #cyberdeck #coding #vikisocial',
    location: 'Cyber Hub Tech Lab',
    tags: ['androiddev', 'developer', 'setup', 'cyberdeck', 'coding', 'vikisocial'],
    likes: ['user_elena', 'user_viki_official', 'user_aarav'],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'post_4',
    userId: 'user_sophia',
    username: 'sophia_travels',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: mountainImg,
    mediaType: 'image',
    caption: 'Early dawn hike to 2,800m. Frost on the ridge and crystal clear mountain air 🏔️💎 The view is worth every vertical meter.\n\n#alps #mountainview #wanderlust #landscape #vikisocial',
    location: 'Swiss Alps Ridge',
    tags: ['alps', 'mountainview', 'wanderlust', 'landscape', 'vikisocial'],
    likes: ['user_viki_official', 'user_elena', 'user_aarav'],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

// Seed stories (24h expiration)
export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_aarav_1',
    userId: 'user_aarav',
    username: 'aarav_sharma',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Early morning waves at Chowpatty 🌊🇮🇳',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 22).toISOString(),
    viewers: ['user_viki_official', 'user_elena'],
    likes: ['user_elena'],
  },
  {
    id: 'story_elena_1',
    userId: 'user_elena',
    username: 'elena_visuals',
    userAvatar: portraitImg,
    isVerified: true,
    mediaUrl: cyberpunkImg,
    mediaType: 'image',
    caption: 'Late night lens testing in Soho ⚡💎',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 21).toISOString(),
    viewers: ['user_viki_official', 'user_aarav', 'user_vikram'],
    likes: ['user_aarav'],
  },
  {
    id: 'story_zayd_1',
    userId: 'user_zayd',
    username: 'zayd_dubai',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    mediaUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Sunset over Burj Khalifa skyline 🇦🇪✨',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 20).toISOString(),
    viewers: ['user_viki_official'],
    likes: [],
  },
  {
    id: 'story_vikram_1',
    userId: 'user_vikram',
    username: 'vikram_codes',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    isVerified: false,
    mediaUrl: workspaceImg,
    mediaType: 'image',
    caption: 'Coffee + Code = VIKI SOCIAL ☕⚡',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 19).toISOString(),
    viewers: ['user_aarav', 'user_elena'],
    likes: ['user_elena'],
  },
];

// Seed story highlights
export const INITIAL_HIGHLIGHTS: StoryHighlight[] = [
  {
    id: 'hl_aarav_1',
    userId: 'user_aarav',
    title: 'Mumbai 🌊',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    storyIds: ['story_aarav_1'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'hl_elena_1',
    userId: 'user_elena',
    title: 'Neon ⚡',
    coverUrl: cyberpunkImg,
    storyIds: ['story_elena_1'],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
];

// Seed vertical Reels
export const INITIAL_REELS: Reel[] = [
  {
    id: 'reel_1',
    userId: 'user_aarav',
    username: 'aarav_sharma',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-neon-lights-at-night-42861-large.mp4',
    caption: 'Neon city flight across the metropolis ⚡ Electric cyan vibes on VIKI SOCIAL! #cybercity #neon #reels',
    audioTrack: 'Original Audio - VIKI Electronic Beats 🎶',
    likes: ['user_viki_official', 'user_elena', 'user_zayd'],
    comments: [
      {
        id: 'rc_1',
        postId: 'reel_1',
        userId: 'user_elena',
        username: 'elena_visuals',
        userAvatar: portraitImg,
        text: 'The color grading is immaculate! 💎',
        likes: ['user_aarav'],
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    sharesCount: 142,
    tags: ['cybercity', 'neon', 'reels', 'electricblue'],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'reel_2',
    userId: 'user_zayd',
    username: 'zayd_dubai',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    isVerified: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42875-large.mp4',
    caption: 'Night traffic speed-lapse through downtown 🇦🇪 High energy urban flow. #dubai #speed #nightlapse',
    audioTrack: 'Desert Nights - Synthwave Mix 🎧',
    likes: ['user_viki_official', 'user_aarav'],
    comments: [],
    sharesCount: 88,
    tags: ['dubai', 'speed', 'nightlapse'],
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'reel_3',
    userId: 'user_elena',
    username: 'elena_visuals',
    userAvatar: portraitImg,
    isVerified: true,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    caption: 'Cyan tides and crystal blue water 🌊 Pure meditation. Where is your favorite coastal escape? #ocean #cyan #zen',
    audioTrack: 'Ocean Waves & Ambient Piano 🎹',
    likes: ['user_viki_official', 'user_aarav', 'user_vikram'],
    comments: [],
    sharesCount: 204,
    tags: ['ocean', 'cyan', 'zen'],
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

// Seed messages
export const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_aarav_elena',
    senderId: 'user_elena',
    receiverId: 'user_aarav',
    text: 'Hey Aarav! Loving the new VIKI SOCIAL electric theme and your Mumbai coastline reel!',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    isRead: true,
  },
  {
    id: 'msg_2',
    conversationId: 'conv_aarav_elena',
    senderId: 'user_aarav',
    receiverId: 'user_elena',
    text: 'Thanks Elena! The cyan and electric blue palette looks so sharp on Android screens ⚡',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: true,
    isLiked: true,
  },
  {
    id: 'msg_3',
    conversationId: 'conv_aarav_elena',
    senderId: 'user_elena',
    receiverId: 'user_aarav',
    text: 'Are you publishing the Capacitor build for Google Play store next?',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isRead: false,
  },
];

// Seed notifications
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    recipientId: 'user_aarav',
    senderId: 'user_viki_official',
    senderUsername: 'viki_social',
    senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    type: 'like',
    postId: 'post_2',
    postMediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80',
    text: 'liked your coastline photography post.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'notif_2',
    recipientId: 'user_aarav',
    senderId: 'user_elena',
    senderUsername: 'elena_visuals',
    senderAvatar: portraitImg,
    type: 'comment',
    postId: 'reel_1',
    text: 'commented on your reel: "The color grading is immaculate! 💎"',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'notif_3',
    recipientId: 'user_aarav',
    senderId: 'user_zayd',
    senderUsername: 'zayd_dubai',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    type: 'follow',
    text: 'started following you from UAE 🇦🇪.',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
];

// Seed reports for admin moderation
export const INITIAL_REPORTS: ReportedItem[] = [
  {
    id: 'rep_1',
    reporterId: 'user_vikram',
    targetType: 'post',
    targetId: 'post_4',
    reason: 'Suspicious duplicate tag usage',
    details: 'User reported potential automated spam tags.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

class VikiDatabase {
  private users: User[] = [];
  private posts: Post[] = [];
  private stories: Story[] = [];
  private highlights: StoryHighlight[] = [];
  private reels: Reel[] = [];
  private messages: DirectMessage[] = [];
  private notifications: AppNotification[] = [];
  private reports: ReportedItem[] = [];
  private currentUserId: string = 'user_aarav';

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_USERS];
      if (!storedUsers) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));

      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      this.posts = storedPosts ? JSON.parse(storedPosts) : [...INITIAL_POSTS];
      if (!storedPosts) localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(this.posts));

      const storedStories = localStorage.getItem(STORAGE_KEYS.STORIES);
      this.stories = storedStories ? JSON.parse(storedStories) : [...INITIAL_STORIES];
      if (!storedStories) localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(this.stories));

      const storedHighlights = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      this.highlights = storedHighlights ? JSON.parse(storedHighlights) : [...INITIAL_HIGHLIGHTS];
      if (!storedHighlights) localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(this.highlights));

      const storedReels = localStorage.getItem(STORAGE_KEYS.REELS);
      this.reels = storedReels ? JSON.parse(storedReels) : [...INITIAL_REELS];
      if (!storedReels) localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(this.reels));

      const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      this.messages = storedMessages ? JSON.parse(storedMessages) : [...INITIAL_MESSAGES];
      if (!storedMessages) localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages));

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : [...INITIAL_NOTIFICATIONS];
      if (!storedNotifs) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));

      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      this.reports = storedReports ? JSON.parse(storedReports) : [...INITIAL_REPORTS];
      if (!storedReports) localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      this.currentUserId = storedUser || 'user_aarav';
      if (!storedUser) localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, this.currentUserId);
    } catch (e) {
      console.warn('Storage fallback error', e);
      this.users = [...INITIAL_USERS];
      this.posts = [...INITIAL_POSTS];
      this.stories = [...INITIAL_STORIES];
      this.highlights = [...INITIAL_HIGHLIGHTS];
      this.reels = [...INITIAL_REELS];
      this.messages = [...INITIAL_MESSAGES];
      this.notifications = [...INITIAL_NOTIFICATIONS];
      this.reports = [...INITIAL_REPORTS];
      this.currentUserId = 'user_aarav';
    }
  }

  private save<T>(key: string, data: T) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }

  // --- Auth & Users ---
  getCurrentUser(): User {
    const user = this.users.find(u => u.id === this.currentUserId);
    return user || this.users[0];
  }

  setCurrentUser(userId: string): User {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUserId = userId;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
      return user;
    }
    return this.getCurrentUser();
  }

  getUsers(): User[] {
    return this.users.filter(u => !u.isSuspended);
  }

  getAllUsersForAdmin(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  login(identifier: string, password?: string): { success: boolean; user?: User; error?: string } {
    const clean = identifier.trim().toLowerCase();
    const user = this.users.find(
      u => u.username.toLowerCase() === clean ||
           u.email.toLowerCase() === clean ||
           (u.phoneNumber && u.phoneNumber.replace(/[\s-]/g, '') === clean.replace(/[\s-]/g, ''))
    );
    if (!user) {
      return { success: false, error: 'Account not found. Please verify your credentials or create an account.' };
    }
    if (user.isSuspended) {
      return { success: false, error: 'This account has been suspended by an administrator for policy violations.' };
    }
    if (user.password && password && user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    this.setCurrentUser(user.id);
    return { success: true, user };
  }

  loginWithPhoneOtp(phoneNumber: string, otp: string): { success: boolean; user?: User; error?: string } {
    if (otp !== '123456' && otp.length !== 6) {
      return { success: false, error: 'Invalid 6-digit OTP code. (Use 123456 for instant login)' };
    }
    const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
    let user = this.users.find(u => u.phoneNumber && u.phoneNumber.replace(/[\s-]/g, '') === cleanPhone);

    if (!user) {
      // Auto register user with phone number
      const randomSeed = Math.floor(1000 + Math.random() * 9000);
      const newUsername = `viki_user_${randomSeed}`;
      user = {
        id: `user_${Date.now()}`,
        username: newUsername,
        fullName: `User ${randomSeed}`,
        email: `${newUsername}@vikisocial.app`,
        phoneNumber: cleanPhone,
        country: 'India',
        countryCode: 'IN',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${newUsername}&backgroundColor=0066ff,00f0ff`,
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80',
        bio: 'Connecting globally on VIKI SOCIAL ⚡',
        website: '',
        followers: ['user_viki_official'],
        following: ['user_viki_official'],
        isVerified: false,
        isPrivate: false,
        isOnline: true,
        showOnlineStatus: true,
        role: 'user',
        savedPostIds: [],
        blockedUserIds: [],
        createdAt: new Date().toISOString(),
      };
      this.users.unshift(user);
      this.save(STORAGE_KEYS.USERS, this.users);
    }

    if (user.isSuspended) {
      return { success: false, error: 'This account has been suspended by an administrator.' };
    }

    this.setCurrentUser(user.id);
    return { success: true, user };
  }

  signUp(data: {
    username: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    country?: string;
    countryCode?: string;
    password?: string;
    avatar?: string;
    coverImage?: string;
    bio?: string;
    website?: string;
  }): { success: boolean; user?: User; error?: string } {
    const cleanUsername = data.username.trim().replace(/^@/, '').toLowerCase();
    if (!cleanUsername) return { success: false, error: 'Username is required.' };

    const exists = this.users.some(
      u => u.username.toLowerCase() === cleanUsername ||
           (data.email && u.email.toLowerCase() === data.email.trim().toLowerCase())
    );
    if (exists) {
      return { success: false, error: 'Username or email already taken.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: cleanUsername,
      fullName: data.fullName.trim() || cleanUsername,
      email: data.email.trim() || `${cleanUsername}@vikisocial.app`,
      phoneNumber: data.phoneNumber,
      country: data.country || 'India',
      countryCode: data.countryCode || 'IN',
      password: data.password,
      avatar: data.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername}&backgroundColor=0066ff,00f0ff`,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80',
      bio: data.bio || 'Exploring VIKI SOCIAL ⚡ Connect, post, share stories & reels.',
      website: data.website || '',
      followers: ['user_viki_official'],
      following: ['user_viki_official'],
      isVerified: false,
      isPrivate: false,
      isOnline: true,
      showOnlineStatus: true,
      role: 'user',
      savedPostIds: [],
      blockedUserIds: [],
      createdAt: new Date().toISOString(),
    };

    this.users.unshift(newUser);
    this.save(STORAGE_KEYS.USERS, this.users);
    this.setCurrentUser(newUser.id);

    this.addNotification({
      recipientId: newUser.id,
      senderId: 'user_viki_official',
      senderUsername: 'viki_social',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      type: 'follow',
      text: 'Welcome to VIKI SOCIAL! We are thrilled to have you here ⚡🌐',
    });

    return { success: true, user: newUser };
  }

  updateProfile(userId: string, data: Partial<User>): User {
    this.users = this.users.map(u => {
      if (u.id === userId) {
        return { ...u, ...data };
      }
      return u;
    });
    this.save(STORAGE_KEYS.USERS, this.users);
    return this.getCurrentUser();
  }

  toggleFollow(targetUserId: string, currentUserId: string): boolean {
    let isNowFollowing = false;
    this.users = this.users.map(u => {
      if (u.id === currentUserId) {
        const following = [...u.following];
        const idx = following.indexOf(targetUserId);
        if (idx >= 0) {
          following.splice(idx, 1);
          isNowFollowing = false;
        } else {
          following.push(targetUserId);
          isNowFollowing = true;
        }
        return { ...u, following };
      }
      if (u.id === targetUserId) {
        const followers = [...u.followers];
        const idx = followers.indexOf(currentUserId);
        if (idx >= 0) {
          followers.splice(idx, 1);
        } else {
          followers.push(currentUserId);
        }
        return { ...u, followers };
      }
      return u;
    });
    this.save(STORAGE_KEYS.USERS, this.users);

    if (isNowFollowing) {
      const currentUser = this.getUserById(currentUserId);
      if (currentUser) {
        this.addNotification({
          recipientId: targetUserId,
          senderId: currentUserId,
          senderUsername: currentUser.username,
          senderAvatar: currentUser.avatar,
          type: 'follow',
          text: 'started following you.',
        });
      }
    }

    return isNowFollowing;
  }

  toggleBlockUser(currentUserId: string, targetUserId: string): boolean {
    let isBlocked = false;
    this.users = this.users.map(u => {
      if (u.id === currentUserId) {
        const blocked = [...(u.blockedUserIds || [])];
        const idx = blocked.indexOf(targetUserId);
        if (idx >= 0) {
          blocked.splice(idx, 1);
          isBlocked = false;
        } else {
          blocked.push(targetUserId);
          isBlocked = true;
        }
        return { ...u, blockedUserIds: blocked };
      }
      return u;
    });
    this.save(STORAGE_KEYS.USERS, this.users);
    return isBlocked;
  }

  toggleSavePost(postId: string, userId: string): boolean {
    let isSaved = false;
    this.users = this.users.map(u => {
      if (u.id === userId) {
        const saved = [...(u.savedPostIds || [])];
        const idx = saved.indexOf(postId);
        if (idx >= 0) {
          saved.splice(idx, 1);
          isSaved = false;
        } else {
          saved.push(postId);
          isSaved = true;
        }
        return { ...u, savedPostIds: saved };
      }
      return u;
    });
    this.save(STORAGE_KEYS.USERS, this.users);
    return isSaved;
  }

  // --- Posts ---
  getPosts(): Post[] {
    const currentUser = this.getCurrentUser();
    const blocked = currentUser.blockedUserIds || [];
    return this.posts.filter(p => !blocked.includes(p.userId));
  }

  getPostById(id: string): Post | undefined {
    return this.posts.find(p => p.id === id);
  }

  createPost(data: {
    userId: string;
    mediaUrl: string;
    mediaType?: 'image' | 'video';
    caption: string;
    filter?: string;
    location?: string;
    tags?: string[];
  }): Post {
    const user = this.getUserById(data.userId) || this.getCurrentUser();
    const extractedTags = (data.caption.match(/#[a-zA-Z0-9_]+/g) || []).map(t => t.slice(1).toLowerCase());
    const finalTags = Array.from(new Set([...(data.tags || []), ...extractedTags]));

    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      isVerified: user.isVerified,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType || 'image',
      filter: data.filter || 'normal',
      caption: data.caption,
      location: data.location || '',
      tags: finalTags,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    this.posts.unshift(newPost);
    this.save(STORAGE_KEYS.POSTS, this.posts);
    return newPost;
  }

  deletePost(postId: string): boolean {
    const initial = this.posts.length;
    this.posts = this.posts.filter(p => p.id !== postId);
    this.save(STORAGE_KEYS.POSTS, this.posts);
    return this.posts.length < initial;
  }

  toggleLikePost(postId: string, userId: string): boolean {
    let liked = false;
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        const likes = [...p.likes];
        const idx = likes.indexOf(userId);
        if (idx >= 0) {
          likes.splice(idx, 1);
          liked = false;
        } else {
          likes.push(userId);
          liked = true;
        }
        return { ...p, likes };
      }
      return p;
    });
    this.save(STORAGE_KEYS.POSTS, this.posts);

    if (liked) {
      const post = this.getPostById(postId);
      const user = this.getUserById(userId);
      if (post && user && post.userId !== userId) {
        this.addNotification({
          recipientId: post.userId,
          senderId: userId,
          senderUsername: user.username,
          senderAvatar: user.avatar,
          type: 'like',
          postId: post.id,
          postMediaUrl: post.mediaUrl,
          text: 'liked your post.',
        });
      }
    }

    return liked;
  }

  addComment(postId: string, userId: string, text: string) {
    const user = this.getUserById(userId) || this.getCurrentUser();
    const comment = {
      id: `c_${Date.now()}`,
      postId,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      text: text.trim(),
      likes: [],
      createdAt: new Date().toISOString(),
    };

    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, comment] };
      }
      return p;
    });
    this.save(STORAGE_KEYS.POSTS, this.posts);

    const post = this.getPostById(postId);
    if (post && post.userId !== userId) {
      this.addNotification({
        recipientId: post.userId,
        senderId: userId,
        senderUsername: user.username,
        senderAvatar: user.avatar,
        type: 'comment',
        postId: post.id,
        postMediaUrl: post.mediaUrl,
        text: `commented: "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}"`,
      });
    }

    return comment;
  }

  deleteComment(postId: string, commentId: string) {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
      }
      return p;
    });
    this.save(STORAGE_KEYS.POSTS, this.posts);
  }

  toggleLikeComment(postId: string, commentId: string, userId: string): boolean {
    let liked = false;
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const likes = [...c.likes];
              const idx = likes.indexOf(userId);
              if (idx >= 0) {
                likes.splice(idx, 1);
                liked = false;
              } else {
                likes.push(userId);
                liked = true;
              }
              return { ...c, likes };
            }
            return c;
          }),
        };
      }
      return p;
    });
    this.save(STORAGE_KEYS.POSTS, this.posts);
    return liked;
  }

  // --- Stories ---
  getStories(): Story[] {
    const now = Date.now();
    const currentUser = this.getCurrentUser();
    const blocked = currentUser.blockedUserIds || [];
    return this.stories
      .filter(s => new Date(s.expiresAt).getTime() > now && !blocked.includes(s.userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllStories(): Story[] {
    return [...this.stories];
  }

  getUserActiveStories(userId: string): Story[] {
    const now = Date.now();
    return this.stories
      .filter(s => s.userId === userId && new Date(s.expiresAt).getTime() > now)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getUserAllStories(userId: string): Story[] {
    return this.stories
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getStoryById(id: string): Story | undefined {
    return this.stories.find(s => s.id === id);
  }

  createStory(data: {
    userId: string;
    mediaUrl: string;
    mediaType?: 'image' | 'video';
    caption?: string;
    filter?: string;
  }): Story {
    const user = this.getUserById(data.userId) || this.getCurrentUser();
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      isVerified: user.isVerified,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType || 'image',
      caption: data.caption || '',
      filter: data.filter || 'normal',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      viewers: [],
      likes: [],
    };

    this.stories.unshift(newStory);
    this.save(STORAGE_KEYS.STORIES, this.stories);
    return newStory;
  }

  deleteStory(storyId: string): boolean {
    const initialCount = this.stories.length;
    this.stories = this.stories.filter(s => s.id !== storyId);
    this.save(STORAGE_KEYS.STORIES, this.stories);
    this.highlights = this.highlights.map(h => ({
      ...h,
      storyIds: h.storyIds.filter(id => id !== storyId),
    }));
    this.save(STORAGE_KEYS.HIGHLIGHTS, this.highlights);
    return this.stories.length < initialCount;
  }

  markStoryViewed(storyId: string, userId: string) {
    this.stories = this.stories.map(s => {
      if (s.id === storyId && !s.viewers.includes(userId)) {
        return { ...s, viewers: [...s.viewers, userId] };
      }
      return s;
    });
    this.save(STORAGE_KEYS.STORIES, this.stories);
  }

  toggleLikeStory(storyId: string, userId: string): boolean {
    let liked = false;
    this.stories = this.stories.map(s => {
      if (s.id === storyId) {
        const currentLikes = s.likes || [];
        const idx = currentLikes.indexOf(userId);
        let updatedLikes: string[];
        if (idx >= 0) {
          updatedLikes = currentLikes.filter(id => id !== userId);
          liked = false;
        } else {
          updatedLikes = [...currentLikes, userId];
          liked = true;
        }
        return { ...s, likes: updatedLikes };
      }
      return s;
    });
    this.save(STORAGE_KEYS.STORIES, this.stories);

    if (liked) {
      const story = this.getStoryById(storyId);
      const user = this.getUserById(userId);
      if (story && user && story.userId !== userId) {
        this.addNotification({
          recipientId: story.userId,
          senderId: userId,
          senderUsername: user.username,
          senderAvatar: user.avatar,
          type: 'like',
          postMediaUrl: story.mediaUrl,
          text: 'liked your story.',
        });
      }
    }

    return liked;
  }

  // --- Story Highlights ---
  getHighlights(userId?: string): StoryHighlight[] {
    if (userId) {
      return this.highlights.filter(h => h.userId === userId);
    }
    return [...this.highlights];
  }

  getHighlightById(id: string): StoryHighlight | undefined {
    return this.highlights.find(h => h.id === id);
  }

  createHighlight(data: {
    userId: string;
    title: string;
    coverUrl?: string;
    storyIds: string[];
  }): StoryHighlight {
    let coverUrl = data.coverUrl;
    if (!coverUrl && data.storyIds.length > 0) {
      const firstStory = this.getStoryById(data.storyIds[0]);
      if (firstStory) coverUrl = firstStory.mediaUrl;
    }

    const newHighlight: StoryHighlight = {
      id: `hl_${Date.now()}`,
      userId: data.userId,
      title: data.title.trim() || 'Highlight',
      coverUrl: coverUrl || cyberpunkImg,
      storyIds: data.storyIds,
      createdAt: new Date().toISOString(),
    };

    this.highlights.unshift(newHighlight);
    this.save(STORAGE_KEYS.HIGHLIGHTS, this.highlights);
    return newHighlight;
  }

  deleteHighlight(highlightId: string): boolean {
    const initialCount = this.highlights.length;
    this.highlights = this.highlights.filter(h => h.id !== highlightId);
    this.save(STORAGE_KEYS.HIGHLIGHTS, this.highlights);
    return this.highlights.length < initialCount;
  }

  addStoryToHighlight(highlightId: string, storyId: string): boolean {
    let updated = false;
    this.highlights = this.highlights.map(h => {
      if (h.id === highlightId) {
        if (!h.storyIds.includes(storyId)) {
          updated = true;
          return { ...h, storyIds: [...h.storyIds, storyId] };
        }
      }
      return h;
    });
    if (updated) this.save(STORAGE_KEYS.HIGHLIGHTS, this.highlights);
    return updated;
  }

  removeStoryFromHighlight(highlightId: string, storyId: string): boolean {
    let updated = false;
    this.highlights = this.highlights.map(h => {
      if (h.id === highlightId) {
        if (h.storyIds.includes(storyId)) {
          updated = true;
          return { ...h, storyIds: h.storyIds.filter(id => id !== storyId) };
        }
      }
      return h;
    });
    if (updated) this.save(STORAGE_KEYS.HIGHLIGHTS, this.highlights);
    return updated;
  }

  // --- Vertical Reels ---
  getReels(): Reel[] {
    const currentUser = this.getCurrentUser();
    const blocked = currentUser.blockedUserIds || [];
    return this.reels.filter(r => !blocked.includes(r.userId));
  }

  getReelById(id: string): Reel | undefined {
    return this.reels.find(r => r.id === id);
  }

  createReel(data: {
    userId: string;
    videoUrl: string;
    caption: string;
    audioTrack?: string;
    tags?: string[];
  }): Reel {
    const user = this.getUserById(data.userId) || this.getCurrentUser();
    const extractedTags = (data.caption.match(/#[a-zA-Z0-9_]+/g) || []).map(t => t.slice(1).toLowerCase());
    const finalTags = Array.from(new Set([...(data.tags || []), ...extractedTags]));

    const newReel: Reel = {
      id: `reel_${Date.now()}`,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      isVerified: user.isVerified,
      videoUrl: data.videoUrl,
      caption: data.caption,
      audioTrack: data.audioTrack || 'Original Audio - VIKI Beats 🎶',
      likes: [],
      comments: [],
      sharesCount: 0,
      tags: finalTags,
      createdAt: new Date().toISOString(),
    };

    this.reels.unshift(newReel);
    this.save(STORAGE_KEYS.REELS, this.reels);
    return newReel;
  }

  toggleLikeReel(reelId: string, userId: string): boolean {
    let liked = false;
    this.reels = this.reels.map(r => {
      if (r.id === reelId) {
        const likes = [...r.likes];
        const idx = likes.indexOf(userId);
        if (idx >= 0) {
          likes.splice(idx, 1);
          liked = false;
        } else {
          likes.push(userId);
          liked = true;
        }
        return { ...r, likes };
      }
      return r;
    });
    this.save(STORAGE_KEYS.REELS, this.reels);
    return liked;
  }

  addReelComment(reelId: string, userId: string, text: string) {
    const user = this.getUserById(userId) || this.getCurrentUser();
    const comment = {
      id: `rc_${Date.now()}`,
      postId: reelId,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      text: text.trim(),
      likes: [],
      createdAt: new Date().toISOString(),
    };

    this.reels = this.reels.map(r => {
      if (r.id === reelId) {
        return { ...r, comments: [...r.comments, comment] };
      }
      return r;
    });
    this.save(STORAGE_KEYS.REELS, this.reels);
    return comment;
  }

  deleteReel(reelId: string): boolean {
    const initial = this.reels.length;
    this.reels = this.reels.filter(r => r.id !== reelId);
    this.save(STORAGE_KEYS.REELS, this.reels);
    return this.reels.length < initial;
  }

  // --- Messages & Chat ---
  getMessagesForUsers(userA: string, userB: string): DirectMessage[] {
    return this.messages
      .filter(
        m =>
          (m.senderId === userA && m.receiverId === userB) ||
          (m.senderId === userB && m.receiverId === userA)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  sendMessage(data: {
    senderId: string;
    receiverId: string;
    text: string;
    mediaUrl?: string;
  }): DirectMessage {
    const sorted = [data.senderId, data.receiverId].sort();
    const convId = `conv_${sorted[0]}_${sorted[1]}`;

    const newMsg: DirectMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      conversationId: convId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      text: data.text.trim(),
      mediaUrl: data.mediaUrl,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    this.messages.push(newMsg);
    this.save(STORAGE_KEYS.MESSAGES, this.messages);
    return newMsg;
  }

  toggleLikeMessage(messageId: string): boolean {
    let liked = false;
    this.messages = this.messages.map(m => {
      if (m.id === messageId) {
        liked = !m.isLiked;
        return { ...m, isLiked: liked };
      }
      return m;
    });
    this.save(STORAGE_KEYS.MESSAGES, this.messages);
    return liked;
  }

  markConversationRead(otherUserId: string, currentUserId: string) {
    this.messages = this.messages.map(m => {
      if (m.senderId === otherUserId && m.receiverId === currentUserId) {
        return { ...m, isRead: true };
      }
      return m;
    });
    this.save(STORAGE_KEYS.MESSAGES, this.messages);
  }

  // --- Notifications ---
  getNotifications(userId: string): AppNotification[] {
    return this.notifications
      .filter(n => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addNotification(data: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    return newNotif;
  }

  markNotificationRead(notificationId: string) {
    this.notifications = this.notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  markAllNotificationsRead(userId: string) {
    this.notifications = this.notifications.map(n =>
      n.recipientId === userId ? { ...n, isRead: true } : n
    );
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  // --- Moderation & Reports ---
  reportContent(
    reporterId: string,
    targetType: 'post' | 'user' | 'reel' | 'comment',
    targetId: string,
    reason: string,
    details?: string
  ): ReportedItem {
    const report: ReportedItem = {
      id: `rep_${Date.now()}`,
      reporterId,
      targetType,
      targetId,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.reports.unshift(report);
    this.save(STORAGE_KEYS.REPORTS, this.reports);
    return report;
  }

  getReports(): ReportedItem[] {
    return [...this.reports];
  }

  resolveReport(reportId: string, action: 'resolve' | 'dismiss') {
    this.reports = this.reports.map(r => {
      if (r.id === reportId) {
        return { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' };
      }
      return r;
    });
    this.save(STORAGE_KEYS.REPORTS, this.reports);
  }

  toggleSuspendUser(userId: string): boolean {
    let suspended = false;
    this.users = this.users.map(u => {
      if (u.id === userId) {
        suspended = !u.isSuspended;
        return { ...u, isSuspended: suspended };
      }
      return u;
    });
    this.save(STORAGE_KEYS.USERS, this.users);
    return suspended;
  }

  getAdminStats() {
    const now = Date.now();
    return {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.isOnline).length,
      totalPosts: this.posts.length,
      totalReels: this.reels.length,
      totalStories: this.stories.filter(s => new Date(s.expiresAt).getTime() > now).length,
      pendingReports: this.reports.filter(r => r.status === 'pending').length,
    };
  }

  resetDatabase() {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.STORIES);
    localStorage.removeItem(STORAGE_KEYS.HIGHLIGHTS);
    localStorage.removeItem(STORAGE_KEYS.REELS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    this.init();
  }
}

export const db = new VikiDatabase();
