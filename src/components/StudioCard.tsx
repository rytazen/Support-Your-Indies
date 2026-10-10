import React from 'react';
import { 
  Building2, 
  MapPin, 
  Cpu, 
  ExternalLink, 
  Briefcase, 
  Gamepad2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Studio, JobOpening } from '../types';

interface StudioCardProps {
  studio: Studio;
  openings: JobOpening[];
  onViewStudioJobs: (studioName: string) => void;
}

export const StudioCard: React.FC<StudioCardProps> = ({
  studio,
  openings,
  onViewStudioJobs,
}) => {
  const getHiringBadge = () => {
    switch (studio.hiringStatus) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Hiring ({openings.length})
          </span>
        );
      case 'Internship Only':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Internships ({openings.length})
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            No Active Roles
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            Hiring Closed
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-violet-500/40 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between">
      <div>
        {/* Header: Studio Type & Size & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 border border-violet-800/40 text-[11px] font-bold uppercase tracking-wider">
              {studio.type}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[11px] font-mono">
              Team: {studio.size}
            </span>
          </div>
          {getHiringBadge()}
        </div>

        {/* Studio Name & Location */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-violet-400" />
            {studio.name}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{studio.workArrangement}: {studio.location}</span>
          </p>
        </div>

        {/* Engine and Description */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono flex items-center gap-1">
            <Cpu className="w-3 h-3 text-violet-400" />
            {studio.primaryEngine}
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {studio.description}
        </p>

        {/* Notable Games */}
        {studio.notableGames && studio.notableGames.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
              Notable Games / Titles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {studio.notableGames.map((game, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-300 text-[11px] flex items-center gap-1"
                >
                  <Gamepad2 className="w-3 h-3 text-slate-500" />
                  {game}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Openings count & Action buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <a
          href={studio.careersUrl || studio.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Studio Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {openings.length > 0 ? (
          <button
            onClick={() => onViewStudioJobs(studio.name)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-all"
          >
            <span>View {openings.length} {openings.length === 1 ? 'Opening' : 'Openings'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <span className="text-xs text-slate-600">No active postings</span>
        )}
      </div>
    </div>
  );
};
