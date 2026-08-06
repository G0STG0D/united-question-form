"use client";

import { useState } from "react";
import { QuestionTextarea } from "./QuestionTextarea";

const MAX_ANSWERS = 26;
const MIN_ANSWERS = 1;

type Props = {
    errors?: Record<string, string[]>;
};

export function FreeTextQuestion({ errors }: Props) {
    const [answers, setAnswers] = useState<string[]>(["", ""]);

    const addAnswer = () => {
        if (answers.length < MAX_ANSWERS) {
            setAnswers((prev) => [...prev, ""]);
        }
    };

    const removeAnswer = (idx: number) => {
        setAnswers((prev) => prev.filter((_, i) => i !== idx));
    };

    const updateAnswer = (idx: number, value: string) => {
        setAnswers((prev) => prev.map((a, i) => (i === idx ? value : a)));
    };

    return (
        <div className="space-y-5">
            <input type="hidden" name="accepted_answer_count" value={answers.length} />
            {answers.map((answer, i) => (
                <input key={i} type="hidden" name={`accepted_answer_${i}`} value={answer} />
            ))}

            <QuestionTextarea
                placeholder="What is the currency of United Lands"
                errors={errors?.question}
            />

            {/* Accepted answers */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                    Accepted answers{" "}
                    <span className="text-gray-400 font-normal">
                        (all variations that should count as correct)
                    </span>
                </p>

                <div className="space-y-2">
                    {answers.map((answer, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-mono text-gray-500">
                                {i + 1}
                            </span>

                            <input
                                type="text"
                                placeholder={i === 0 ? "Primary answer" : `Alternative ${i + 1}`}
                                value={answer}
                                onChange={(e) => updateAnswer(i, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors hover:border-gray-400"
                            />

                            <button
                                type="button"
                                onClick={() => removeAnswer(i)}
                                disabled={answers.length <= MIN_ANSWERS}
                                className="flex-shrink-0 w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
                                title="Remove answer"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {answers.length < MAX_ANSWERS && (
                    <button
                        type="button"
                        onClick={addAnswer}
                        className="mt-2 flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 active:text-emerald-700 active:scale-95 transition-all cursor-pointer"
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add accepted answer
                    </button>
                )}

                {errors?.answers?.map((e, i) => (
                    <p key={i} className="text-xs text-red-500">
                        {e}
                    </p>
                ))}
            </div>
        </div>
    );
}
