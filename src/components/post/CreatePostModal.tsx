import React, { useState, useRef } from 'react';
import {
  X,
  ImagePlus,
  Camera,
  MapPin,
  Sparkles,
  Wand2,
  ChevronLeft,
  Smartphone,
  Smile,
  RefreshCw,
  Crop,
  Film,
} from 'lucide-react';
import { User } from '../../types';
import { db } from '../../services/db';
import { mediaStorage } from '../../services/indexedDb';

// Sample presets for quick testing
import cyberpunkImg from '../../assets/images/viki_cyberpunk_neon_1793453380162.jpg';
import portraitImg from '../../assets/images/viki_portrait_creator_1793453380952.jpg';
import coffeeImg from '../../assets/images/viki_coffee_minimal_1793453380794.jpg';
import mountainImg from '../../assets/images/viki_travel_mountain_1793453381677.jpg';
import workspaceImg from '../../assets/images/viki_tech_workspace_1793453381321.jpg';

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onPostCreated: () => void;
  isDark: boolean;
  defaultMode?: 'post' | 'story' | 'reel';
}

const FILTERS = [
  { id: 'normal', name: 'Normal', css: 'none' },
  { id: 'electric', name: 'Electric Cyan', css: 'contrast(120%) saturate(140%) hue-rotate(185deg)' },
  { id: 'cyber', name: 'Cyber Blue', css: 'contrast(125%) saturate(160%) hue-rotate(200deg)' },
  { id: 'monolith', name: 'Monolith B&W', css: 'grayscale(100%) contrast(130%)' },
  { id: 'sunset', name: 'Golden Hour', css: 'contrast(110%) saturate(130%) sepia(30%)' },
  { id: 'vintage', name: 'Vintage 90s', css: 'sepia(45%) contrast(95%) saturate(85%)' },
];

const PRESET_LOCATIONS = [
  'Mumbai, Marine Drive, India 🇮🇳',
  'Dubai, Downtown Boulevard, UAE 🇦🇪',
  'London, Soho District, UK 🇬🇧',
  'New York, Manhattan, USA 🇺🇸',
  'Tokyo, Shibuya Crossing, Japan 🇯🇵',
  'Berlin, Tech Quarter, Germany 🇩🇪',
];

const SUGGESTED_HASHTAGS = [
  '#vikisocial',
  '#electricblue',
  '#cyanvibes',
  '#creator',
  '#photography',
  '#reels',
  '#android',
  '#cybercity',
];

const QUICK_EMOJIS = ['⚡', '💎', '🔥', '📸', '🌊', '🚀', '☕', '🙌', '💯', '✨', '🌍', '🇮🇳'];

