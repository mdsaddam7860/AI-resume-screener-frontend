import { Job } from "../types";

interface Props {
  jobs: Job[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
}

/** Sidebar-style list of jobs; clicking a job selects it for the details view. */
export default function JobList({ jobs, selectedJobId, onSelectJob }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-sm text-slate-500">
        No jobs yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
      {jobs.map((job) => (
        <button
          key={job.id}
          onClick={() => onSelectJob(job.id)}
          className={`w-full text-left px-4 py-3 transition ${
            selectedJobId === job.id ? "bg-indigo-50" : "hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800 text-sm">{job.title}</span>
            {typeof job.candidateCount === "number" && (
              <span className="text-xs text-slate-400">{job.candidateCount} candidates</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  );
}
