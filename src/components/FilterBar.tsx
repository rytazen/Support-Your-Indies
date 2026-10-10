import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  MapPin, 
  Cpu, 
  Users2, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  Discipline, 
  GameEngine, 
  WorkArrangement, 
  StudioSize, 
  StudioType, 
  HiringStatus, 
  VerificationStatus,
  FilterState 
} from '../types';

interface FilterBarProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

const DISCIPLINES: Discipline[] = [
  'Gameplay Programming',
  'Engine & Graphics',
  'Technical Art & Shaders',
  '3D Art & Animation',
  '2D & Pixel Art',
  'Level & Systems Design',
  'Narrative & Writing',
  'Audio & Sound (FMOD/Wwise)',
  'UI/UX Design',
  'Producer & Production',
  'QA & Playtesting'
];

const ENGINES: GameEngine[] = [
  'Unreal Engine 5',
  'Unity',
  'Godot',
  'GameMaker',
  'Custom C++ / Rust',
  'Bevy',
  'Other'
];

const WORK_ARRANGEMENTS: WorkArrangement[] = ['Remote', 'Hybrid', 'Onsite', 'Flexible', 'Unknown'];
const STUDIO_SIZES: StudioSize[] = ['0-1', '2-10', '11-50', '51-200', '201-500', '501-1000'];
const STUDIO_TYPES: StudioType[] = ['Developer', 'Publisher', 'Both'];
const HIRING_STATUSES: HiringStatus[] = ['Active', 'Internship Only', 'Inactive', 'Closed'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.discipline !== 'All' ||
    filters.engine !== 'All' ||
    filters.workArrangement !== 'All' ||
    filters.studioSize !== 'All' ||
    filters.studioType !== 'All' ||
    filters.hiringStatus !== 'All' ||
    filters.verificationStatus !== 'All';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl mb-6">
      {/* Top Search & Primary Filter Row */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles, studios, tech stack, or games (e.g. Godot, Shader, Roguelite)..."
            value={filters.searchQuery}
            onChange={(e) => onChange(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Work Arrangement */}
          <div className="relative">
            <select
              value={filters.workArrangement}
              onChange={(e) => onChange(prev => ({ ...prev, workArrangement: e.target.value as any }))}
              className="appearance-none pl-8 pr-7 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-violet-500 hover:border-slate-600 transition-colors"
            >
              <option value="All">All Locations</option>
              {WORK_ARRANGEMENTS.map(wa => (
                <option key={wa} value={wa}>{wa}</option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Engine */}
          <div className="relative">
            <select
              value={filters.engine}
              onChange={(e) => onChange(prev => ({ ...prev, engine: e.target.value as any }))}
              className="appearance-none pl-8 pr-7 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-violet-500 hover:border-slate-600 transition-colors"
            >
              <option value="All">All Engines</option>
              {ENGINES.map(eng => (
                <option key={eng} value={eng}>{eng}</option>
              ))}
            </select>
            <Cpu className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Verification Status */}
          <div className="relative">
            <select
              value={filters.verificationStatus}
              onChange={(e) => onChange(prev => ({ ...prev, verificationStatus: e.target.value as any }))}
              className="appearance-none pl-8 pr-7 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-violet-500 hover:border-slate-600 transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="verified">Verified Direct</option>
              <option value="community_verified">Community Verified</option>
              <option value="pending">Pending Review</option>
            </select>
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              showAdvanced || (hasActiveFilters && (filters.studioSize !== 'All' || filters.studioType !== 'All' || filters.hiringStatus !== 'All'))
                ? 'bg-violet-950/60 border-violet-500 text-violet-300'
                : 'bg-slate-950 border-slate-700/80 text-slate-300 hover:border-slate-600'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>More Filters</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Discipline Tag Carousel / Quick Filters */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Popular Disciplines & Skills:
          </span>
          <span className="text-[11px] text-slate-500">
            Showing <strong className="text-slate-200">{totalResults}</strong> matching results
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => onChange(prev => ({ ...prev, discipline: 'All' }))}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              filters.discipline === 'All'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            All Roles
          </button>
          {DISCIPLINES.map(disc => {
            const isSelected = filters.discipline === disc;
            return (
              <button
                key={disc}
                onClick={() => onChange(prev => ({ ...prev, discipline: isSelected ? 'All' : disc }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {disc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Advanced Filters Drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-xl">
          {/* Studio Size */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Studio Size (Team)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => onChange(prev => ({ ...prev, studioSize: 'All' }))}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                  filters.studioSize === 'All'
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Any
              </button>
              {STUDIO_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => onChange(prev => ({ ...prev, studioSize: filters.studioSize === size ? 'All' : size }))}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                    filters.studioSize === size
                      ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Studio Type */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Studio Type
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => onChange(prev => ({ ...prev, studioType: 'All' }))}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                  filters.studioType === 'All'
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Any
              </button>
              {STUDIO_TYPES.map(st => (
                <button
                  key={st}
                  onClick={() => onChange(prev => ({ ...prev, studioType: filters.studioType === st ? 'All' : st }))}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                    filters.studioType === st
                      ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Hiring Status */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Hiring Status
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onChange(prev => ({ ...prev, hiringStatus: 'All' }))}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                  filters.hiringStatus === 'All'
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                All Statuses
              </button>
              {HIRING_STATUSES.map(hs => (
                <button
                  key={hs}
                  onClick={() => onChange(prev => ({ ...prev, hiringStatus: filters.hiringStatus === hs ? 'All' : hs }))}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                    filters.hiringStatus === hs
                      ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {hs}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
