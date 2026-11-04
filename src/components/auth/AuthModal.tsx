import React, { useState, useRef } from 'react';
import { User as UserIcon, Mail, Lock, Phone, ArrowRight, Check, Globe } from 'lucide-react';
import { User } from '../../types';
import { db, COUNTRIES } from '../../services/db';

interface AuthModalProps {
  onSuccess: (user: User) => void;
  isDark: boolean;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, isDark }) => {
  const [tab, setTab] = useState<'login' | 'otp' | 'signup'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // OTP Login state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // India default
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupCountry, setSignupCountry] = useState(COUNTRIES[0]);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [signupError, setSignupError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const demoUsers = db.getUsers().slice(0, 4);

  const handleCustomAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setAvatar(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your username, email, or phone.');
      return;
    }

    const res = db.login(loginIdentifier, loginPassword);
    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setLoginError(res.error || 'Failed to log in.');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (!phoneNumber.trim()) {
      setOtpError('Please enter a valid phone number.');
      return;
    }
    setOtpSent(true);
    setOtpCode('123456'); // Pre-fill default test OTP
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    const fullPhone = `${selectedCountry.dialCode}${phoneNumber.trim()}`;
    const res = db.loginWithPhoneOtp(fullPhone, otpCode.trim());
    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setOtpError(res.error || 'Invalid OTP code.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!username.trim() || !email.trim()) {
      setSignupError('Username and email are required.');
      return;
    }

    const res = db.signUp({
      username,
      fullName: fullName || username,
      email,
      password,
      country: signupCountry.name,
      countryCode: signupCountry.code,
      bio,
      avatar,
    });

    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setSignupError(res.error || 'Failed to create account.');
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    const user = db.setCurrentUser(userId);
    onSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 select-none">
      <div
        className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border transition-colors ${
          isDark
            ? 'bg-[#08080C] border-zinc-800 text-zinc-100'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Brand Banner: Electric Blue & Cyan */}
        <div className="p-5 text-center bg-gradient-to-b from-[#0066FF]/20 via-transparent to-transparent">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0066FF] via-[#0A84FF] to-[#00F0FF] p-[2px] items-center justify-center shadow-lg shadow-[#0066FF]/30 mb-2">
            <div className="w-full h-full bg-[#08080C] rounded-[14px] flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#00F0FF] to-white font-black text-xl">
                V
              </span>
            </div>
          </div>
          <h2 className="text-xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#0066FF] via-[#0A84FF] to-[#00F0FF] bg-clip-text text-transparent">
              VIKI
            </span>{' '}
            SOCIAL
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Worldwide creator network ⚡ India • USA • UK • UAE
          </p>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 mt-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <button
              onClick={() => {
                setTab('login');
                setLoginError('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#0A84FF] text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => {
                setTab('otp');
                setOtpError('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                tab === 'otp'
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Phone OTP
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setSignupError('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-[#0066FF] to-[#0A84FF] text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-5 pb-5">
          {tab === 'login' && (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              {loginError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                  {loginError}
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Username, Email, or Phone
                </label>
                <div className="relative flex items-center">
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. aarav_sharma or elena_visuals"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-zinc-950 border border-zinc-800 focus:border-cyan-400 focus:outline-none text-white placeholder-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-zinc-950 border border-zinc-800 focus:border-cyan-400 focus:outline-none text-white placeholder-zinc-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#0A84FF] to-[#00F0FF] text-black font-extrabold text-xs shadow-lg shadow-[#0066FF]/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Quick Demo Login */}
              <div className="pt-3 border-t border-zinc-800">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block text-center mb-2">
                  ⚡ Quick Demo Accounts
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {demoUsers.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(u.id)}
                      className="p-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 flex items-center gap-2 text-left transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                        <img
                          src={u.avatar}
                          alt={u.username}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-zinc-300 truncate">
                        @{u.username}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {tab === 'otp' && (
            /* Phone OTP Login */
            <div className="space-y-3">
              {otpError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                  {otpError}
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Select Country
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const found = COUNTRIES.find(c => c.code === e.target.value);
                          if (found) setSelectedCountry(found);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-400 focus:outline-none"
                      >
                        {COUNTRIES.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} ({c.dialCode})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <span className="px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-cyan-400 font-bold text-xs flex items-center">
                        {selectedCountry.dialCode}
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="9876543210"
                        required
                        className="flex-1 px-3 py-2.5 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black font-extrabold text-xs shadow-lg shadow-[#0066FF]/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
                    Verification code sent to {selectedCountry.dialCode} {phoneNumber}. <br />
                    <span className="text-[10px] text-zinc-400">Use code: <strong className="text-white">123456</strong></span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full text-center tracking-widest text-lg font-black py-2 rounded-xl bg-zinc-950 border border-cyan-500/50 text-cyan-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00F0FF] text-black font-extrabold text-xs shadow-lg shadow-[#0066FF]/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Verify & Continue</span>
                    <Check className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-zinc-400 hover:text-white pt-1"
                  >
                    Change phone number
                  </button>
                </form>
              )}
            </div>
          )}

          {tab === 'signup' && (
            /* Sign Up Form */
            <form onSubmit={handleSignupSubmit} className="space-y-2.5 max-h-[65vh] overflow-y-auto no-scrollbar">
              {signupError && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                  {signupError}
                </div>
              )}

              {/* Avatar Presets */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1 text-center">
                  Choose Profile Picture
                </label>
                <div className="flex items-center justify-center gap-2 mb-1">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(p)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform ${
                        avatar === p
                          ? 'border-cyan-400 scale-110 shadow-md shadow-cyan-400/40'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={p}
                        alt="preset"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-cyan-400"
                    title="Upload custom photo"
                  >
                    +
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCustomAvatar}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-0.5">
                  Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-zinc-500">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="creative_handle"
                    required
                    className="w-full pl-7 pr-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 focus:border-cyan-400 focus:outline-none text-white placeholder-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-0.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 focus:border-cyan-400 focus:outline-none text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-0.5">
                  Country
                </label>
                <select
                  value={signupCountry.code}
                  onChange={(e) => {
                    const c = COUNTRIES.find(x => x.code === e.target.value);
                    if (c) setSignupCountry(c);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-400 focus:outline-none"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-0.5">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 focus:border-cyan-400 focus:outline-none text-white placeholder-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-0.5">
                  Bio (Optional)
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Creator, photographer, developer..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 border border-zinc-800 focus:border-cyan-400 focus:outline-none text-white placeholder-zinc-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#0A84FF] to-[#00F0FF] text-black font-extrabold text-xs shadow-lg shadow-[#0066FF]/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Create VIKI Account</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
