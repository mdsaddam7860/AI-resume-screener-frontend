import { useState, Fragment } from "react";
import { Candidate } from "../types";

interface Props {
  candidates: Candidate[];
}

function scoreColor(score: number): string {
  if (score >= 75) return "bg-green-100 text-green-700";
  if (score >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

/** Results dashboard: ranked candidate table with expandable rows for AI reasoning. */
export default function CandidateTable({ candidates }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-sm text-slate-500">
        No candidates yet. Upload resumes above to see AI-ranked results here.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3 w-16">Rank</th>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3 w-28">Score</th>
            <th className="text-left px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {candidates.map((c, idx) => {
            const isExpanded = expandedId === c.id;
            return (
              <Fragment key={c.id}>
                <tr
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                  className="cursor-pointer hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-3 text-slate-500 font-medium">#{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.resumeFileName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreColor(c.overallScore)}`}>
                      {c.overallScore}/100
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    <span className={`inline-block transition-transform ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="bg-slate-50/60">
                    <td colSpan={4} className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-green-700 uppercase mb-1.5">Matched Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {c.matchedSkills.length > 0 ? (
                              c.matchedSkills.map((s, i) => (
                                <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">None identified</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-red-700 uppercase mb-1.5">Missing Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {c.missingSkills.length > 0 ? (
                              c.missingSkills.map((s, i) => (
                                <span key={i} className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-full px-2 py-0.5">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">None</span>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-xs font-semibold text-amber-700 uppercase mb-1.5">Red Flags</h4>
                          <p className="text-sm text-slate-600">{c.redFlags}</p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1.5">AI Explainability</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{c.explainability}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
