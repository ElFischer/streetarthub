import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

import { Adapter } from "next-auth/adapters"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { cert } from "firebase-admin/app"

import env from "./env"

export const authOptions: NextAuthOptions = {
    adapter: FirestoreAdapter({
        credential: cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        }),
    }) as Adapter,
    providers: [
        GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        session: async ({ session, token, user }) => {
            if (session?.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
}