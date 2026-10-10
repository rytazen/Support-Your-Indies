import React from 'react';
import { 
  Building2, 
  MapPin, 
  Cpu, 
  ExternalLink, 
  Bookmark, 
  ShieldCheck, 
  ShieldAlert, 
  ThumbsUp, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Calendar, 
  CheckCircle2,
  Sparkles,
  Link2
} from 'lucide-react';
import { JobOpening } from '../types';

interface JobCardProps {
  job: JobOpening;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onVouch: (id: string) => void;
  onFlag: (id: string) => void;
  onSelectJob: (job: JobOpening) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isBookmarked,
  onToggleBookmark,
  onVouch,
  onFlag,
  onSelectJob,
}) => {
  const getEngineColor = (engine: string) => {
    switch (engine) {
      case 'Godot':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Unreal Engine 5':
        return 'bg-zinc-800 text-zinc-200 border-zinc-700';
      case 'Unity':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'GameMaker':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Custom C++ / Rust':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Bevy':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = () => {
    switch (job.hiringStatus) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Hiring Now
          </span>
        );
      case 'Internship Only':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Internship
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            Inactive
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            Filled / Closed
          </span>
        );
    }
  };

  const getVerificationBadge = () => {
    switch (job.verificationStatus) {
      case 'verified':
        return (
          <span 
            title="Officially verified opening straight from studio"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
          >
            <CheckCircle2 className="w-3 h-3" />
            Studio Verified
          </span>
        );
      case 'community_verified':
        return (
          <span 
            title={`Verified by game dev community consensus (${job.vouchCount} vouches)`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/40"
          >
            <ShieldCheck className="w-3 h-3" />
            Community Verified ({job.vouchCount})
          </span>
        );
      case 'pending':
        return (
          <span 
            title="Crowdsourced submission awaiting peer verification"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40"
          >
            <Clock className="w-3 h-3" />
            Pending Verification
          </span>
        );
      case 'flagged':
        return (
          <span 
            title="Flagged by community as potentially closed or stale"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-500/40"
          >
            <ShieldAlert className="w-3 h-3" />
            Needs Review
          </span>
        );
    }
  };

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/40 rounded-2xl p-5 transition-all duration-200 shadow-lg hover:shadow-violet-950/20 flex flex-col justify-between">
      {/* Top Meta Line: Status, Studio Type, Verification */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center flex-wrap gap-2">
            {getStatusBadge()}
            {getVerificationBadge()}
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Team: {job.studioSize}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(job.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-violet-600/20 border-violet-500 text-violet-400'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this position'}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title & Studio Header */}
        <div className="mb-3">
          <h3 
            onClick={() => onSelectJob(job)}
            className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors cursor-pointer flex items-baseline gap-2 line-clamp-1"
          >
            {job.title}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-sm text-slate-300">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-violet-400" />
              {job.studioName}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">{job.studioType}</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">{job.employmentType}</span>
          </div>
        </div>

        {/* Chips / Pills: Discipline, Engine, Location, Salary */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {/* Discipline Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-950/60 text-violet-300 border border-violet-800/40">
            {job.discipline}
          </span>

          {/* Engine Badge */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getEngineColor(job.engine)}`}>
            <Cpu className="w-3 h-3" />
            {job.engine}
          </span>

          {/* Location & Work Arrangement */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 text-slate-300 border border-slate-800">
            <MapPin className="w-3 h-3 text-slate-400" />
            {job.workArrangement}: {job.location}
          </span>

          {/* Salary / Comp */}
          {job.salaryRange && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/30">
              <DollarSign className="w-3 h-3" />
              {job.salaryRange}
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Footer Actions: Direct Apply Button & Community Vouch Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Community Verification & Proof Link */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onVouch(job.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              job.userVoted === 'vouched'
                ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Confirm this position is still active and valid"
          >
            <ThumbsUp className="w-3 h-3 text-emerald-400" />
            <span>Vouch ({job.vouchCount})</span>
          </button>

          <button
            onClick={() => onFlag(job.id)}
            className={`p-1 rounded-lg border text-xs transition-all ${
              job.userVoted === 'flagged'
                ? 'bg-rose-950 border-rose-500/50 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-rose-400 hover:border-slate-700'
            }`}
            title="Flag as expired or misleading"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </button>

          {job.proofUrl && (
            <a
              href={job.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1 text-[11px] underline underline-offset-2 ml-1"
              title="View original proof / source posting"
            >
              <Link2 className="w-3 h-3" />
              Source
            </a>
          )}
        </div>

        {/* Action Buttons: View Details & Direct Apply */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectJob(job)}
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Details
          </button>

          <a
            href={job.directApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-600/30 transition-all active:scale-95 group-hover:bg-violet-600"
          >
            <span>Apply Directly</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
