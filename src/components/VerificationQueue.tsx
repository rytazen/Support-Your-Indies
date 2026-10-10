import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  ExternalLink, 
  ThumbsUp, 
  AlertTriangle, 
  CheckCircle2, 
  Link2, 
  Building2, 
  Cpu, 
  MapPin, 
  Filter,
  Check,
  XCircle,
  HelpCircle,
  Rss
} from 'lucide-react';
import { JobOpening, VerificationStatus, HiringStatus } from '../types';

interface VerificationQueueProps {
  jobs: JobOpening[];
  onVouch: (id: string) => void;
  onFlag: (id: string) => void;
  onUpdateStatus: (id: string, verificationStatus: VerificationStatus, hiringStatus?: HiringStatus) => void;
  onSelectJob: (job: JobOpening) => void;
  onOpenFeedIngestion: () => void;
}

export const VerificationQueue: React.FC<VerificationQueueProps> = ({
  jobs,
  onVouch,
  onFlag,
  onUpdateStatus,
  onSelectJob,
  onOpenFeedIngestion,
}) => {
  const [filterMode, setFilterMode] = useState<'pending' | 'flagged' | 'all'>('pending');

  const pendingJobs = jobs.filter(j => j.verificationStatus === 'pending');
  const flaggedJobs = jobs.filter(j => j.verificationStatus === 'flagged');
  const communityVerifiedJobs = jobs.filter(j => j.verificationStatus === 'community_verified');

  const displayedJobs = filterMode === 'pending'
    ? pendingJobs
    : filterMode === 'flagged'
    ? flaggedJobs
    : jobs;

  return (
    <div className="space-y-6">
      {/* Top Banner & Explanation */}
      <div className="bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 border border-violet-800/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-black text-white tracking-tight">
                Community Verification & Quality Assurance Hub
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To keep Support Your Indies free of ghost-jobs, expired listings, and scams, the community reviews proof links for crowdsourced roles. Submissions with <strong>2+ community vouches</strong> are promoted to <span className="text-cyan-300 font-semibold">Community Verified</span>.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <span className="text-lg font-bold text-amber-400 block">{pendingJobs.length}</span>
              <span className="text-[11px] text-slate-400 font-medium">Pending Review</span>
            </div>
            <div className="px-4 py-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <span className="text-lg font-bold text-rose-400 block">{flaggedJobs.length}</span>
              <span className="text-[11px] text-slate-400 font-medium">Flagged</span>
            </div>
            <div className="px-4 py-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <span className="text-lg font-bold text-emerald-400 block">{communityVerifiedJobs.length}</span>
              <span className="text-[11px] text-slate-400 font-medium">Peer Verified</span>
            </div>
          </div>
        </div>

        {/* Tab Filter & Feed Scout Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterMode === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Needs Verification ({pendingJobs.length})</span>
            </button>

            <button
              onClick={() => setFilterMode('flagged')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterMode === 'flagged'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Reported / Flagged ({flaggedJobs.length})</span>
            </button>

            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterMode === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              <span>All Listings ({jobs.length})</span>
            </button>
          </div>

          <button
            onClick={onOpenFeedIngestion}
            className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs shadow-md shadow-orange-600/25 transition-all active:scale-95"
          >
            <Rss className="w-3.5 h-3.5" />
            <span>Public Feed & Reddit Ingestion Scout</span>
          </button>
        </div>
      </div>

      {/* Listings in Queue */}
      {displayedJobs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
          <h3 className="text-base font-bold text-white mb-1">Queue is Clear!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All positions in this view are up to date and verified. When someone submits a new indie role, it will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedJobs.map(job => (
            <div
              key={job.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              {/* Job Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    job.verificationStatus === 'verified'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : job.verificationStatus === 'community_verified'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                      : job.verificationStatus === 'flagged'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}>
                    {job.verificationStatus.replace('_', ' ')}
                  </span>

                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Engine: {job.engine}
                  </span>

                  <span className="text-xs text-slate-400">
                    Discipline: <strong className="text-slate-200">{job.discipline}</strong>
                  </span>
                </div>

                <div className="cursor-pointer" onClick={() => onSelectJob(job)}>
                  <h3 className="text-base font-bold text-white hover:text-violet-300 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-violet-400" />
                      {job.studioName}
                    </span>
                    <span>•</span>
                    <span>{job.workArrangement}: {job.location}</span>
                    <span>•</span>
                    <span>Posted {job.datePosted}</span>
                  </div>
                </div>

                {/* Submitter & Proof Meta */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-400">
                      Submitted by: <strong className="text-slate-200">{job.submittedBy}</strong>
                    </span>
                    {job.proofUrl && (
                      <a
                        href={job.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-2"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Inspect Original Proof URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {job.submitterNotes && (
                    <p className="text-slate-400 italic text-[11px]">
                      "{job.submitterNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Verification Actions Column */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2 shrink-0 lg:w-56 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-5">
                {/* Vouch Button */}
                <button
                  onClick={() => onVouch(job.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    job.userVoted === 'vouched'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{job.userVoted === 'vouched' ? 'You Vouched' : 'Vouch Valid'} ({job.vouchCount})</span>
                </button>

                {/* Curator Quick Approve */}
                <button
                  onClick={() => onUpdateStatus(job.id, 'community_verified', 'Active')}
                  className="w-full py-1.5 px-3 rounded-xl text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mark Verified</span>
                </button>

                {/* Flag / Close Action */}
                <button
                  onClick={() => onFlag(job.id)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                    job.userVoted === 'flagged'
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-950 hover:bg-rose-950/40 text-rose-400 border-slate-800 hover:border-rose-800'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report / Filled ({job.flagCount})</span>
                </button>

                {/* Test Direct Apply Link */}
                <a
                  href={job.directApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-950 border border-slate-800 text-center flex items-center justify-center gap-1"
                >
                  <span>Test Application Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
