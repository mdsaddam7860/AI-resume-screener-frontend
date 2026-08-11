import { useEffect, useState, useCallback } from "react";
import { Job } from "./types";
import { fetchJobs, getErrorMessage } from "./api/client";
import JobCreateForm from "./components/JobCreateForm";
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  function handleJobCreated(job: Job) {
    setJobs((prev) => [{ ...job, candidateCount: 0 }, ...prev]);
    setSelectedJobId(job.id);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-slate-900">AI Resume Screening HR Tool</h1>
          <p className="text-sm text-slate-500">Internal tool — create a job, upload resumes, get ranked AI evaluations.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6">
            <JobCreateForm onJobCreated={handleJobCreated} />
            <JobList jobs={jobs} selectedJobId={selectedJobId} onSelectJob={setSelectedJobId} />
          </aside>

          <section>
            {selectedJobId ? (
              <JobDetails jobId={selectedJobId} />
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
                <p className="text-slate-500 text-sm">Select a job from the left, or create a new one to begin.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
