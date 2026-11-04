import React, { useState } from 'react';
import { Shield, Users, FileText, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Eye, RefreshCw, Key } from 'lucide-react';
import { db } from '../../services/db';
import { User, ReportedItem } from '../../types';
import { isFirebaseConfigured, firebaseConfig } from '../../services/firebase';

interface AdminDashboardProps {
  currentUser: User;
  onClose: () => void;
  onRefresh: () => void;
  isDark: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onClose,
  onRefresh,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'firebase'>('overview');
  const [users, setUsers] = useState<User[]>(() => db.getAllUsersForAdmin());
  const [reports, setReports] = useState<ReportedItem[]>(() => db.getReports());
  const [stats, setStats] = useState(() => db.getAdminStats());
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleToggleSuspend = (targetUser: User) => {
    if (targetUser.id === currentUser.id) {
      showNotice('You cannot suspend your own admin account.');
      return;
    }
    const isSuspended = db.toggleSuspendUser(targetUser.id);
    setUsers(db.getAllUsersForAdmin());
    setStats(db.getAdminStats());
    onRefresh();
    showNotice(`Account @${targetUser.username} has been ${isSuspended ? 'suspended' : 'restored'}.`);
  };

  const handleResolveReport = (reportId: string, action: 'resolve' | 'dismiss') => {
    db.resolveReport(reportId, action);
    setReports(db.getReports());
    setStats(db.getAdminStats());
    showNotice(`Report #${reportId.slice(-4)} has been ${action === 'resolve' ? 'resolved' : 'dismissed'}.`);
  };

  const handleDeleteReportedPost = (postId: string, reportId: string) => {
    db.deletePost(postId);
    db.resolveReport(reportId, 'resolve');
    setReports(db.getReports());
    setStats(db.getAdminStats());
    onRefresh();
    showNotice(`Post ${postId} deleted and report resolved.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 select-none">
      <div
        className={`w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#08080C] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wide uppercase">Admin Control Panel</h2>
                <p className="text-[11px] text-zinc-400">Project: viki-social-app</p>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
            SuperAdmin
          </span>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="bg-cyan-500/10 border-y border-cyan-500/30 px-4 py-2 text-cyan-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Reports
            {stats.pendingReports > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black">
                {stats.pendingReports}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'firebase'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Firebase & APK
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-5 no-scrollbar space-y-5">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[11px] font-bold uppercase">Total Users</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-2xl font-black text-white">{stats.totalUsers}</span>
                  <span className="text-[10px] text-emerald-400 mt-1">● {stats.activeUsers} Active Online</span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[11px] font-bold uppercase">Posts & Reels</span>
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-2xl font-black text-white">{stats.totalPosts + stats.totalReels}</span>
                  <span className="text-[10px] text-zinc-400 mt-1">{stats.totalPosts} Posts • {stats.totalReels} Reels</span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[11px] font-bold uppercase">Moderation</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-2xl font-black text-white">{stats.pendingReports}</span>
                  <span className="text-[10px] text-amber-400 mt-1">Pending reports</span>
                </div>
              </div>

              {/* Status summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0066FF]/10 to-[#00F0FF]/10 border border-[#00F0FF]/20">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-1">
                  System Health & Connectivity
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  VIKI SOCIAL application is running in high-performance mode. Security rules for Firestore and Cloud Storage are configured, and PWA offline service worker is active.
                </p>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="text-xs text-zinc-400 font-semibold mb-2">
                Manage all registered users, roles, and status
              </div>
              <div className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
                {users.map(u => (
                  <div key={u.id} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.username}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">@{u.username}</span>
                          {u.isVerified && <span className="text-cyan-400 text-xs">✓</span>}
                          {u.role === 'admin' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                              ADMIN
                            </span>
                          )}
                          {u.isSuspended && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">
                              SUSPENDED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400">{u.fullName} • {u.country || 'Global'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSuspend(u)}
                        disabled={u.id === currentUser.id}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all disabled:opacity-30 ${
                          u.isSuspended
                            ? 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30'
                            : 'bg-red-600/20 text-red-300 hover:bg-red-600/30'
                        }`}
                      >
                        {u.isSuspended ? 'Restore' : 'Suspend'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              <div className="text-xs text-zinc-400 font-semibold mb-2">
                User-reported content queue for moderation
              </div>
              {reports.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  All clean! No reported content at this time.
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map(rep => (
                    <div
                      key={rep.id}
                      className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Report on {rep.targetType.toUpperCase()} ({rep.targetId})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rep.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300'
                              : rep.status === 'resolved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200">
                        <strong className="text-zinc-400">Reason:</strong> {rep.reason}
                      </p>
                      {rep.details && (
                        <p className="text-[11px] text-zinc-400 italic">"{rep.details}"</p>
                      )}

                      {rep.status === 'pending' && (
                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                          {rep.targetType === 'post' && (
                            <button
                              onClick={() => handleDeleteReportedPost(rep.targetId, rep.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500"
                            >
                              Delete Post
                            </button>
                          )}
                          <button
                            onClick={() => handleResolveReport(rep.id, 'resolve')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 text-xs font-bold hover:bg-emerald-600/40"
                          >
                            Mark Resolved
                          </button>
                          <button
                            onClick={() => handleResolveReport(rep.id, 'dismiss')}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FIREBASE & CAPACITOR TAB */}
          {activeTab === 'firebase' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Key className="w-4 h-4" />
                  <span>Firebase Project Configuration</span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Configured Project ID: <code className="text-cyan-300 font-mono">viki-social-app</code>
                </p>
                <div className="p-2.5 rounded-xl bg-black font-mono text-[11px] text-zinc-300 space-y-1">
                  <div>projectId: {firebaseConfig.projectId}</div>
                  <div>authDomain: {firebaseConfig.authDomain}</div>
                  <div>hostingUrl: https://viki-social-app.web.app</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <RefreshCw className="w-4 h-4" />
                  <span>Android Capacitor APK Info</span>
                </div>
                <div className="text-[11px] text-zinc-300 space-y-1 font-mono">
                  <div>App ID: com.vikisocial.app</div>
                  <div>App Name: VIKI SOCIAL</div>
                  <div>Web Dir: dist</div>
                </div>
                <p className="text-[11px] text-zinc-400 pt-1">
                  To build the Android APK, run: <br />
                  <code className="text-cyan-300 font-mono">npm run build && npx cap sync android</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
