"use client";

type Props = {
    onSelect: (type: "MC" | "FT") => void;
};

export function QuestionTypeSelector({ onSelect }: Props) {
    return (
        <div className="space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Question type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => onSelect("MC")}
                    className="group flex flex-col gap-4 p-6 rounded-xl border border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 active:scale-[0.98] active:bg-emerald-50 transition-all text-left cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm"
                >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 border border-emerald-100 flex items-center justify-center transition-colors">
                        <svg
                            className="w-5 h-5 text-emerald-600"
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
                        <p className="font-semibold text-gray-900">Multiple Choice</p>
                        <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                            A question with predefined answer choices. One answer is correct.
                        </p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onSelect("FT")}
                    className="group flex flex-col gap-4 p-6 rounded-xl border border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 active:scale-[0.98] active:bg-emerald-50 transition-all text-left cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm"
                >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 border border-emerald-100 flex items-center justify-center transition-colors">
                        <svg
                            className="w-5 h-5 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Free Text</p>
                        <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                            A question with one or more accepted text answers (e.g. "Vienna" and
                            "Wien").
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}
