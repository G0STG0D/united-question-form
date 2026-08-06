"use client";

import { useState } from "react";

export function PrivacyNote() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors cursor-pointer"
            >
                Privacy
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div
                        className="relative bg-white rounded-2xl border border-gray-200 shadow-lg max-w-sm w-full p-6 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="font-semibold text-gray-900">Privacy</h2>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0 -mt-0.5"
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
                        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
                            <p>
                                Sign-in is required solely to prevent spam and vandalism. Your
                                Google account details are never stored.
                            </p>
                            <p>
                                When you submit, a one-way cryptographic hash of your account
                                identifier is saved. This hash cannot be reversed to identify you,
                                but allows moderators to block accounts that abuse the form.
                            </p>
                            <p>
                                No IP addresses, email addresses, names, or any other personal data
                                are collected or retained.
                            </p>
                            <p>
                                Submitter information (Minecraft username, Discord, notes) is
                                entirely optional and only stored if you choose to provide it.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
