"use client";

type Props = {
    pending: boolean;
};

export function SubmitButton({ pending }: Props) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm"
        >
            {pending ? "Submitting…" : "Submit Question"}
        </button>
    );
}
