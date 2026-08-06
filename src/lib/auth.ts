import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { hashId } from "./hashId";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token }) {
            return token;
        },
        async session({ session, token }) {
            if (token.sub) {
                (session.user as { id?: string }).id = hashId(token.sub);
            }
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
};

export function isAdmin(email: string | null | undefined): boolean {
    if (!email) return false;
    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    return adminEmails.includes(email.toLowerCase());
}
