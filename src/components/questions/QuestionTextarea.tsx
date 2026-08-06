"use client";

import { useState } from "react";

type Props = {
    placeholder?: string;
    errors?: string[];
};

export function QuestionTextarea({ placeholder, errors }: Props) {
    const [text, setText] = useState("");

    return (
        <div className="space-y-1.5">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                Question
            </label>
            <input type="hidden" name="question" value={text + "?"} />
            <div className="flex rounded-xl border border-gray-300 bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-colors">
                <textarea
                    id="question"
                    rows={3}
                    placeholder={placeholder}
                    value={text}
                    onChange={(e) => setText(e.target.value.replace(/\?/g, ""))}
                    className="flex-1 px-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 text-sm focus:outline-none resize-none rounded-l-xl"
                />
                <span className="pt-3 pr-4 text-gray-400 text-sm select-none font-medium">?</span>
            </div>
            {errors?.map((e, i) => (
                <p key={i} className="text-xs text-red-500">
                    {e}
                </p>
            ))}
        </div>
    );
}
