import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Image as ImageIcon, Mic, Heart, Phone, Video, Search, Check, CheckCheck } from 'lucide-react';
import { DirectMessage, User } from '../../types';
import { db } from '../../services/db';

interface DirectMessagesViewProps {
  currentUser: User;
  onBack: () => void;
  initialChatUserId?: string;
  isDark: boolean;
}

const BOT_REPLIES: Record<string, string[]> = {
  elena_visuals: [
    'Hey! That’s so awesome to hear! 💜',
    'I took that with a 35mm f/1.4 Leica lens in the arcade district!',
    'Are you going to post any street shots on Viki soon? Tag me so I can repost it to my story!',
    'Thanks so much for reaching out! Let’s collaborate on a series ✨',
  ],
  vikram_codes: [
    'Hey! Thanks for messaging. Always great meeting another developer on Viki!',
    'The Android app was built with Jetpack Compose & modern design tokens. How do you like the animations?',
    'I just pushed an update for the double-tap heart gesture! Try it on the home feed 🔥',
  ],
  sophia_travels: [
    'Ciao! Just got back to base camp after climbing the north face 🏔️',
    'The sunrise was completely pink and magenta today! I’ll post the clip later.',
    'You should totally visit! The hiking trails here are unbelievable 🎒',
  ],
  marcus_ambient: [
    'Yo! Working on a new synthwave track in the studio right now 🎧',
    'Drinking dark roast espresso and layering some analog pads. Have you heard my latest snippet?',
  ],
};

