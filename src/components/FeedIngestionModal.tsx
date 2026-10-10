import React, { useState } from 'react';
import { 
  X, 
  Rss, 
  CheckCircle2, 
  Filter, 
  ExternalLink, 
  AlertCircle, 
  DownloadCloud, 
  Play, 
  RefreshCw, 
  Sparkles,
  Link2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  feedIngestionService, 
  CURATED_REDDIT_FEED, 
  ParsedJobCandidate, 
  RawFeedPost 
} from '../services/feedIngestionService';
import { JobOpening } from '../types';

interface FeedIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingJobs: JobOpening[];
  onImportJobs: (newJobs: Omit<JobOpening, 'id' | 'vouchCount' | 'flagCount' | 'datePosted'>[]) => void;
}

export const FeedIngestionModal: React.FC<FeedIngestionModalProps> = ({
  isOpen,
  onClose,
  existingJobs,
  onImportJobs,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [activeFilterTab, setActiveFilterTab] = useState<'eligible' | 'filtered' | 'all'>('eligible');
  const [customSubreddit, setCustomSubreddit] = useState('r/gameDevClassifieds');

  if (!isOpen) return null;

  // Process feed items
  const processedFeed = CURATED_REDDIT_FEED.map(post => {
    const isAlreadyImported = existingJobs.some(
      j => j.proofUrl.toLowerCase() === post.url.toLowerCase()
    ) || importedIds.includes(post.id);

    const eligibility = feedIngestionService.evaluatePostEligibility(post.title, post.selftext || '');
    let candidate: ParsedJobCandidate | null = null;
    if (eligibility.isHiring) {
      candidate = feedIngestionService.parsePostToJobCandidate(post);
    }

    return {
      post,
      eligibility,
      candidate,
      isAlreadyImported
    };
  });

  const eligiblePosts = processedFeed.filter(p => p.eligibility.isHiring);
  const filteredOutPosts = processedFeed.filter(p => !p.eligibility.isHiring);

  const displayedPosts = activeFilterTab === 'eligible'
    ? eligiblePosts
    : activeFilterTab === 'filtered'
    ? filteredOutPosts
    : processedFeed;

  const handleToggleSelect = (postId: string) => {
    if (selectedIds.includes(postId)) {
      setSelectedIds(selectedIds.filter(id => id !== postId));
    } else {
      setSelectedIds([...selectedIds, postId]);
    }
  };

  const handleSelectAllEligible = () => {
    const unimportedEligible = eligiblePosts
      .filter(p => !p.isAlreadyImported)
      .map(p => p.post.id);
    setSelectedIds(unimportedEligible);
  };

  const handleExecuteImport = () => {
    const toImport = processedFeed
      .filter(p => selectedIds.includes(p.post.id) && p.candidate && !p.isAlreadyImported)
      .map(p => p.candidate!.parsedJob);

    if (toImport.length > 0) {
      onImportJobs(toImport);
      setImportedIds([...importedIds, ...selectedIds]);
      setSelectedIds([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 p-5 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Public Feed & Reddit Ingestion Scout
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Phase 1 Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically monitors <strong>r/gameDevClassifieds</strong> and <strong>itch.io/jobs</strong>, filters [Hiring] & [Paid] signals, and stages posts into the Verification Queue.
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

        {/* Pipeline Architecture Banner */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Scraped Sources:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-950/40 border border-orange-800/40 text-orange-300 font-mono text-[11px]">
              r/gameDevClassifieds (JSON)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/40 border border-rose-800/40 text-rose-300 font-mono text-[11px]">
              itch.io/jobs (RSS)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <strong>{eligiblePosts.length}</strong> Matched [Hiring]
            </span>
            <span className="text-rose-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <strong>{filteredOutPosts.length}</strong> Filtered Out [For Hire]
            </span>
          </div>
        </div>

        {/* Filter & Selection Sub-bar */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilterTab('eligible')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'eligible'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Eligible Openings ({eligiblePosts.length})</span>
            </button>

            <button
              onClick={() => setActiveFilterTab('filtered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeFilterTab === 'filtered'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtered Rejections ({filteredOutPosts.length})</span>
            </button>

            <button
              onClick={() => setActiveFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilterTab === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>All Scanned ({processedFeed.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAllEligible}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium"
            >
              Select All Unimported
            </button>
          </div>
        </div>

        {/* Scrollable Feed List */}
        <div className="p-6 space-y-3.5 overflow-y-auto flex-1">
          {displayedPosts.map(({ post, eligibility, candidate, isAlreadyImported }) => (
            <div
              key={post.id}
              className={`p-4 rounded-xl border transition-all ${
                isAlreadyImported
                  ? 'bg-slate-950/40 border-slate-800/50 opacity-75'
                  : eligibility.isHiring
                  ? 'bg-slate-950/90 border-slate-800 hover:border-violet-500/40'
                  : 'bg-slate-950/50 border-rose-950/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Select Checkbox (only if eligible and not already imported) */}
                  {eligibility.isHiring && !isAlreadyImported && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post.id)}
                      onChange={() => handleToggleSelect(post.id)}
                      className="mt-1 w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-slate-900 border-slate-700"
                    />
                  )}

                  <div>
                    {/* Source & Status Badges */}
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-orange-950/60 text-orange-400 border border-orange-800/40">
                        {post.source}
                      </span>

                      {eligibility.isHiring ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          [Hiring] Verified Signal
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-500/40 flex items-center gap-1">
                          <Filter className="w-3 h-3" />
                          Filtered Out
                        </span>
                      )}

                      {isAlreadyImported && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-950/80 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Already In Queue
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {post.title}
                    </h4>

                    {/* Extracted Normalization Preview (if candidate) */}
                    {candidate && (
                      <div className="mt-2.5 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Detected Discipline</span>
                          <span className="font-semibold text-violet-300">{candidate.parsedJob.discipline}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Detected Engine</span>
                          <span className="font-semibold text-cyan-300 flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            {candidate.parsedJob.engine}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Detected Comp</span>
                          <span className="font-semibold text-emerald-300">{candidate.parsedJob.salaryRange}</span>
                        </div>
                      </div>
                    )}

                    {/* Filter Reason if filtered */}
                    {!eligibility.isHiring && post.filterReason && (
                      <p className="mt-1.5 text-xs text-rose-400 italic">
                        {post.filterReason}
                      </p>
                    )}

                    {/* Short excerpt */}
                    {post.selftext && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {post.selftext}
                      </p>
                    )}
                  </div>
                </div>

                {/* Proof Link Action */}
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs flex items-center gap-1"
                  title="Open live source Reddit thread"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer with Ingestion Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-400">
            Selected: <strong className="text-white">{selectedIds.length}</strong> openings to stage
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleExecuteImport}
              disabled={selectedIds.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-orange-600/30 transition-all active:scale-95"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Push Selected to Verification Queue ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
