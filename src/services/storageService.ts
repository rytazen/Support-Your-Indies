import { JobOpening, Studio, VerificationStatus, HiringStatus } from '../types';
import { INITIAL_JOB_OPENINGS, INITIAL_STUDIOS } from '../data/mockData';

const JOBS_STORAGE_KEY = 'support_your_indies_jobs_v1';
const STUDIOS_STORAGE_KEY = 'support_your_indies_studios_v1';
const BOOKMARKS_STORAGE_KEY = 'support_your_indies_bookmarks_v1';
const USER_VOTES_KEY = 'support_your_indies_user_votes_v1';

export const storageService = {
  getStudios(): Studio[] {
    try {
      const stored = localStorage.getItem(STUDIOS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STUDIOS_STORAGE_KEY, JSON.stringify(INITIAL_STUDIOS));
        return INITIAL_STUDIOS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_STUDIOS;
    }
  },

  getJobs(): JobOpening[] {
    try {
      const stored = localStorage.getItem(JOBS_STORAGE_KEY);
      const userVotesStr = localStorage.getItem(USER_VOTES_KEY);
      const userVotes: Record<string, 'vouched' | 'flagged'> = userVotesStr ? JSON.parse(userVotesStr) : {};

      let jobs: JobOpening[] = [];
      if (!stored) {
        jobs = INITIAL_JOB_OPENINGS;
        localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(INITIAL_JOB_OPENINGS));
      } else {
        jobs = JSON.parse(stored);
      }

      // attach local user vote state
      return jobs.map(j => ({
        ...j,
        userVoted: userVotes[j.id] || null
      }));
    } catch {
      return INITIAL_JOB_OPENINGS;
    }
  },

  addJob(newJob: Omit<JobOpening, 'id' | 'vouchCount' | 'flagCount' | 'datePosted'>): JobOpening {
    const jobs = this.getJobs();
    const created: JobOpening = {
      ...newJob,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      vouchCount: 1, // Submitter implicitly vouches
      flagCount: 0,
      datePosted: new Date().toISOString().split('T')[0],
      userVoted: 'vouched'
    };

    const updated = [created, ...jobs];
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updated));

    // Record user vote
    const userVotesStr = localStorage.getItem(USER_VOTES_KEY);
    const userVotes = userVotesStr ? JSON.parse(userVotesStr) : {};
    userVotes[created.id] = 'vouched';
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(userVotes));

    // Also ensure studio exists or is updated
    this.ensureStudioForJob(created);

    return created;
  },

  ensureStudioForJob(job: JobOpening) {
    const studios = this.getStudios();
    const existing = studios.find(s => s.name.toLowerCase() === job.studioName.toLowerCase());
    if (!existing) {
      const newStudio: Studio = {
        id: `studio-${Date.now()}`,
        name: job.studioName,
        website: job.directApplyUrl.startsWith('http') ? new URL(job.directApplyUrl).origin : 'https://indiedev.games',
        careersUrl: job.directApplyUrl,
        type: job.studioType,
        size: job.studioSize,
        location: job.location,
        workArrangement: job.workArrangement,
        hiringStatus: job.hiringStatus,
        primaryEngine: job.engine,
        notableGames: ['In Development'],
        description: `Indie game team hiring for ${job.title}.`
      };
      studios.unshift(newStudio);
      localStorage.setItem(STUDIOS_STORAGE_KEY, JSON.stringify(studios));
    }
  },

  vouchJob(jobId: string): { success: boolean; newStatus?: VerificationStatus; newVouches?: number } {
    const jobs = this.getJobs();
    const target = jobs.find(j => j.id === jobId);
    if (!target) return { success: false };

    const userVotesStr = localStorage.getItem(USER_VOTES_KEY);
    const userVotes: Record<string, 'vouched' | 'flagged'> = userVotesStr ? JSON.parse(userVotesStr) : {};

    if (userVotes[jobId] === 'vouched') {
      // Undo vouch
      target.vouchCount = Math.max(0, target.vouchCount - 1);
      delete userVotes[jobId];
    } else {
      // Apply vouch
      if (userVotes[jobId] === 'flagged') {
        target.flagCount = Math.max(0, target.flagCount - 1);
      }
      target.vouchCount += 1;
      userVotes[jobId] = 'vouched';

      // Upgrade status if threshold reached
      if (target.verificationStatus === 'pending' && target.vouchCount >= 2) {
        target.verificationStatus = 'community_verified';
      }
    }

    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(userVotes));
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));

    return {
      success: true,
      newStatus: target.verificationStatus,
      newVouches: target.vouchCount
    };
  },

  flagJob(jobId: string, reason?: string): { success: boolean; newStatus?: VerificationStatus; newFlags?: number } {
    const jobs = this.getJobs();
    const target = jobs.find(j => j.id === jobId);
    if (!target) return { success: false };

    const userVotesStr = localStorage.getItem(USER_VOTES_KEY);
    const userVotes: Record<string, 'vouched' | 'flagged'> = userVotesStr ? JSON.parse(userVotesStr) : {};

    if (userVotes[jobId] === 'flagged') {
      // Undo flag
      target.flagCount = Math.max(0, target.flagCount - 1);
      delete userVotes[jobId];
    } else {
      if (userVotes[jobId] === 'vouched') {
        target.vouchCount = Math.max(0, target.vouchCount - 1);
      }
      target.flagCount += 1;
      userVotes[jobId] = 'flagged';

      if (target.flagCount >= 2) {
        target.verificationStatus = 'flagged';
        target.hiringStatus = 'Closed';
      }
    }

    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(userVotes));
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));

    return {
      success: true,
      newStatus: target.verificationStatus,
      newFlags: target.flagCount
    };
  },

  updateJobStatus(jobId: string, verificationStatus: VerificationStatus, hiringStatus?: HiringStatus) {
    const jobs = this.getJobs();
    const target = jobs.find(j => j.id === jobId);
    if (!target) return false;

    target.verificationStatus = verificationStatus;
    if (hiringStatus) {
      target.hiringStatus = hiringStatus;
    }
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    return true;
  },

  getBookmarks(): string[] {
    try {
      const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(jobId: string): boolean {
    const current = this.getBookmarks();
    const index = current.indexOf(jobId);
    let updated: string[];
    let isBookmarked: boolean;

    if (index >= 0) {
      updated = current.filter(id => id !== jobId);
      isBookmarked = false;
    } else {
      updated = [...current, jobId];
      isBookmarked = true;
    }

    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    return isBookmarked;
  },

  exportToCSV(jobs: JobOpening[]): string {
    const headers = [
      'Studio Size',
      'Studio Type',
      'Work Arrangement',
      'Hiring Status',
      'Title',
      'Studio Name',
      'Discipline',
      'Engine',
      'Location',
      'Salary Range',
      'Direct Apply URL',
      'Proof Source URL',
      'Verification Status',
      'Community Vouches',
      'Date Posted'
    ];

    const escapeCsv = (str: string | undefined) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = jobs.map(j => [
      escapeCsv(j.studioSize),
      escapeCsv(j.studioType),
      escapeCsv(j.workArrangement),
      escapeCsv(j.hiringStatus),
      escapeCsv(j.title),
      escapeCsv(j.studioName),
      escapeCsv(j.discipline),
      escapeCsv(j.engine),
      escapeCsv(j.location),
      escapeCsv(j.salaryRange || 'Unspecified'),
      escapeCsv(j.directApplyUrl),
      escapeCsv(j.proofUrl),
      escapeCsv(j.verificationStatus),
      j.vouchCount,
      escapeCsv(j.datePosted)
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  resetToDefaults() {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(INITIAL_JOB_OPENINGS));
    localStorage.setItem(STUDIOS_STORAGE_KEY, JSON.stringify(INITIAL_STUDIOS));
    localStorage.removeItem(USER_VOTES_KEY);
    localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
  }
};
