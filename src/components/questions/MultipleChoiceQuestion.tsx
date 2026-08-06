"use client";

import { useState } from "react";
import { QuestionTextarea } from "./QuestionTextarea";

const MAX_ANSWERS = 10;
const MIN_ANSWERS = 4;

type Props = {
    errors?: Record<string, string[]>;
};

export function MultipleChoiceQuestion({ errors }: Props) {
    const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState<number | null>(null);

    const addAnswer = () => {
        if (answers.length < MAX_ANSWERS) {
            setAnswers((prev) => [...prev, ""]);
        }
    };

    const removeAnswer = (idx: number) => {
        setAnswers((prev) => prev.filter((_, i) => i !== idx));
        if (correctIndex === idx) setCorrectIndex(null);
        else if (correctIndex !== null && correctIndex > idx) setCorrectIndex(correctIndex - 1);
    };

    const updateAnswer = (idx: number, value: string) => {
        setAnswers((prev) => prev.map((a, i) => (i === idx ? value : a)));
    };

    const correctAnswer = correctIndex !== null ? answers[correctIndex] : "";

    return (
        <div className="space-y-5">
            <input type="hidden" name="answer_count" value={answers.length} />
            <input type="hidden" name="correct_answer" value={correctAnswer} />
            {answers.map((answer, i) => (
                <input key={i} type="hidden" name={`answer_${i}`} value={answer} />
            ))}

            <QuestionTextarea
                placeholder="Who is the owner of United Lands"
                errors={errors?.question}
            />

            {/* Answers */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                    Answers{" "}
                    <span className="text-gray-400 font-normal">
                        (select the correct one with the radio button)
                    </span>
                </p>

                <div className="space-y-2">
                    {answers.map((answer, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-mono font-bold text-gray-500">
                                {String.fromCharCode(65 + i)}
                            </span>

                            <input
                                type="text"
                                placeholder={`Answer ${String.fromCharCode(65 + i)}`}
                                value={answer}
                                onChange={(e) => updateAnswer(i, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors hover:border-gray-400"
                            />

                            <label
                                className="flex-shrink-0 flex items-center gap-1.5 cursor-pointer group"
                                title="Mark as correct"
                            >
                                <input
                                    type="radio"
                                    name="__correct_radio"
                                    checked={correctIndex === i}
                                    onChange={() => setCorrectIndex(i)}
                                    className="sr-only"
                                />
                                <span
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        correctIndex === i
                                            ? "border-emerald-500 bg-emerald-500"
                                            : "border-gray-300 group-hover:border-emerald-400"
                                    }`}
                                >
                                    {correctIndex === i && (
                                        <span className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                </span>
                            </label>

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
                        Add answer ({String.fromCharCode(65 + answers.length)})
                    </button>
                )}

                {errors?.answers?.map((e, i) => (
                    <p key={i} className="text-xs text-red-500">
                        {e}
                    </p>
                ))}
                {errors?.correct_answer?.map((e, i) => (
                    <p key={i} className="text-xs text-red-500">
                        {e}
                    </p>
                ))}
            </div>
        </div>
    );
}
