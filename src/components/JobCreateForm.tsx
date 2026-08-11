import { useState, FormEvent } from "react";
import { createJob, getErrorMessage } from "../api/client";
import { Job } from "../types";

interface Props {
  onJobCreated: (job: Job) => void;
}

/** Simple form for HR to create a new job posting (title + JD textarea). */
export default function JobCreateForm({ onJobCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Both title and job description are required.");
      return;
    }

    setSubmitting(true);
    try {
      const job = await createJob(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      onJobCreated(job);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Create a Job Posting</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">
          Job Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Senior Backend Engineer"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">
          Job Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Paste the full job description, required skills, and responsibilities..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {submitting ? "Creating..." : "Create Job"}
      </button>
    </form>
  );
}
