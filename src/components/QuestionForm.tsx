"use client";

import { useTransition, useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { submitQuestion } from "@/actions/submitQuestion";
import { QUESTION_TYPES } from "@/lib/questionTypes";
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { SubmitterInfo } from "./SubmitterInfo";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/lib/schemas";

type Step = "type" | "question" | "submitter";

type Props = {
    userName: string | null | undefined;
    userImage: string | null | undefined;
};

export function QuestionForm({ userName, userImage }: Props) {
    const [pending, startTransition] = useTransition();
    const [serverState, setServerState] = useState<FormState>(null);
    const [submitted, setSubmitted] = useState(false);
    const [selectedType, setSelectedType] = useState<"MC" | "FT" | null>(null);
    const [step, setStep] = useState<Step>("type");
    const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await submitQuestion(null, formData);
            setServerState(result);
            if (result?.success) setSubmitted(true);
        });
    };

    const handleReset = () => {
        setSubmitted(false);
        setServerState(null);
        setSelectedType(null);
        setStep("type");
        setClientErrors({});
    };

    const handleSelectType = (type: "MC" | "FT") => {
        setSelectedType(type);
        setStep("question");
        setClientErrors({});
    };

    const handleNext = () => {
        if (!formRef.current) return;
        const data = new FormData(formRef.current);
        const question = ((data.get("question") as string) ?? "").trim();
        const errors: Record<string, string[]> = {};

        if (question.length < 10) {
            errors.question = ["Question must be at least 10 characters."];
        } else if (!question.includes("?")) {
            errors.question = ['Question must contain a "?".'];
        }

        if (selectedType === "MC") {
            const count = parseInt((data.get("answer_count") as string) ?? "0");
            const correctAnswer = ((data.get("correct_answer") as string) ?? "").trim();
            const answers = Array.from({ length: count }, (_, i) =>
                ((data.get(`answer_${i}`) as string) ?? "").trim()
            );
            if (answers.some((a) => !a)) errors.answers = ["All answers must be filled in."];
            if (!correctAnswer) errors.correct_answer = ["Please mark one answer as correct."];
        }

        if (selectedType === "FT") {
            const count = parseInt((data.get("accepted_answer_count") as string) ?? "0");
            const answers = Array.from({ length: count }, (_, i) =>
                ((data.get(`accepted_answer_${i}`) as string) ?? "").trim()
            );
            if (answers.some((a) => !a))
                errors.answers = ["All accepted answers must be filled in."];
        }

        if (Object.keys(errors).length > 0) {
            setClientErrors(errors);
            return;
        }

        setClientErrors({});
        setStep("submitter");
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center gap-6 py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Question submitted!</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Thank you. Your question will be reviewed.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 active:scale-[0.98] text-gray-800 text-sm font-medium transition-all cursor-pointer select-none"
                >
                    Submit another question
                </button>
            </div>
        );
    }

    const selectedConfig = QUESTION_TYPES.find((t) => t.id === selectedType);
    const serverErrors = serverState && !serverState.success ? serverState.errors : {};

    return (
        <div className="space-y-6">
            {/* User badge */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    {userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={userImage}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full"
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200" />
                    )}
                    <span className="text-sm text-gray-600">{userName}</span>
                </div>
                <button
                    type="button"
                    onClick={() => signOut()}
                    className="text-xs text-gray-400 hover:text-gray-700 active:scale-95 transition-all cursor-pointer"
                >
                    Sign out
                </button>
            </div>

            {/* Server error (e.g. blocked account) */}
            {serverState && !serverState.success && serverState.message && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    {serverState.message}
                </div>
            )}

            {/* Step: type selection */}
            {step === "type" && <QuestionTypeSelector onSelect={handleSelectType} />}

            {/* Steps: question + submitter (single form, question kept mounted) */}
            {(step === "question" || step === "submitter") && selectedConfig && (
                <form onSubmit={handleSubmit} ref={formRef} className="space-y-8">
                    <input type="hidden" name="type" value={selectedType ?? ""} />

                    {/* Step header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                                <span
                                    className={
                                        step === "question" ? "text-gray-900 font-medium" : ""
                                    }
                                >
                                    Question
                                </span>
                                {" / "}
                                <span
                                    className={
                                        step === "submitter" ? "text-gray-900 font-medium" : ""
                                    }
                                >
                                    Info
                                </span>
                            </span>
                            <span className="text-gray-300 text-xs">|</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
                                {selectedConfig.label}
                            </span>
                        </div>

                        {step === "question" && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedType(null);
                                    setStep("type");
                                    setClientErrors({});
                                }}
                                className="text-xs text-gray-400 hover:text-gray-700 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Change type
                            </button>
                        )}
                        {step === "submitter" && (
                            <button
                                type="button"
                                onClick={() => setStep("question")}
                                className="text-xs text-gray-400 hover:text-gray-700 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back
                            </button>
                        )}
                    </div>

                    {/* Question component — always mounted, hidden on submitter step so hidden inputs persist */}
                    <div className={step === "submitter" ? "hidden" : "space-y-6"}>
                        <selectedConfig.Component errors={{ ...clientErrors, ...serverErrors }} />
                        <button
                            type="button"
                            onClick={handleNext}
                            className="w-full py-3 px-6 rounded-xl bg-gray-900 hover:bg-gray-700 active:bg-black active:scale-[0.99] text-white font-semibold text-sm transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 shadow-sm"
                        >
                            Next
                        </button>
                    </div>

                    {/* Submitter info step */}
                    {step === "submitter" && (
                        <div className="space-y-8">
                            <SubmitterInfo errors={serverErrors} />
                            <SubmitButton pending={pending} />
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}
