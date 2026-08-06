import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { QuestionForm } from "@/components/QuestionForm";
import { SignInCard } from "@/components/SignInCard";
import { FooterLinks } from "@/components/FooterLinks";

export default async function HomePage() {
    const session = await getServerSession(authOptions);
    const admin = isAdmin(session?.user?.email);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-3xl space-y-8">
                {/* Header */}
                <header className="flex flex-col items-center gap-4 text-center">
                    <Image
                        src="/logo.png"
                        alt="United Lands"
                        width={80}
                        height={80}
                        className="rounded-2xl"
                        priority
                    />
                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            United Lands – Question Submission
                        </h1>
                        <div className="text-sm text-gray-500 leading-relaxed space-y-1.5 max-w-xl mx-auto">
                            <p>
                                Submit{" "}
                                <strong>
                                    <u>United-Lands-specific</u>
                                </strong>{" "}
                                questions for the United Lands Chat Quiz Plugin.
                            </p>
                            <p>
                                Questions can be either multiple-choice or free-text. Please make
                                sure that your question has a clear and unambiguous answer. Please
                                note that submitting a question does not guarantee that it will be
                                accepted or included in the quiz.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main card */}
                <main className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 sm:p-8">
                    {session ? (
                        <QuestionForm
                            userName={session.user?.name}
                            userImage={session.user?.image}
                        />
                    ) : (
                        <SignInCard />
                    )}
                </main>

                <footer className="text-center">
                    <FooterLinks isAdmin={admin} />
                </footer>
            </div>
        </div>
    );
}
