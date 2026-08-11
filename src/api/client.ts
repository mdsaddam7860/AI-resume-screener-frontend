import axios from "axios";
import { Job, Candidate, UploadResponse } from "../types";

// In local dev, VITE_API_URL is left unset and requests go to the relative
// "/api" path, which Vite's dev server proxies to localhost:4000 (see vite.config.ts).
// In production (e.g. Vercel), there is no such proxy - the frontend is served
// as static files - so VITE_API_URL must be set to the deployed backend's
// full URL (e.g. https://your-backend.onrailway.app/api).
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL, withCredentials: true });

export async function fetchJobs(): Promise<Job[]> {
  const { data } = await api.get<Job[]>("/jobs");
  return data;
}

export async function fetchJob(jobId: string): Promise<Job> {
  const { data } = await api.get<Job>(`/jobs/${jobId}`);
  return data;
}

export async function createJob(title: string, description: string): Promise<Job> {
  const { data } = await api.post<Job>("/jobs", { title, description });
  return data;
}

export async function uploadResumes(jobId: string, files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("resumes", file));

  const { data } = await api.post<UploadResponse>(`/jobs/${jobId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    // AI evaluation of a batch can take a while; allow a generous timeout.
    timeout: 120000,
  });
  return data;
}

export async function fetchCandidates(jobId: string): Promise<Candidate[]> {
  const { data } = await api.get<Candidate[]>(`/jobs/${jobId}/candidates`);
  return data;
}

/**
 * Triggers a browser download of the ranked candidate list as CSV.
 * Uses a blob response type since this is a file download, not JSON.
 */
export async function downloadCandidatesCsv(jobId: string, jobTitle: string): Promise<void> {
  const response = await api.get(`/jobs/${jobId}/candidates/export`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  const safeTitle = jobTitle.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  link.href = url;
  link.setAttribute("download", `candidates_${safeTitle || jobId}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/** Extracts a readable error message from an Axios error or generic error. */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { error?: string } | undefined)?.error ?? err.message;
  }
  return err instanceof Error ? err.message : "An unknown error occurred.";
}