const PRESET_PHOTOS = [
  { name: 'Neon Arcade', url: cyberpunkImg, label: 'Cyberpunk' },
  { name: 'Portrait', url: portraitImg, label: 'Creator' },
  { name: 'Alpine View', url: mountainImg, label: 'Nature' },
  { name: 'Workspace', url: workspaceImg, label: 'Design' },
  { name: 'Coffee Hour', url: coffeeImg, label: 'Lifestyle' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  onClose,
  onPostCreated,
  isDark,
  defaultMode = 'post',
}) => {
  const [mode, setMode] = useState<'post' | 'story' | 'reel'>(defaultMode);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [activeFilter, setActiveFilter] = useState('normal');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'portrait' | 'landscape'>('square');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationList, setShowLocationList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'compose'>('select');

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    setMediaType(isVideo ? 'video' : 'image');
    if (isVideo && mode === 'post') {
      setMode('reel');
    }
    setUploadProgress(`Loading ${isVideo ? 'video' : 'photo'} from gallery...`);

    try {
      const mediaId = `media_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.]/g, '')}`;
      const url = await mediaStorage.saveMedia(mediaId, file);
      setMediaUrl(url);
      setStep('compose');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
          setStep('compose');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadProgress(null);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable', err);
      setIsCameraActive(false);
      cameraInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 720;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setMediaUrl(dataUrl);
      setMediaType('image');
      setStep('compose');
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video');
      setMediaType(isVideo ? 'video' : 'image');
      if (isVideo) setMode('reel');
      try {
        const mediaId = `media_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.]/g, '')}`;
        const url = await mediaStorage.saveMedia(mediaId, file);
        setMediaUrl(url);
        setStep('compose');
      } catch {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target?.result) {
            setMediaUrl(evt.target.result as string);
            setStep('compose');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setCaption((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleInsertHashtag = (tag: string) => {
    if (!caption.includes(tag)) {
      setCaption((prev) => (prev ? `${prev} ${tag}` : tag));
    }
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) return;

    setIsSubmitting(true);
    setTimeout(() => {
      if (mode === 'reel') {
        db.createReel({
          userId: currentUser.id,
          videoUrl: mediaUrl,
          caption: caption.trim() || '⚡ Created on VIKI SOCIAL #reels',
          audioTrack: 'Original Audio - VIKI Beats 🎶',
        });
      } else if (mode === 'story') {
        db.createStory({
          userId: currentUser.id,
          mediaUrl,
          mediaType,
          caption: caption.trim(),
          filter: activeFilter,
        });
      } else {
        db.createPost({
          userId: currentUser.id,
          mediaUrl,
          mediaType,
          caption: caption.trim(),
          filter: activeFilter,
          location: location.trim(),
        });
      }
      setIsSubmitting(false);
      onPostCreated();
      onClose();
    }, 400);
  };

  const getFilterStyle = (filterId: string) => {
    const f = FILTERS.find((x) => x.id === filterId);
    return f ? f.css : 'none';
  };

  const getAspectRatioClass = () => {
    if (mode === 'reel') return 'aspect-[9/16] max-h-96 mx-auto';
    switch (aspectRatio) {
      case 'portrait':
        return 'aspect-[4/5]';
      case 'landscape':
        return 'aspect-[16/9]';
      case 'square':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div
        className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border transition-colors ${
          isDark ? 'bg-[#08080C] border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-zinc-800 bg-zinc-950/80' : 'border-zinc-100 bg-zinc-50'
          }`}
        >
          <div className="flex items-center gap-2">
            {step === 'compose' && (
              <button
                type="button"
                onClick={() => setStep('select')}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                title="Change Media"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="font-black text-sm bg-gradient-to-r from-[#0066FF] to-[#00F0FF] bg-clip-text text-transparent uppercase tracking-wider">
              {mode === 'reel' ? 'Create Reel' : mode === 'story' ? 'Create Story' : 'New Post'}
            </span>
          </div>

          {/* Mode Switcher: Post, Story, Reel */}
          <div className="flex items-center gap-1 p-0.5 bg-zinc-950 border border-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('post')}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                mode === 'post'
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Post
            </button>
            <button
              type="button"
              onClick={() => setMode('story')}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                mode === 'story'
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Story
            </button>
            <button
              type="button"
              onClick={() => setMode('reel')}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                mode === 'reel'
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Reel
            </button>
          </div>

          {/* Share/Publish Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !mediaUrl}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
              isSubmitting || !mediaUrl
                ? 'opacity-40 text-zinc-500 bg-zinc-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black hover:opacity-95 shadow-md shadow-cyan-500/20 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <span>Publish</span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* STEP 1: PHOTO/VIDEO SELECTION */}
          {step === 'select' && (
            <div className="space-y-4">
              <div
                className={`relative rounded-3xl border-2 border-dashed p-6 text-center flex flex-col items-center justify-center gap-4 transition-all ${
                  isDark
                    ? 'border-cyan-500/30 bg-[#0066FF]/5 hover:border-cyan-400/60'
                    : 'border-blue-300 bg-blue-50/50 hover:border-blue-400'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-[#00F0FF] p-[2px] shadow-lg shadow-[#0066FF]/30 flex items-center justify-center">
                  <div className="w-full h-full bg-[#08080C] rounded-[14px] flex items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-base text-white">
                    Select Media from Phone Gallery
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Choose photos or vertical videos to share on VIKI SOCIAL worldwide.
                  </p>
                </div>

                {/* Gallery & Camera Input */}
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/25 hover:opacity-95 active:scale-95 transition-all"
                  >
                    <ImagePlus className="w-4 h-4" />
                    <span>Choose from Gallery</span>
                  </button>

                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full py-3 px-4 rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Open Camera</span>
                  </button>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>JPG, PNG, WEBP, and MP4 videos supported</span>
                </div>
              </div>

              {/* Sample Photos for Testing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Or Pick a High-Resolution Sample</span>
                  </label>
                  <span className="text-[11px] text-zinc-500">Tap to load</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {PRESET_PHOTOS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setMediaUrl(preset.url);
                        setMediaType('image');
                        setStep('compose');
                      }}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 hover:border-cyan-400 transition-all hover:scale-105 active:scale-95"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                        <span className="text-[9px] font-bold text-white leading-tight truncate">
                          {preset.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Camera View */}
              {isCameraActive && (
                <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-black border border-zinc-800 flex flex-col items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black font-extrabold text-xs shadow-lg flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-4 py-2.5 rounded-full bg-zinc-800 text-zinc-300 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: COMPOSE SCREEN */}
          {step === 'compose' && mediaUrl && (
            <div className="space-y-4">
              <div
                className={`relative w-full ${getAspectRatioClass()} rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center transition-all`}
              >
                {mediaType === 'video' ? (
                  <video
                    src={mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ filter: getFilterStyle(activeFilter) }}
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Upload preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    style={{ filter: getFilterStyle(activeFilter) }}
                  />
                )}

                {/* Overlaid Action Controls */}
                {mode !== 'reel' && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/10 z-20">
                    <button
                      type="button"
                      onClick={() => {
                        if (aspectRatio === 'square') setAspectRatio('portrait');
                        else if (aspectRatio === 'portrait') setAspectRatio('landscape');
                        else setAspectRatio('square');
                      }}
                      className="text-white hover:text-cyan-300 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Crop className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="capitalize">{aspectRatio}</span>
                    </button>
                  </div>
                )}

                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/10 z-20">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-2.5 py-1 text-white hover:text-cyan-300 text-[11px] font-medium flex items-center gap-1 bg-white/10 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Change</span>
                  </button>
                </div>
              </div>

              {/* Filters Carousel */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Filter:</span>
                  </span>
                  <span className="text-xs text-cyan-400 font-bold">
                    {FILTERS.find((f) => f.id === activeFilter)?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFilter(f.id)}
                      className={`flex flex-col items-center gap-1 shrink-0 p-1 rounded-xl transition-all ${
                        activeFilter === f.id
                          ? 'bg-cyan-500/20 ring-2 ring-cyan-400 scale-105'
                          : 'hover:bg-zinc-800/40 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black border border-white/10">
                        <img
                          src={mediaUrl}
                          alt={f.name}
                          className="w-full h-full object-cover"
                          style={{ filter: f.css }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-300 font-medium">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption Input Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Smile className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Write Caption</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">{caption.length}/2,200</span>
                </div>

                <textarea
                  ref={textareaRef}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption, add #hashtags or tag friends..."
                  rows={3}
                  maxLength={2200}
                  className="w-full p-3 rounded-2xl text-xs bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none resize-none"
                />

                {/* Quick Emoji Bar */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleInsertEmoji(emoji)}
                      className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs hover:scale-110 active:scale-95 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Suggested Hashtags */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  {SUGGESTED_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInsertHashtag(tag)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-cyan-400 hover:border-cyan-400/50 whitespace-nowrap"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Tagging */}
              {mode === 'post' && (
                <div className="relative">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onFocus={() => setShowLocationList(true)}
                      placeholder="Add location (e.g. Mumbai, India or Dubai, UAE)..."
                      className="w-full text-xs bg-transparent text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  {showLocationList && (
                    <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl z-20 max-h-40 overflow-y-auto no-scrollbar">
                      {PRESET_LOCATIONS.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setLocation(loc);
                            setShowLocationList(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
