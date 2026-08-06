"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions, isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session?.user?.email)) {
        throw new Error("Unauthorized");
    }
}

export async function blockAccount(submitterUuid: string) {
    await requireAdmin();
    const db = getDb();
    db.prepare("INSERT OR IGNORE INTO blocked_accounts (submitter_uuid) VALUES (?)").run(
        submitterUuid
    );
    revalidatePath("/dashboard");
}

export async function unblockAccount(submitterUuid: string) {
    await requireAdmin();
    const db = getDb();
    db.prepare("DELETE FROM blocked_accounts WHERE submitter_uuid = ?").run(submitterUuid);
    revalidatePath("/dashboard");
}

export async function updateStatus(id: number, status: string) {
    await requireAdmin();
    const db = getDb();
    db.prepare("UPDATE submissions SET status = ? WHERE id = ?").run(status, id);
    revalidatePath("/dashboard");
}

export async function deleteSubmission(id: number) {
    await requireAdmin();
    const db = getDb();
    db.prepare("DELETE FROM submissions WHERE id = ?").run(id);
    revalidatePath("/dashboard");
}

export async function updateSubmission(
    id: number,
    question: string,
    answersJson: string,
    correctAnswer: string | null
) {
    await requireAdmin();
    const db = getDb();
    db.prepare(
        "UPDATE submissions SET question = ?, answers_json = ?, correct_answer = ? WHERE id = ?"
    ).run(question, answersJson, correctAnswer, id);
    revalidatePath("/dashboard");
}
