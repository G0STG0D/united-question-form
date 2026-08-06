import { MultipleChoiceQuestion } from "@/components/questions/MultipleChoiceQuestion";
import { FreeTextQuestion } from "@/components/questions/FreeTextQuestion";

export type QuestionType = {
    id: "MC" | "FT";
    label: string;
    Component: React.ComponentType<{ errors?: Record<string, string[]> }>;
};

export const QUESTION_TYPES: QuestionType[] = [
    {
        id: "MC",
        label: "Multiple Choice",
        Component: MultipleChoiceQuestion,
    },
    {
        id: "FT",
        label: "Free Text",
        Component: FreeTextQuestion,
    },
];
