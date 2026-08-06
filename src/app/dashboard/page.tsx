import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdmin } from "@/lib/auth";
import { getDb, type SubmissionRow } from "@/lib/db";
import { SubmissionsTable } from "@/components/dashboard/SubmissionsTable";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user?.email)) {
        redirect("/");
    }

    const db = getDb();
    const submissions = db
        .prepare("SELECT * FROM submissions ORDER BY created_at DESC")
        .all() as SubmissionRow[];

    const blockedRows = db.prepare("SELECT submitter_uuid FROM blocked_accounts").all() as {
        submitter_uuid: string;
    }[];
    const blockedUuids = blockedRows.map((r) => r.submitter_uuid);

    const stats = {
        total: submissions.length,
        pending: submissions.filter((s) => s.status === "pending").length,
        accepted: submissions.filter((s) => s.status === "accepted").length,
        rejected: submissions.filter((s) => s.status === "rejected").length,
        blocked: blockedUuids.length,
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Submissions Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            United Lands – Question Submission
                        </p>
                    </div>
                    <a
                        href="/api/export"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 active:scale-[0.98] text-white text-sm font-medium transition-all cursor-pointer shadow-sm select-none"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Download CSV
                    </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                        { label: "Total", value: stats.total, color: "text-gray-900" },
                        { label: "Pending", value: stats.pending, color: "text-yellow-600" },
                        { label: "Accepted", value: stats.accepted, color: "text-emerald-600" },
                        { label: "Rejected", value: stats.rejected, color: "text-red-600" },
                        { label: "Blocked", value: stats.blocked, color: "text-orange-600" },
                    ].map(({ label, value, color }) => (
                        <div
                            key={label}
                            className="px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm"
                        >
                            <p className="text-xs text-gray-500">{label}</p>
                            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700">All Submissions</h2>
                    </div>
                    <div className="p-2">
                        <SubmissionsTable submissions={submissions} blockedUuids={blockedUuids} />
                    </div>
                </div>

                {/* Blocked accounts */}
                {blockedUuids.length > 0 && (
                    <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700">
                                Blocked Accounts
                            </h2>
                        </div>
                        <div className="p-4 flex flex-wrap gap-2">
                            {blockedUuids.map((uuid) => (
                                <span
                                    key={uuid}
                                    className="font-mono text-xs bg-red-50 border border-red-200 text-red-600 px-2 py-1 rounded"
                                >
                                    {uuid.slice(0, 8)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}
