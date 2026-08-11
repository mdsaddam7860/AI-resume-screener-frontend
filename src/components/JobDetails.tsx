import { useEffect, useState, useCallback } from "react";
import { Job, Candidate, UploadResponse } from "../types";
import { fetchJob, fetchCandidates, downloadCandidatesCsv, getErrorMessage } from "../api/client";
import ResumeUploader from "./ResumeUploader";
import CandidateTable from "./CandidateTable";

interface Props {
  jobId: string;
}

/** Job Details view: shows JD, resume upload dropzone, and the ranked candidate dashboard. */
export default function JobDetails({ jobId }: Props) {
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUploadSummary, setLastUploadSummary] = useState<UploadResponse["summary"] | null>(null);
  const [uploadErrors, setUploadErrors] = useState<{ fileName: string; error: string }[]>([]);
  const [exporting, setExporting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobData, candidateData] = await Promise.all([
        fetchJob(jobId),
        fetchCandidates(jobId),
      ]);
      setJob(jobData);
      setCandidates(candidateData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadData();
    setLastUploadSummary(null);
    setUploadErrors([]);
  }, [loadData]);

  function handleUploadComplete(result: UploadResponse) {
    setLastUploadSummary(result.summary);
    setUploadErrors(
      result.results.filter((r) => !r.success).map((r) => ({ fileName: r.fileName, error: r.error ?? "Unknown error" }))
    );
    // Refresh the ranked candidate list to include newly-processed resumes.
    fetchCandidates(jobId).then(setCandidates).catch((err) => setError(getErrorMessage(err)));
  }

  async function handleExport() {
    if (!job) return;
    setExporting(true);
    try {
      await downloadCandidatesCsv(job.id, job.title);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-slate-500">Loading job…</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!job) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">{job.title}</h2>
        <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap leading-relaxed">{job.description}</p>
      </div>

      <ResumeUploader jobId={jobId} onUploadComplete={handleUploadComplete} />

      {lastUploadSummary && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <p className="text-slate-700">
            Processed {lastUploadSummary.total} file(s):{" "}
            <span className="text-green-700 font-medium">{lastUploadSummary.succeeded} succeeded</span>
            {lastUploadSummary.failed > 0 && (
              <>
                , <span className="text-red-700 font-medium">{lastUploadSummary.failed} failed</span>
              </>
            )}
          </p>
          {uploadErrors.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-xs text-red-600 space-y-0.5">
              {uploadErrors.map((e, i) => (
                <li key={i}>
                  {e.fileName}: {e.error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">
            Ranked Candidates {candidates.length > 0 && `(${candidates.length})`}
          </h3>
          {candidates.length > 0 && (
            <button
              onClick={handleExport}
              disabled={exporting}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? "Exporting…" : "Export CSV"}
            </button>
          )}
        </div>
        <CandidateTable candidates={candidates} />
      </div>
    </div>
  );
}
