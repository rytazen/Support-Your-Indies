import React from 'react';
import { 
  Gamepad2, 
  PlusCircle, 
  ShieldCheck, 
  Bookmark, 
  Building2, 
  Briefcase, 
  DownloadCloud, 
  Flame,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { JobOpening, Studio } from '../types';

interface HeaderProps {
  activeTab: 'jobs' | 'studios' | 'careermap' | 'verify' | 'bookmarks';
  setActiveTab: (tab: 'jobs' | 'studios' | 'careermap' | 'verify' | 'bookmarks') => void;
  jobs: JobOpening[];
  studios: Studio[];
  bookmarkedIds: string[];
  onOpenSubmitModal: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  jobs,
  studios,
  bookmarkedIds,
  onOpenSubmitModal,
  onOpenExportModal,
}) => {
  const activeJobsCount = jobs.filter(j => j.hiringStatus === 'Active' || j.hiringStatus === 'Internship Only').length;
  const verifiedCount = jobs.filter(j => j.verificationStatus === 'verified' || j.verificationStatus === 'community_verified').length;
  const pendingVerificationCount = jobs.filter(j => j.verificationStatus === 'pending' || j.verificationStatus === 'flagged').length;
  const activeStudiosCount = studios.filter(s => s.hiringStatus === 'Active' || s.hiringStatus === 'Internship Only').length;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border-b border-violet-900/40 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-400">Open Indie Games Database</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Direct applications straight to studios — no middlemen</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 shrink-0 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <strong className="text-slate-200">{activeJobsCount}</strong> active positions
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <strong className="text-slate-200">{activeStudiosCount}</strong> hiring studios
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <strong className="text-slate-200">{verifiedCount}</strong> verified
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('jobs')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-lg shadow-violet-600/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  Support Your Indies
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Jobs Hub
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Open Directory of Indie Game Studios & Live Openings
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Openings ({jobs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('studios')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'studios'
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Studios ({studios.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('careermap')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'careermap'
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Career Map</span>
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'verify'
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verification</span>
              {pendingVerificationCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingVerificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bookmarks'
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved</span>
              {bookmarkedIds.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExportModal}
              title="Export Database (CSV / JSON)"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
            >
              <DownloadCloud className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Opening</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
