export interface Job {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  candidateCount?: number;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  resumeFileName: string;
  overallScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  redFlags: string;
  explainability: string;
  createdAt: string;
}

export interface UploadResultItem {
  fileName: string;
  success: boolean;
  candidate?: Candidate;
  error?: string;
}

export interface UploadResponse {
  summary: { total: number; succeeded: number; failed: number };
  results: UploadResultItem[];
}
