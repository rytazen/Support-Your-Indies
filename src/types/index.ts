export type StudioSize = 
  | '0-1' 
  | '2-10' 
  | '11-50' 
  | '51-200' 
  | '201-500' 
  | '501-1000' 
  | '1001-5000' 
  | '5001-10000';

export type StudioType = 'Developer' | 'Publisher' | 'Both';

export type WorkArrangement = 'Remote' | 'Hybrid' | 'Onsite' | 'Flexible' | 'Unknown';

export type HiringStatus = 'Active' | 'Inactive' | 'Internship Only' | 'Closed';

export type VerificationStatus = 'verified' | 'community_verified' | 'pending' | 'flagged';

export type Discipline = 
  | 'Gameplay Programming'
  | 'Engine & Graphics'
  | 'Technical Art & Shaders'
  | '3D Art & Animation'
  | '2D & Pixel Art'
  | 'Level & Systems Design'
  | 'Narrative & Writing'
  | 'Audio & Sound (FMOD/Wwise)'
  | 'UI/UX Design'
  | 'Producer & Production'
  | 'QA & Playtesting';

export type GameEngine = 
  | 'Unreal Engine 5'
  | 'Unity'
  | 'Godot'
  | 'GameMaker'
  | 'Custom C++ / Rust'
  | 'Bevy'
  | 'Other';

export interface Studio {
  id: string;
  name: string;
  logoUrl?: string;
  website: string;
  careersUrl: string;
  type: StudioType;
  size: StudioSize;
  location: string;
  workArrangement: WorkArrangement;
  hiringStatus: HiringStatus;
  primaryEngine: GameEngine;
  notableGames: string[];
  description: string;
  foundedYear?: number;
  twitterOrBluesky?: string;
  discordUrl?: string;
}

export interface JobOpening {
  id: string;
  studioId: string;
  studioName: string;
  studioLogoUrl?: string;
  title: string;
  discipline: Discipline;
  engine: GameEngine;
  location: string;
  workArrangement: WorkArrangement;
  hiringStatus: HiringStatus;
  studioType: StudioType;
  studioSize: StudioSize;
  salaryRange?: string;
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Internship';
  directApplyUrl: string;
  proofUrl: string;
  verificationStatus: VerificationStatus;
  vouchCount: number;
  flagCount: number;
  userVoted?: 'vouched' | 'flagged' | null;
  submittedBy: 'Studio Direct' | 'Community Scout' | 'Core Curator';
  submitterNotes?: string;
  datePosted: string;
  description: string;
  requirements: string[];
  perks?: string[];
}

export interface FilterState {
  searchQuery: string;
  discipline: Discipline | 'All';
  engine: GameEngine | 'All';
  workArrangement: WorkArrangement | 'All';
  studioSize: StudioSize | 'All';
  studioType: StudioType | 'All';
  hiringStatus: HiringStatus | 'All';
  verificationStatus: VerificationStatus | 'All';
  employmentType: string;
  sortBy: 'latest' | 'vouches' | 'title' | 'studio';
}
