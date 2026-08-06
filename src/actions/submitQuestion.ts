"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { mcSchema, ftSchema, type FormState } from "@/lib/schemas";

export async function submitQuestion(
    _prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, errors: {}, message: "You must be signed in." };
    }

    const submitterUuid = session.user.id;
    const db = getDb();

    const blocked = db
        .prepare("SELECT 1 FROM blocked_accounts WHERE submitter_uuid = ?")
        .get(submitterUuid);
    if (blocked) {
        return {
            success: false,
            errors: {},
            message: "Your account has been blocked from submitting questions.",
        };
    }

    const type = formData.get("type") as string;

    if (type === "MC") {
        const answerCount = parseInt(formData.get("answer_count") as string, 10);
        const parsed = mcSchema.safeParse({
            type: "MC",
            question: formData.get("question"),
            correct_answer: formData.get("correct_answer"),
            answer_count: answerCount,
            difficulty: formData.get("difficulty") || undefined,
            minecraft_username: formData.get("minecraft_username") || undefined,
            discord_username: formData.get("discord_username") || undefined,
            additional_notes: formData.get("additional_notes") || undefined,
        });

        if (!parsed.success) {
            const errors: Record<string, string[]> = {};
            for (const issue of parsed.error.issues) {
                const key = issue.path[0]?.toString() ?? "root";
                if (!errors[key]) errors[key] = [];
                errors[key].push(issue.message);
            }
            return { success: false, errors };
        }

        const answers: string[] = [];
        for (let i = 0; i < answerCount; i++) {
            const val = (formData.get(`answer_${i}`) as string | null) ?? "";
            if (!val.trim()) {
                return {
                    success: false,
                    errors: { answers: [`Answer ${String.fromCharCode(65 + i)} cannot be empty.`] },
                };
            }
            answers.push(val.trim());
        }

        if (!answers.includes(parsed.data.correct_answer)) {
            return {
                success: false,
                errors: { correct_answer: ["Correct answer must match one of the answers."] },
            };
        }

        db.prepare(
            `INSERT INTO submissions (submitter_uuid, type, question, correct_answer, answers_json, difficulty, minecraft_username, discord_username, additional_notes)
       VALUES (?, 'MC', ?, ?, ?, ?, ?, ?, ?)`
        ).run(
            submitterUuid,
            parsed.data.question,
            parsed.data.correct_answer,
            JSON.stringify(answers),
            parsed.data.difficulty ?? null,
            parsed.data.minecraft_username ?? null,
            parsed.data.discord_username ?? null,
            parsed.data.additional_notes ?? null
        );

        return { success: true, message: "Question submitted successfully!" };
    }

    if (type === "FT") {
        const answerCount = parseInt(formData.get("accepted_answer_count") as string, 10);
        const parsed = ftSchema.safeParse({
            type: "FT",
            question: formData.get("question"),
            accepted_answer_count: answerCount,
            difficulty: formData.get("difficulty") || undefined,
            minecraft_username: formData.get("minecraft_username") || undefined,
            discord_username: formData.get("discord_username") || undefined,
            additional_notes: formData.get("additional_notes") || undefined,
        });

        if (!parsed.success) {
            const errors: Record<string, string[]> = {};
            for (const issue of parsed.error.issues) {
                const key = issue.path[0]?.toString() ?? "root";
                if (!errors[key]) errors[key] = [];
                errors[key].push(issue.message);
            }
            return { success: false, errors };
        }

        const answers: string[] = [];
        for (let i = 0; i < answerCount; i++) {
            const val = (formData.get(`accepted_answer_${i}`) as string | null) ?? "";
            if (!val.trim()) {
                return {
                    success: false,
                    errors: { answers: [`Accepted answer ${i + 1} cannot be empty.`] },
                };
            }
            answers.push(val.trim());
        }

        db.prepare(
            `INSERT INTO submissions (submitter_uuid, type, question, correct_answer, answers_json, difficulty, minecraft_username, discord_username, additional_notes)
       VALUES (?, 'FT', ?, NULL, ?, ?, ?, ?, ?)`
        ).run(
            submitterUuid,
            parsed.data.question,
            JSON.stringify(answers),
            parsed.data.difficulty ?? null,
            parsed.data.minecraft_username ?? null,
            parsed.data.discord_username ?? null,
            parsed.data.additional_notes ?? null
        );

        return { success: true, message: "Question submitted successfully!" };
    }

    return { success: false, errors: {}, message: "Invalid question type." };
}
