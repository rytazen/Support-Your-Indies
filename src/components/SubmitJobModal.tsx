import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Link2, 
  Building2, 
  MapPin, 
  Cpu, 
  DollarSign, 
  HelpCircle, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { 
  Discipline, 
  GameEngine, 
  StudioSize, 
  StudioType, 
  WorkArrangement, 
  HiringStatus,
  JobOpening 
} from '../types';

interface SubmitJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: Omit<JobOpening, 'id' | 'vouchCount' | 'flagCount' | 'datePosted'>) => void;
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

const STUDIO_SIZES: StudioSize[] = ['0-1', '2-10', '11-50', '51-200', '201-500', '501-1000'];
const STUDIO_TYPES: StudioType[] = ['Developer', 'Publisher', 'Both'];
const WORK_ARRANGEMENTS: WorkArrangement[] = ['Remote', 'Hybrid', 'Onsite', 'Flexible', 'Unknown'];

export const SubmitJobModal: React.FC<SubmitJobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [studioName, setStudioName] = useState('');
  const [discipline, setDiscipline] = useState<Discipline>('Gameplay Programming');
  const [engine, setEngine] = useState<GameEngine>('Godot');
  const [studioSize, setStudioSize] = useState<StudioSize>('2-10');
  const [studioType, setStudioType] = useState<StudioType>('Developer');
  const [workArrangement, setWorkArrangement] = useState<WorkArrangement>('Remote');
  const [location, setLocation] = useState('Worldwide Remote');
  const [hiringStatus, setHiringStatus] = useState<HiringStatus>('Active');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Contract' | 'Part-time' | 'Internship'>('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [directApplyUrl, setDirectApplyUrl] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [description, setDescription] = useState('');
  const [requirementsRaw, setRequirementsRaw] = useState('');
  const [submittedBy, setSubmittedBy] = useState<'Studio Direct' | 'Community Scout' | 'Core Curator'>('Community Scout');
  const [submitterNotes, setSubmitterNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !studioName.trim() || !directApplyUrl.trim()) {
      setError('Please fill in the Job Title, Studio Name, and Direct Application Link.');
      return;
    }

    if (!proofUrl.trim()) {
      setError('Please provide a Proof / Source URL (e.g. tweet, studio careers page, discord post) so our community can verify it.');
      return;
    }

    const requirements = requirementsRaw
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const isStudioDirect = submittedBy === 'Studio Direct';

    onSubmit({
      studioId: `studio-${studioName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      studioName: studioName.trim(),
      title: title.trim(),
      discipline,
      engine,
      location: location.trim() || 'Worldwide Remote',
      workArrangement,
      hiringStatus,
      studioType,
      studioSize,
      salaryRange: salaryRange.trim() || undefined,
      employmentType,
      directApplyUrl: directApplyUrl.trim(),
      proofUrl: proofUrl.trim(),
      verificationStatus: isStudioDirect ? 'verified' : 'pending',
      submittedBy,
      submitterNotes: submitterNotes.trim() || undefined,
      description: description.trim() || `Exciting indie game development opportunity at ${studioName}.`,
      requirements: requirements.length > 0 ? requirements : ['Experience in game development and passion for indie games.']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Submit an Indie Opening
              </h2>
              <p className="text-xs text-slate-400">
                Help aspiring developers find verified indie positions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Info Banner */}
        <div className="bg-violet-950/30 border-b border-violet-900/30 px-5 py-2.5 text-xs text-violet-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
          <span>
            Crowdsourced submissions enter our <strong>Verification Queue</strong> where peers review proof links to keep the platform accurate.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submitter Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Who is submitting this opening?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Community Scout', 'Studio Direct', 'Core Curator'] as const).map(role => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setSubmittedBy(role)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    submittedBy === role
                      ? 'bg-violet-600 border-violet-500 text-white shadow-sm shadow-violet-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Details: Title & Studio Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Position Title <span className="text-violet-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Combat Designer, 3D Character Artist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Studio Name <span className="text-violet-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Polytron, Team Cherry, Ghost Town"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Skill Discipline & Game Engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Discipline <span className="text-violet-400">*</span>
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as Discipline)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {DISCIPLINES.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Game Engine / Tech Stack <span className="text-violet-400">*</span>
              </label>
              <select
                value={engine}
                onChange={(e) => setEngine(e.target.value as GameEngine)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {ENGINES.map(eng => (
                  <option key={eng} value={eng}>{eng}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Studio Dimensions (from user's spreadsheet: Size, Type, Location, Status) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Studio Size
              </label>
              <select
                value={studioSize}
                onChange={(e) => setStudioSize(e.target.value as StudioSize)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {STUDIO_SIZES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Studio Type
              </label>
              <select
                value={studioType}
                onChange={(e) => setStudioType(e.target.value as StudioType)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {STUDIO_TYPES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Work Arrangement
              </label>
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value as WorkArrangement)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {WORK_ARRANGEMENTS.map(wa => (
                  <option key={wa} value={wa}>{wa}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Hiring Status
              </label>
              <select
                value={hiringStatus}
                onChange={(e) => setHiringStatus(e.target.value as HiringStatus)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Active">Active</option>
                <option value="Internship Only">Internship Only</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Location & Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location Details
              </label>
              <input
                type="text"
                placeholder="e.g. Worldwide Remote, or Tokyo, Japan"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Commitment
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract / Project</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Compensation / Range
              </label>
              <input
                type="text"
                placeholder="e.g. $60,000 - $80,000 / yr"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* CRITICAL LINKS: Direct Application URL & Proof Source URL */}
          <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-white mb-1 flex items-center justify-between">
                <span>Direct Studio Application Link <span className="text-violet-400">*</span></span>
                <span className="text-[10px] text-slate-400 font-normal">Where candidates go to apply</span>
              </label>
              <input
                type="url"
                placeholder="https://studio.com/jobs/apply or mailto:jobs@studio.com"
                value={directApplyUrl}
                onChange={(e) => setDirectApplyUrl(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1 flex items-center justify-between">
                <span>Proof / Source URL <span className="text-amber-400">*</span></span>
                <span className="text-[10px] text-amber-300/80 font-normal">Required for community verification</span>
              </label>
              <input
                type="url"
                placeholder="https://x.com/studio/status/... or career page link"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Submitter Notes / Proof Context (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Posted by Game Director on Bluesky, confirmed active demo on Steam"
                value={submitterNotes}
                onChange={(e) => setSubmitterNotes(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Description & Requirements */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Role Summary
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of the game and responsibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Key Requirements (One per line)
            </label>
            <textarea
              rows={2}
              placeholder="Experience with Godot / C#&#10;Portfolio of published itch.io games"
              value={requirementsRaw}
              onChange={(e) => setRequirementsRaw(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          {/* Modal Submit Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 transition-all active:scale-95"
            >
              Submit to Platform
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
