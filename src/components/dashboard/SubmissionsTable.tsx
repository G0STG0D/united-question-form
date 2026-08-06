"use client";

import { useTransition, useState, Fragment } from "react";
import { blockAccount, unblockAccount, updateStatus, updateSubmission, deleteSubmission } from "@/actions/blockAccount";
import type { SubmissionRow } from "@/lib/db";

type Props = {
    submissions: SubmissionRow[];
    blockedUuids: string[];
};

function EditableExpandedRow({ row, colSpan }: { row: SubmissionRow; colSpan: number }) {
    const [pending, startTransition] = useTransition();
    const [question, setQuestion] = useState(row.question);
    const initialAnswers: string[] = JSON.parse(row.answers_json);
    const [answers, setAnswers] = useState<string[]>(initialAnswers);
    const [correctIndex, setCorrectIndex] = useState(
        row.type === "MC" ? initialAnswers.indexOf(row.correct_answer ?? "") : -1
    );
    const [saved, setSaved] = useState(false);

    const updateAnswer = (i: number, val: string) =>
        setAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));

    const MC_MAX = 10;
    const MC_MIN = 4;

    const addAnswer = () => setAnswers((prev) => [...prev, ""]);
    const removeAnswer = (i: number) => {
        setAnswers((prev) => prev.filter((_, idx) => idx !== i));
        if (correctIndex === i) setCorrectIndex(-1);
        else if (correctIndex > i) setCorrectIndex((c) => c - 1);
    };

    const handleSave = () => {
        startTransition(async () => {
            await updateSubmission(
                row.id,
                question,
                JSON.stringify(answers),
                row.type === "MC" ? (answers[correctIndex] ?? null) : null
            );
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        });
    };

    return (
        <tr className="bg-gray-50 border-b border-gray-100">
            <td colSpan={colSpan} className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-6">
                    {/* Left: question + answers */}
                    <div className="flex-1 space-y-4 min-w-0">
                        {/* Question */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Question
                            </label>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none hover:border-gray-400 transition-colors"
                            />
                        </div>

                        {/* Answers */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                {row.type === "MC" ? "Answers" : "Accepted answers"}
                            </label>
                            <div className="space-y-2">
                                {answers.map((a, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        {row.type === "MC" && (
                                            <label className="cursor-pointer flex-shrink-0">
                                                <input
                                                    type="radio"
                                                    name={`correct-${row.id}`}
                                                    checked={correctIndex === i}
                                                    onChange={() => setCorrectIndex(i)}
                                                    className="sr-only"
                                                />
                                                <span
                                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                        correctIndex === i
                                                            ? "border-emerald-500 bg-emerald-500"
                                                            : "border-gray-300 hover:border-emerald-400"
                                                    }`}
                                                >
                                                    {correctIndex === i && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                    )}
                                                </span>
                                            </label>
                                        )}
                                        <span className="text-xs font-mono text-gray-400 w-4 flex-shrink-0">
                                            {row.type === "MC" ? String.fromCharCode(65 + i) : `${i + 1}.`}
                                        </span>
                                        <input
                                            type="text"
                                            value={a}
                                            onChange={(e) => updateAnswer(i, e.target.value)}
                                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-gray-400 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAnswer(i)}
                                            disabled={row.type === "MC" ? answers.length <= MC_MIN : answers.length <= 1}
                                            className="flex-shrink-0 w-6 h-6 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {answers.length < (row.type === "MC" ? MC_MAX : 26) && (
                                <button
                                    type="button"
                                    onClick={addAnswer}
                                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer mt-1"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add answer
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: notes */}
                    <div className="flex-1 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Notes
                        </label>
                        {row.additional_notes ? (
                            <p className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 leading-relaxed">
                                {row.additional_notes}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No notes</p>
                        )}
                    </div>
                </div>

                {/* Save */}
                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={pending}
                        className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-700 active:bg-black active:scale-95 disabled:opacity-40 text-white text-xs font-medium transition-all cursor-pointer"
                    >
                        {pending ? "Saving…" : "Save"}
                    </button>
                    {saved && <span className="text-xs text-emerald-600 font-medium">Saved</span>}
                </div>
            </td>
        </tr>
    );
}

function StatusBadge({ currentStatus }: { currentStatus: string }) {
    const badgeClass: Record<string, string> = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
        accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
        rejected: "bg-red-50 text-red-600 border-red-200",
    };
    return (
        <span
            className={`text-xs px-1.5 py-0.5 rounded border font-medium ${badgeClass[currentStatus] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}
        >
            {currentStatus}
        </span>
    );
}

function StatusButtons({ id, currentStatus }: { id: number; currentStatus: string }) {
    const [pending, startTransition] = useTransition();
    const [localStatus, setLocalStatus] = useState(currentStatus);

    const setStatus = (status: string) => {
        setLocalStatus(status);
        startTransition(async () => {
            await updateStatus(id, status);
        });
    };

    return (
        <div className="flex items-center gap-1.5">
            <button
                type="button"
                disabled={pending || localStatus === "accepted"}
                onClick={(e) => { e.stopPropagation(); setStatus("accepted"); }}
                className="px-2 py-1 rounded-md bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-medium transition-all cursor-pointer"
            >
                Accept
            </button>
            <button
                type="button"
                disabled={pending || localStatus === "rejected"}
                onClick={(e) => { e.stopPropagation(); setStatus("rejected"); }}
                className="px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 active:bg-red-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-medium transition-all cursor-pointer"
            >
                Reject
            </button>
        </div>
    );
}

function BlockButton({ uuid, isBlocked }: { uuid: string; isBlocked: boolean }) {
    const [pending, startTransition] = useTransition();
    const [confirming, setConfirming] = useState(false);

    if (isBlocked) {
        return (
            <button
                type="button"
                disabled={pending}
                onClick={(e) => {
                    e.stopPropagation();
                    startTransition(async () => { await unblockAccount(uuid); });
                }}
                className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 active:bg-gray-300 active:scale-95 disabled:opacity-40 text-gray-700 text-xs font-medium transition-all cursor-pointer"
            >
                {pending ? "…" : "Unblock"}
            </button>
        );
    }

    if (confirming) {
        return (
            <span className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-gray-500">Block?</span>
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => startTransition(async () => { await blockAccount(uuid); setConfirming(false); })}
                    className="px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-40 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                    {pending ? "…" : "Yes"}
                </button>
                <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 text-xs font-medium transition-all cursor-pointer"
                >
                    Cancel
                </button>
            </span>
        );
    }

    return (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
            className="px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 active:bg-red-700 active:scale-95 text-white text-xs font-medium transition-all cursor-pointer"
        >
            Block
        </button>
    );
}

function DeleteButton({ id }: { id: number }) {
    const [pending, startTransition] = useTransition();
    const [confirming, setConfirming] = useState(false);

    if (confirming) {
        return (
            <span className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-gray-500">Delete?</span>
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => startTransition(async () => { await deleteSubmission(id); })}
                    className="px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-40 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                    {pending ? "…" : "Yes"}
                </button>
                <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 text-xs font-medium transition-all cursor-pointer"
                >
                    Cancel
                </button>
            </span>
        );
    }

    return (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
            title="Delete submission"
        >
            <svg className="w-4 h-4 -translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    );
}

const COLS = 9;

export function SubmissionsTable({ submissions, blockedUuids }: Props) {
    const blockedSet = new Set(blockedUuids);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) =>
        setExpandedId((prev) => (prev === id ? null : id));

    if (submissions.length === 0) {
        return <p className="text-gray-500 text-sm p-4">No submissions yet.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100">
                        {["#", "UUID", "Type", "Question", "Difficulty", "Status", "Actions", "block", "delete"].map((h) => (
                            <th
                                key={h}
                                className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                {["block", "delete"].includes(h) ? "" : h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {submissions.map((row) => {
                        const isBlocked = blockedSet.has(row.submitter_uuid);
                        const isExpanded = expandedId === row.id;

                        return (
                            <Fragment key={row.id}>
                                <tr
                                    onClick={() => toggleExpand(row.id)}
                                    className={`cursor-pointer transition-colors ${isBlocked ? "opacity-40" : ""} ${isExpanded ? "bg-gray-50" : "hover:bg-gray-50"}`}
                                >
                                    <td className="px-3 py-3 text-gray-400 tabular-nums">{row.id}</td>
                                    <td className="px-3 py-3">
                                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                            {row.submitter_uuid.slice(0, 8)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${row.type === "MC" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-purple-50 text-purple-600 border-purple-200"}`}>
                                            {row.type}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 max-w-xs">
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className={`w-3 h-3 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <p className="truncate text-gray-800">{row.question}</p>
                                        </div>
                                        {row.minecraft_username && (
                                            <p className="text-xs text-gray-400 mt-0.5 pl-5">
                                                {row.minecraft_username}
                                                {row.discord_username && ` / ${row.discord_username}`}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap">
                                        {row.difficulty ?? "-"}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <StatusBadge currentStatus={row.status} />
                                    </td>
                                    <td className="px-3 py-3">
                                        <StatusButtons id={row.id} currentStatus={row.status} />
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <BlockButton uuid={row.submitter_uuid} isBlocked={isBlocked} />
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <DeleteButton id={row.id} />
                                    </td>
                                </tr>

                                {isExpanded && <EditableExpandedRow row={row} colSpan={COLS} />}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
