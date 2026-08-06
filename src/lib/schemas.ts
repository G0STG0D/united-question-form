import { z } from "zod";

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Very Hard"] as const;

const submitterFields = {
    difficulty: z.enum(DIFFICULTIES).optional(),
    minecraft_username: z.string().max(16).optional(),
    discord_username: z.string().max(37).optional(),
    additional_notes: z.string().max(500).optional(),
};

const questionField = z
    .string()
    .min(10, "Question must be at least 10 characters.")
    .refine((q) => q.includes("?"), 'Question must contain a "?".');

export const mcSchema = z.object({
    type: z.literal("MC"),
    question: questionField,
    correct_answer: z.string().min(1, "Please mark one answer as correct."),
    answer_count: z.coerce.number().int().min(4, "At least 4 answers required.").max(10),
    ...submitterFields,
});

export const ftSchema = z.object({
    type: z.literal("FT"),
    question: questionField,
    accepted_answer_count: z.coerce
        .number()
        .int()
        .min(1, "At least 1 accepted answer required.")
        .max(26),
    ...submitterFields,
});

export type FormState =
    | {
          success: false;
          errors: Record<string, string[]>;
          message?: string;
      }
    | {
          success: true;
          message: string;
      }
    | null;

export { DIFFICULTIES };
