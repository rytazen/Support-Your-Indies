import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  PlusCircle, 
  Bookmark, 
  ArrowUpDown, 
  HelpCircle,
  ExternalLink,
  Flame,
  CheckCircle2,
  RefreshCw,
  Compass,
  Layers,
  Heart
} from 'lucide-react';
import { 
  JobOpening, 
  Studio, 
  FilterState, 
  Discipline, 
  GameEngine, 
  WorkArrangement, 
  StudioSize, 
  StudioType, 
  HiringStatus, 
  VerificationStatus 
} from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { JobCard } from './components/JobCard';
import { StudioCard } from './components/StudioCard';
import { JobDetailsModal } from './components/JobDetailsModal';
import { SubmitJobModal } from './components/SubmitJobModal';
import { VerificationQueue } from './components/VerificationQueue';
import { ExportModal } from './components/ExportModal';
import { CareerMap } from './components/CareerMap';
import { FeedIngestionModal } from './components/FeedIngestionModal';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  discipline: 'All',
  engine: 'All',
  workArrangement: 'All',
  studioSize: 'All',
  studioType: 'All',
  hiringStatus: 'All',
  verificationStatus: 'All',
  employmentType: 'All',
  sortBy: 'latest'
};

export default function App() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'studios' | 'careermap' | 'verify' | 'bookmarks'>('jobs');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  
  // Modals
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFeedIngestionModalOpen, setIsFeedIngestionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data from local storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedJobs = storageService.getJobs();
    const loadedStudios = storageService.getStudios();
    const loadedBookmarks = storageService.getBookmarks();
    setJobs(loadedJobs);
    setStudios(loadedStudios);
    setBookmarkedIds(loadedBookmarks);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Vouch handler
  const handleVouch = (id: string) => {
    const res = storageService.vouchJob(id);
    if (res.success) {
      loadData();
      showToast('Thank you for vouching! Community consensus updated.');
    }
  };

  // Flag handler
  const handleFlag = (id: string) => {
    const res = storageService.flagJob(id);
    if (res.success) {
      loadData();
      showToast('Position flagged for community review.');
    }
  };

  // Direct status update (curator action)
  const handleUpdateStatus = (id: string, verificationStatus: VerificationStatus, hiringStatus?: HiringStatus) => {
    storageService.updateJobStatus(id, verificationStatus, hiringStatus);
    loadData();
    showToast(`Status updated to ${verificationStatus.replace('_', ' ')}.`);
  };

  // Bookmark toggle
  const handleToggleBookmark = (id: string) => {
    const isNowBookmarked = storageService.toggleBookmark(id);
    setBookmarkedIds(storageService.getBookmarks());
    showToast(isNowBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks');
  };

  // Submit new job
  const handleSubmitJob = (jobData: Omit<JobOpening, 'id' | 'vouchCount' | 'flagCount' | 'datePosted'>) => {
    const created = storageService.addJob(jobData);
    loadData();
    showToast(`Successfully added "${created.title}" at ${created.studioName}!`);
  };

  // Batch import jobs from Public Feed & Reddit Ingestion
  const handleBatchImportJobs = (newJobs: Omit<JobOpening, 'id' | 'vouchCount' | 'flagCount' | 'datePosted'>[]) => {
    newJobs.forEach(job => {
      storageService.addJob(job);
    });
    loadData();
    setIsFeedIngestionModalOpen(false);
    showToast(`Staged ${newJobs.length} feed openings into the Verification Queue!`);
  };

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // If in bookmarks tab, restrict to bookmarked
      if (activeTab === 'bookmarks' && !bookmarkedIds.includes(job.id)) {
        return false;
      }

      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesStudio = job.studioName.toLowerCase().includes(q);
        const matchesEngine = job.engine.toLowerCase().includes(q);
        const matchesDiscipline = job.discipline.toLowerCase().includes(q);
        const matchesLocation = job.location.toLowerCase().includes(q);
        const matchesDesc = job.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesStudio && !matchesEngine && !matchesDiscipline && !matchesLocation && !matchesDesc) {
          return false;
        }
      }

      // Discipline
      if (filters.discipline !== 'All' && job.discipline !== filters.discipline) {
        return false;
      }

      // Engine
      if (filters.engine !== 'All' && job.engine !== filters.engine) {
        return false;
      }

      // Work Arrangement
      if (filters.workArrangement !== 'All' && job.workArrangement !== filters.workArrangement) {
        return false;
      }

      // Studio Size
      if (filters.studioSize !== 'All' && job.studioSize !== filters.studioSize) {
        return false;
      }

      // Studio Type
      if (filters.studioType !== 'All' && job.studioType !== filters.studioType) {
        return false;
      }

      // Hiring Status
      if (filters.hiringStatus !== 'All' && job.hiringStatus !== filters.hiringStatus) {
        return false;
      }

      // Verification Status
      if (filters.verificationStatus !== 'All') {
        if (job.verificationStatus !== filters.verificationStatus) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'vouches') {
        return b.vouchCount - a.vouchCount;
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (filters.sortBy === 'studio') {
        return a.studioName.localeCompare(b.studioName);
      }
      // default: latest
      return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
    });
  }, [jobs, filters, activeTab, bookmarkedIds]);

  // Filter Studios
  const filteredStudios = useMemo(() => {
    return studios.filter(studio => {
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = studio.name.toLowerCase().includes(q);
        const matchesDesc = studio.description.toLowerCase().includes(q);
        const matchesEngine = studio.primaryEngine.toLowerCase().includes(q);
        const matchesLocation = studio.location.toLowerCase().includes(q);
        const matchesGames = studio.notableGames?.some(g => g.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesEngine && !matchesLocation && !matchesGames) {
          return false;
        }
      }

      if (filters.studioSize !== 'All' && studio.size !== filters.studioSize) {
        return false;
      }

      if (filters.studioType !== 'All' && studio.type !== filters.studioType) {
        return false;
      }

      if (filters.workArrangement !== 'All' && studio.workArrangement !== filters.workArrangement) {
        return false;
      }

      if (filters.engine !== 'All' && studio.primaryEngine !== filters.engine) {
        return false;
      }

      if (filters.hiringStatus !== 'All' && studio.hiringStatus !== filters.hiringStatus) {
        return false;
      }

      return true;
    });
  }, [studios, filters]);

  // Handler to filter jobs to a specific studio
  const handleViewStudioJobs = (studioName: string) => {
    setActiveTab('jobs');
    setFilters(prev => ({
      ...prev,
      searchQuery: studioName
    }));
  };

  // Handler for Career Map clicks (explore specific engine or discipline)
  const handleExploreFilter = (type: 'discipline' | 'engine', value: string) => {
    setActiveTab('jobs');
    if (type === 'engine') {
      setFilters(prev => ({
        ...prev,
        engine: value as any,
        searchQuery: ''
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        discipline: value as any,
        searchQuery: ''
      }));
    }
    showToast(`Showing all openings for ${value}`);
  };

  const selectedStudio = selectedJob 
    ? studios.find(s => s.name.toLowerCase() === selectedJob.studioName.toLowerCase())
    : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-violet-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        jobs={jobs}
        studios={studios}
        bookmarkedIds={bookmarkedIds}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 py-10 sm:py-14">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open, Community-Verified Indie Game Dev Directory</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Find Your Next <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Indie Game Studio</span> Quest
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Browse verified openings from solo developers, boutique indies, and publishers. No candidate tracking or recruiter walled gardens: <span className="text-violet-300 font-medium">apply directly straight to the studio.</span>
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">Total Openings:</span>
              <strong className="text-white font-mono">{jobs.length}</strong>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span className="text-slate-400">Studios Tracked:</span>
              <strong className="text-white font-mono">{studios.length}</strong>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-slate-400">Remote Roles:</span>
              <strong className="text-white font-mono">
                {jobs.filter(j => j.workArrangement === 'Remote' || j.workArrangement === 'Flexible').length}
              </strong>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-violet-300" />
              <span>Submit a Role</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Render based on activeTab */}
        {activeTab === 'careermap' ? (
          <CareerMap
            jobs={jobs}
            onExploreFilter={handleExploreFilter}
          />
        ) : activeTab === 'verify' ? (
          <VerificationQueue
            jobs={jobs}
            onVouch={handleVouch}
            onFlag={handleFlag}
            onUpdateStatus={handleUpdateStatus}
            onSelectJob={(j) => setSelectedJob(j)}
            onOpenFeedIngestion={() => setIsFeedIngestionModalOpen(true)}
          />
        ) : (
          <>
            {/* Filter Matrix Component (Used for Openings, Studios, and Bookmarks) */}
            <FilterBar
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              totalResults={activeTab === 'studios' ? filteredStudios.length : filteredJobs.length}
            />

            {/* Sub-header / Sort / View Toggle */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  {activeTab === 'studios' ? (
                    <>
                      <Building2 className="w-5 h-5 text-violet-400" />
                      <span>Indie Game Studios Directory</span>
                    </>
                  ) : activeTab === 'bookmarks' ? (
                    <>
                      <Bookmark className="w-5 h-5 text-indigo-400" />
                      <span>Saved Positions ({filteredJobs.length})</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-5 h-5 text-violet-400" />
                      <span>Active Game Openings</span>
                    </>
                  )}
                </h3>
              </div>

              {/* Sort By Dropdown (for Jobs & Bookmarks) */}
              {activeTab !== 'studios' && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 hidden sm:inline">Sort:</span>
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                    >
                      <option value="latest">Latest Posted</option>
                      <option value="vouches">Most Vouched</option>
                      <option value="title">Role Title (A-Z)</option>
                      <option value="studio">Studio Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* TAB: OPENINGS OR BOOKMARKS */}
            {activeTab === 'jobs' || activeTab === 'bookmarks' ? (
              filteredJobs.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                  <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">
                    {activeTab === 'bookmarks' ? 'No Saved Positions Yet' : 'No Openings Found'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                    {activeTab === 'bookmarks'
                      ? 'Click the bookmark icon on any job card to save it for later.'
                      : 'Try broadening your filters or clearing your search keywords.'}
                  </p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isBookmarked={bookmarkedIds.includes(job.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onVouch={handleVouch}
                      onFlag={handleFlag}
                      onSelectJob={(j) => setSelectedJob(j)}
                    />
                  ))}
                </div>
              )
            ) : null}

            {/* TAB: STUDIOS DIRECTORY */}
            {activeTab === 'studios' ? (
              filteredStudios.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                  <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">No Studios Found</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                    Try adjusting your studio size, type, or engine filters.
                  </p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white"
                  >
                    Reset Studio Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStudios.map(studio => {
                    const studioOpenings = jobs.filter(
                      j => j.studioName.toLowerCase() === studio.name.toLowerCase()
                    );
                    return (
                      <StudioCard
                        key={studio.id}
                        studio={studio}
                        openings={studioOpenings}
                        onViewStudioJobs={handleViewStudioJobs}
                      />
                    );
                  })}
                </div>
              )
            ) : null}
          </>
        )}
      </main>

      {/* Direct Application Portal Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          studio={selectedStudio}
          onClose={() => setSelectedJob(null)}
          isBookmarked={bookmarkedIds.includes(selectedJob.id)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {/* Crowdsourcing Submission Modal */}
      <SubmitJobModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitJob}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        jobs={jobs}
      />

      {/* Public Feed & Reddit Ingestion Modal */}
      <FeedIngestionModal
        isOpen={isFeedIngestionModalOpen}
        onClose={() => setIsFeedIngestionModalOpen(false)}
        existingJobs={jobs}
        onImportJobs={handleBatchImportJobs}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-violet-500" />
            <span className="font-bold text-slate-300">Support Your Indies</span>
            <span>— The Open Indie Game Dev Jobs & Studio Network</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-slate-200 underline underline-offset-2"
            >
              Export Open Data
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (confirm('Reset to original sample data? This will clear custom submissions.')) {
                  storageService.resetToDefaults();
                  loadData();
                  showToast('Reset to default indie catalog');
                }
              }}
              className="hover:text-slate-200"
            >
              Reset Data
            </button>
            <span>•</span>
            <span className="text-slate-500">Built for aspiring & independent game developers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
