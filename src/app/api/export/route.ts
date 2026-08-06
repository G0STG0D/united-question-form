import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { getDb, type SubmissionRow } from "@/lib/db";
import { buildCsvContent } from "@/lib/csvExport";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session?.user?.email)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const rows = db
        .prepare(
            `SELECT s.* FROM submissions s
       WHERE s.status = 'accepted'
         AND s.submitter_uuid NOT IN (SELECT submitter_uuid FROM blocked_accounts)
       ORDER BY s.created_at ASC`
        )
        .all() as SubmissionRow[];

    const csv = buildCsvContent(rows);

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="united-lands-questions.csv"',
        },
    });
}