export const DirectMessagesView: React.FC<DirectMessagesViewProps> = ({
  currentUser,
  onBack,
  initialChatUserId,
  isDark,
}) => {
  const allUsers = db.getUsers().filter(u => u.id !== currentUser.id);

  const [selectedUser, setSelectedUser] = useState<User | null>(() => {
    if (initialChatUserId) {
      return allUsers.find(u => u.id === initialChatUserId) || null;
    }
    return null;
  });

  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [callToast, setCallToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // Load messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      db.markConversationRead(selectedUser.id, currentUser.id);
      const msgs = db.getMessagesForUsers(currentUser.id, selectedUser.id);
      setMessages(msgs);
    }
  }, [selectedUser, currentUser.id]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Voice note recording simulation
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecordingAndSend = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    if (!selectedUser) return;

    const audioMsgText = `🎙️ Voice Note (${recordingSeconds}s)`;
    const newMsg = db.sendMessage({
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text: audioMsgText,
    });
    setMessages(prev => [...prev, newMsg]);
    setRecordingSeconds(0);
    triggerBotReply(selectedUser);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedUser) return;

    const text = inputText.trim();
    setInputText('');

    const newMsg = db.sendMessage({
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text,
    });
    setMessages(prev => [...prev, newMsg]);

    triggerBotReply(selectedUser);
  };

  const handleImageSend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newMsg = db.sendMessage({
          senderId: currentUser.id,
          receiverId: selectedUser.id,
          text: '📷 Photo shared',
          mediaUrl: event.target.result as string,
        });
        setMessages(prev => [...prev, newMsg]);
        triggerBotReply(selectedUser);
      }
    };
    reader.readAsDataURL(file);
  };

  // Bot auto-reply generator
  const triggerBotReply = (partner: User) => {
    setIsTyping(true);
    const delay = 1200 + Math.random() * 800;

    setTimeout(() => {
      setIsTyping(false);
      const responses = BOT_REPLIES[partner.username] || [
        'Hey! Thanks for your message! 💜',
        'Loved connecting with you on Viki!',
        'Sounds great, let’s stay in touch!',
      ];
      const randomText = responses[Math.floor(Math.random() * responses.length)];

      const botMsg = db.sendMessage({
        senderId: partner.id,
        receiverId: currentUser.id,
        text: randomText,
      });

      setMessages(prev => [...prev, botMsg]);
    }, delay);
  };

  const handleToggleLike = (msgId: string) => {
    const isLiked = db.toggleLikeMessage(msgId);
    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, isLiked } : m))
    );
  };

  const filteredUsers = allUsers.filter(
    u =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-colors ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
      }`}
    >
      {/* 1. Inbox View (when no chat selected) */}
      {!selectedUser ? (
        <div className="flex-1 flex flex-col h-full">
          {/* Inbox Header */}
          <div
            className={`h-14 px-4 border-b flex items-center justify-between ${
              isDark ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-100 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-1 rounded-full hover:bg-zinc-800/40"
                aria-label="Back to feed"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base">{currentUser.username}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
            <span className="text-xs text-purple-400 font-semibold">Messages</span>
          </div>

          {/* Search Contacts */}
          <div className="p-3 border-b border-zinc-900">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl ${
                isDark ? 'bg-zinc-900' : 'bg-zinc-100'
              }`}
            >
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search direct messages..."
                className="w-full bg-transparent text-xs focus:outline-none placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
            {filteredUsers.map(user => {
              const userMessages = db.getMessagesForUsers(currentUser.id, user.id);
              const lastMsg = userMessages[userMessages.length - 1];
              const unreadCount = userMessages.filter(
                m => m.senderId === user.id && !m.isRead
              ).length;

              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-zinc-900/80' : 'hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-purple-500/30">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs tracking-tight truncate">
                          {user.username}
                        </span>
                        {lastMsg && (
                          <span className="text-[10px] text-zinc-500">
                            {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {lastMsg ? lastMsg.text : 'Tap to start conversation'}
                      </p>
                    </div>
                  </div>

                  {unreadCount > 0 && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. Active Chat Conversation Thread */
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div
            className={`h-14 px-4 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-zinc-900 bg-zinc-950/90' : 'border-zinc-100 bg-white/95'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-full hover:bg-zinc-800/40"
                aria-label="Back to messages"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-purple-500">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs tracking-tight">
                    {selectedUser.username}
                  </span>
                  {selectedUser.isVerified && (
                    <span className="text-[10px] text-purple-400">✓</span>
                  )}
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Active now</span>
                </span>
              </div>
            </div>

            {/* Simulated Call Buttons */}
            <div className="flex items-center gap-1 text-zinc-400">
              <button
                onClick={() => {
                  setCallToast(`Calling ${selectedUser.username}... (Demo Audio Call)`);
                  setTimeout(() => setCallToast(null), 2500);
                }}
                className="p-2 rounded-full hover:text-white hover:bg-zinc-800/40"
                aria-label="Audio call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCallToast(`Connecting video call with ${selectedUser.username}...`);
                  setTimeout(() => setCallToast(null), 2500);
                }}
                className="p-2 rounded-full hover:text-white hover:bg-zinc-800/40"
                aria-label="Video call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Call Toast Banner */}
          {callToast && (
            <div className="px-4 py-2 bg-purple-600/90 text-white text-xs font-semibold flex items-center justify-between animate-fade-in shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>{callToast}</span>
              </div>
              <button onClick={() => setCallToast(null)} className="text-[10px] underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-purple-500/40">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.username}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-sm text-zinc-200">
                  {selectedUser.fullName}
                </h4>
                <p className="text-xs text-zinc-400 mt-1">{selectedUser.bio}</p>
                <p className="text-xs text-purple-400 mt-3">
                  Say hi to start the conversation! 💜
                </p>
              </div>
            ) : (
              messages.map(m => {
                const isMine = m.senderId === currentUser.id;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      onDoubleClick={() => handleToggleLike(m.id)}
                      className={`relative max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed select-none ${
                        isMine
                          ? 'bg-gradient-to-r from-[#0066FF] to-[#0A84FF] text-white rounded-br-xs shadow-md shadow-[#0066FF]/20'
                          : isDark
                          ? 'bg-zinc-900 text-zinc-100 rounded-bl-xs border border-zinc-800'
                          : 'bg-zinc-100 text-zinc-900 rounded-bl-xs border border-zinc-200'
                      }`}
                    >
                      {m.mediaUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden max-h-52">
                          <img
                            src={m.mediaUrl}
                            alt="Attached"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p>{m.text}</p>

                      {/* Heart like reaction badge */}
                      {m.isLiked && (
                        <div className="absolute -bottom-2 right-2 w-5 h-5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-md">
                          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-500 px-1">
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMine && (
                        <CheckCheck className="w-3 h-3 text-purple-400" />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs italic">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.username}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse delay-200" />
                  <span className="text-[11px] ml-1">{selectedUser.username} is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recording Active Bar */}
          {isRecording && (
            <div className="px-4 py-2 bg-purple-950/80 border-t border-purple-800 flex items-center justify-between text-xs text-purple-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono">Recording: {recordingSeconds}s</span>
              </div>
              <button
                onClick={handleStopRecordingAndSend}
                className="px-3 py-1 bg-purple-600 text-white rounded-full font-semibold"
              >
                Send Voice Note
              </button>
            </div>
          )}

          {/* Bottom Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className={`p-3 border-t flex items-center gap-2 shrink-0 ${
              isDark ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-100 bg-white'
            }`}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-zinc-400 hover:text-purple-400 transition-colors"
              title="Attach photo"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSend}
            />

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message..."
              className={`flex-1 text-xs px-4 py-2.5 rounded-full focus:outline-none transition-colors ${
                isDark
                  ? 'bg-zinc-900 text-white placeholder-zinc-500 focus:ring-1 focus:ring-purple-500 border border-zinc-800'
                  : 'bg-zinc-100 text-zinc-900 placeholder-zinc-400 focus:ring-1 focus:ring-purple-600 border border-zinc-200'
              }`}
            />

            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-500 active:scale-95 transition-all shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={isRecording ? handleStopRecordingAndSend : handleStartRecording}
                className={`p-2.5 rounded-full transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-zinc-400 hover:text-purple-400'
                }`}
                title="Hold or tap to record voice note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
