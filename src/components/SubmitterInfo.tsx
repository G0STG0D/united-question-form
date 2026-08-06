"use client";

import { useState, useEffect } from "react";
import { DIFFICULTIES } from "@/lib/schemas";

const STORAGE_KEY = "ul-submitter-info";

type StoredInfo = {
    minecraft_username: string;
    discord_username: string;
    additional_notes: string;
    difficulty: string;
};

type Props = {
    errors?: Record<string, string[]>;
};

export function SubmitterInfo({ errors }: Props) {
    const [remember, setRemember] = useState(false);
    const [info, setInfo] = useState<StoredInfo>({
        minecraft_username: "",
        discord_username: "@",
        additional_notes: "",
        difficulty: "",
    });

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as StoredInfo;
                setInfo({
                    ...parsed,
                    discord_username: parsed.discord_username
                        ? (parsed.discord_username.startsWith("@") ? parsed.discord_username : "@" + parsed.discord_username)
                        : "@",
                });
                setRemember(true);
            }
        } catch {
            // ignore
        }
    }, []);

    const handleChange = (field: keyof StoredInfo, value: string) => {
        const next = { ...info, [field]: value };
        setInfo(next);
        if (remember) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
    };

    const handleRememberToggle = (checked: boolean) => {
        setRemember(checked);
        if (checked) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Submitter Information
                </span>
                <div className="h-px flex-1 bg-gray-100" />
            </div>

            <p className="text-sm text-gray-500">
                The following information is completely optional. You may leave all fields blank if
                you wish to submit anonymously.
            </p>

            {/* Minecraft + Discord */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label
                        htmlFor="minecraft_username"
                        className="block text-xs font-medium text-gray-600"
                    >
                        Minecraft Username
                    </label>
                    <input
                        id="minecraft_username"
                        name="minecraft_username"
                        type="text"
                        maxLength={16}
                        placeholder="Steve"
                        value={info.minecraft_username}
                        onChange={(e) => handleChange("minecraft_username", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors hover:border-gray-400"
                    />
                </div>

                <div className="space-y-1.5">
                    <label
                        htmlFor="discord_username"
                        className="block text-xs font-medium text-gray-600"
                    >
                        Discord Username
                    </label>
                    <input
                        type="hidden"
                        name="discord_username"
                        value={info.discord_username.length > 1 ? info.discord_username : ""}
                    />
                    <input
                        id="discord_username"
                        type="text"
                        maxLength={37}
                        value={info.discord_username}
                        onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith("@")) val = "@";
                            handleChange("discord_username", val);
                        }}
                        onKeyDown={(e) => {
                            const ta = e.currentTarget;
                            if (
                                (e.key === "Backspace" || e.key === "Delete") &&
                                ta.selectionStart <= 1 &&
                                ta.selectionEnd <= 1
                            ) {
                                e.preventDefault();
                            }
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors hover:border-gray-400"
                    />
                </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
                <p className="text-xs font-medium text-gray-600">Difficulty</p>
                <div className="flex gap-4">
                    {DIFFICULTIES.map((d) => (
                        <label key={d} className="cursor-pointer flex-1">
                            <input
                                type="radio"
                                name="difficulty"
                                value={d}
                                checked={info.difficulty === d}
                                onChange={() => handleChange("difficulty", d)}
                                className="sr-only"
                            />
                            <span
                                className={`flex justify-center w-full px-2 py-1.5 rounded-lg text-xs font-medium border transition-all select-none cursor-pointer active:scale-95 ${
                                    info.difficulty === d
                                        ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                                        : "bg-white border-gray-300 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                                }`}
                            >
                                {d}
                            </span>
                        </label>
                    ))}
                </div>
                {info.difficulty && (
                    <button
                        type="button"
                        onClick={() => handleChange("difficulty", "")}
                        className="text-xs text-gray-400 hover:text-gray-600 active:scale-95 transition-all cursor-pointer"
                    >
                        Clear
                    </button>
                )}
                {errors?.difficulty?.map((e, i) => (
                    <p key={i} className="text-xs text-red-500">
                        {e}
                    </p>
                ))}
            </div>

            {/* Additional notes */}
            <div className="space-y-1.5">
                <label
                    htmlFor="additional_notes"
                    className="block text-xs font-medium text-gray-600"
                >
                    Additional Notes
                </label>
                <textarea
                    id="additional_notes"
                    name="additional_notes"
                    rows={2}
                    maxLength={500}
                    placeholder="Any context or source for this question…"
                    value={info.additional_notes}
                    onChange={(e) => handleChange("additional_notes", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none hover:border-gray-400"
                />
            </div>

            {/* Remember toggle */}
            <label className="flex items-center gap-3 cursor-pointer group select-none">
                <button
                    type="button"
                    role="switch"
                    aria-checked={remember}
                    onClick={() => handleRememberToggle(!remember)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer ${
                        remember ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                >
                    <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                            remember ? "translate-x-[19px]" : "translate-x-[2px]"
                        }`}
                    />
                </button>
                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    Remember my info for future submissions
                </span>
            </label>
        </div>
    );
}
