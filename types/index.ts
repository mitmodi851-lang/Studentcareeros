// ─── Auth ─────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string; // ISO string
}

// ─── Events ───────────────────────────────────────────────────────
export type EventType = 'Hackathon' | 'AI Summit' | 'Workshop' | 'Competition' | 'Webinar';
export type EventMode = 'Online' | 'Offline' | 'Hybrid';

export interface CareerEvent {
  id: string;
  title: string;
  type: EventType;
  startDate: string;       // ISO string
  endDate: string;         // ISO string
  mode: EventMode;
  organizer: string;
  location: string;
  description: string;
  tags: string[];
  registrationUrl: string;
}

// ─── Categories ───────────────────────────────────────────────────
export type CategoryId =
  | 'ai-applied-ai'
  | 'web-software-dev'
  | 'data-science-analytics'
  | 'cybersecurity'
  | 'cloud-computing'
  | 'ui-ux-design'
  | 'business-project-mgmt'
  | 'digital-marketing';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;       // emoji
  color: string;      // tailwind color class
}

// ─── Aptitude Questions ───────────────────────────────────────────
export interface QuestionOption {
  id: string;
  text: string;
  categoryId: CategoryId;
}

export interface AptitudeQuestion {
  id: string;
  text: string;
  order: number;
  options: QuestionOption[];
}

// ─── Certifications ───────────────────────────────────────────────
export type CertLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Certification {
  id: string;
  name: string;
  provider: string;
  level: CertLevel;
  description: string;
  categoryId: CategoryId;
  url: string;
  rating?: number;
  recommendationVerdict?: 'Excellent Choice' | 'Highly Recommended' | 'Industry Standard' | 'Good for Beginners' | 'Advanced Specialization';
  whyGood?: string;
  watchOut?: string;
  officialIssuer?: string;
}

// ─── Aptitude Submissions ─────────────────────────────────────────
export interface AnswerEntry {
  questionId: string;
  optionId: string;
}

export interface AptitudeSubmission {
  id: string;
  userId: string;
  userEmail?: string;
  submittedAt: string;   // ISO string
  scores: Record<string, number>;
  topCategoryIds: string[];
  answers: AnswerEntry[];
}

// ─── API Response Shapes ──────────────────────────────────────────
export interface ApiError {
  error: string;
}

export interface SubmissionResult {
  submissionId: string;
  topCategoryIds: string[];
  scores: Record<string, number>;
  certifications: Certification[];
  categories: Category[];
}

export interface ProfileData {
  name: string;
  email: string;
  submissions: AptitudeSubmission[];
}

// ─── Course Progress ──────────────────────────────────────────────
export type ProgressStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface CourseProgress {
  id: string;
  user_id: string;
  certification_id: string;
  progress: number;
  status: ProgressStatus;
  updated_at: string;
  completed_at: string | null;
}

export interface UserCourseProgressItem extends CourseProgress {
  certification?: Certification;
}

export interface PasswordResetToken {
  id: string;
  email: string;
  token: string;
  expires_at: string;
}

// ─── Trending Courses Analyzer ────────────────────────────────────
export type CourseTier = 'Best' | 'Medium' | 'New';
export type CourseLanguage = 'English' | 'Hindi' | 'Hinglish' | 'All';
export type PlatformType = 'Google Course' | 'YouTube Video' | 'Certification' | 'Interactive';

export interface TrendingCourse {
  id: string;
  title: string;
  provider: string;
  platformType?: PlatformType;
  tier: CourseTier;
  language: 'English' | 'Hindi' | 'Hinglish';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolledCount: string;
  duration: string;
  cost: string;
  description: string;
  keyHighlights: string[];
  verdictReason: string;
  url: string;
  tags: string[];
}

export interface TrendAnalysisResult {
  query: string;
  language: CourseLanguage;
  bestOption: TrendingCourse;
  mediumOption: TrendingCourse;
  newOption: TrendingCourse;
  insightsSummary: string;
}

// ─── Teammate Finder ──────────────────────────────────────────────
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CollaborationMode = 'Remote' | 'In-Person' | 'Hybrid';
export type TeammateRequestStatus = 'Open' | 'Closed';

export interface TeammateRequest {
  id: string;
  userId: string;
  userName: string;
  projectName: string;
  preferredRole: string;
  skills: string[];
  description: string;
  experienceLevel: ExperienceLevel;
  availability: string;
  collaborationMode: CollaborationMode;
  status: TeammateRequestStatus;
  createdAt: string;       // ISO string
  updatedAt?: string;      // ISO string
  interestedUserIds?: string[];
  interestedCount?: number;
  teamSize?: number;
  maxTeamSize?: number;
}

// ─── Course Prerequisites ──────────────────────────────────────────
export interface CoursePrerequisite {
  id: string;
  title: string;
  description?: string;
  category?: string;
}

export interface UserPrerequisiteProgress {
  id?: string;
  userId: string;
  courseId: string;
  completedPrerequisiteIds: string[];
  updatedAt: string;
}

// ─── Career Path Simulator ─────────────────────────────────────────
export interface RoadmapPhase {
  title: string;
  duration: string;
  description: string;
  milestones: string[];
}

export interface CareerProjectIdea {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  tools: string[];
  portfolioOutcome: string;
}

export interface CareerPathDetails {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  badgeColor: string;
  salaryRange: string;
  jobGrowth: string;
  roles: string[];
  dayInTheLife: string;
  coreSkills: {
    name: string;
    description: string;
    importance: 'Must Have' | 'Recommended' | 'Emerging';
  }[];
  roadmap: RoadmapPhase[];
  projects: CareerProjectIdea[];
  recommendedCertIds: string[];
  trendingSearchQuery: string;
}



