import type { SubmissionRow } from "./db";

function escapeCsvField(value: string): string {
    if (value.includes(";") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

export function rowToCsvLine(row: SubmissionRow): string {
    const answers: string[] = JSON.parse(row.answers_json);

    if (row.type === "MC") {
        const wrongAnswers = answers.filter((a) => a !== row.correct_answer);
        const fields = ["MC", row.question, row.correct_answer ?? "", ...wrongAnswers];
        return fields.map(escapeCsvField).join(";");
    } else {
        const fields = ["FT", row.question, ...answers];
        return fields.map(escapeCsvField).join(";");
    }
}

export function buildCsvContent(rows: SubmissionRow[]): string {
    return rows.map(rowToCsvLine).join("\n");
}
