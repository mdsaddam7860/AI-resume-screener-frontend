import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { uploadResumes, getErrorMessage } from "../api/client";
import { UploadResponse } from "../types";

interface Props {
  jobId: string;
  onUploadComplete: (result: UploadResponse) => void;
}

/** Dropzone / file input for uploading a batch of resume PDFs, with a loading state while AI evaluates them. */
export default function ResumeUploader({ jobId, onUploadComplete }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const pdfFiles = Array.from(fileList).filter((f) => f.type === "application/pdf");
    if (pdfFiles.length === 0) {
      setError("Please select PDF files only.");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const result = await uploadResumes(jobId, pdfFiles);
      onUploadComplete(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">Upload Resumes</h3>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed px-6 py-10 text-center transition ${
          dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-slate-400"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p className="text-sm text-indigo-700 font-medium">AI is analyzing resumes…</p>
            <p className="text-xs text-slate-400">This can take a moment for larger batches.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Drag & drop resume PDFs here, or <span className="text-indigo-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Multiple .pdf files supported</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={onChange}
        />
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  );
}
