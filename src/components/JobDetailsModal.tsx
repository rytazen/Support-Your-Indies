import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Cpu, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Link2, 
  Gamepad2, 
  MessageSquare,
  HelpCircle,
  FolderGit2
} from 'lucide-react';
import { JobOpening, Studio } from '../types';

interface JobDetailsModalProps {
  job: JobOpening | null;
  studio?: Studio;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  studio,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(job.directApplyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-violet-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {job.discipline}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                {job.engine}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {job.hiringStatus}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {job.title}
            </h2>

            <div className="flex items-center gap-3 mt-1 text-sm text-slate-300">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-violet-400" />
                {job.studioName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                {job.workArrangement}: {job.location}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* DIRECT APPLICATION CALLOUT CARD */}
          <div className="bg-gradient-to-br from-violet-900/40 via-indigo-950/40 to-slate-900 border border-violet-500/30 rounded-2xl p-5 shadow-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Direct Studio Application Portal
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Apply Straight to {job.studioName}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  This position does not require a recruiter or middleman. Click below to submit your application directly on the studio's official portal.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                  title="Copy direct application URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <a
                  href={job.directApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 transition-all active:scale-95"
                >
                  <span>Open Application</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Proof Source & Community Consensus */}
            <div className="mt-4 pt-3 border-t border-violet-500/20 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Verification: <strong className="text-slate-200 capitalize">{job.verificationStatus.replace('_', ' ')}</strong> ({job.vouchCount} community vouches)
                </span>
              </div>

              {job.proofUrl && (
                <a
                  href={job.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-300 hover:text-violet-200 flex items-center gap-1 underline underline-offset-2"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  View Original Source / Announcement
                </a>
              )}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Compensation</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">
                {job.salaryRange || 'Disclosed in interview'}
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Studio Team Size</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">
                {job.studioSize} developers
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Studio Type</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">
                {job.studioType}
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Posted Date</span>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">
                {job.datePosted}
              </p>
            </div>
          </div>

          {/* Role Overview */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              Role Overview
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
                Candidate Profile & Qualifications
              </h4>
              <ul className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Perks & Studio Highlights */}
          {job.perks && job.perks.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
                Studio Perks & Culture
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About the Studio Section */}
          {studio && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-violet-400" />
                  About {studio.name}
                </span>
                {studio.website && (
                  <a
                    href={studio.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    <span>Studio Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {studio.description}
              </p>
              {studio.notableGames && studio.notableGames.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-medium">Notable Titles:</span>
                  {studio.notableGames.map((g, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[11px] border border-slate-800">
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Practical Application Tips for Indie Candidates */}
          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-800/30 text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-violet-300 flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4" />
              Indie Application Pro-Tip:
            </span>
            <p className="text-slate-400 leading-relaxed">
              Indie studio founders prefer a playable web build on itch.io or a short 60-second video reel over long generic resumes. Highlight your work in <strong>{job.engine}</strong> and keep your introduction message concise and game-dev focused.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 p-4 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => onToggleBookmark(job.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{isBookmarked ? '★ Saved to Bookmarks' : '☆ Bookmark for Later'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <a
              href={job.directApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30 transition-all active:scale-95"
            >
              <span>Apply on Studio Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
