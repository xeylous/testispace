import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                phone: { label: "Phone", type: "text" },
                isPhoneLogin: { label: "Is Phone Login", type: "text" },
                idToken: { label: "ID Token", type: "text" },
                cfToken: { label: "Turnstile Token", type: "text" }
            },
            async authorize(credentials: Record<"email" | "password" | "phone" | "isPhoneLogin" | "idToken" | "cfToken", string> | undefined) {
                if (!credentials?.cfToken) {
                    throw new Error("Missing CAPTCHA token");
                }
                const isCaptchaValid = await verifyTurnstileToken(credentials.cfToken);
                if (!isCaptchaValid) {
                    throw new Error("Invalid CAPTCHA");
                }

                // HANDLE PHONE LOGIN
                if (credentials?.isPhoneLogin === "true") {
                    if (!credentials?.phone) throw new Error("Phone number required");

                    await connectDB();
                    const user = await User.findOne({ phone: credentials.phone });

                    if (!user) {
                        throw new Error("No account found with this phone number. Please sign up.");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role || 'user',
                        plan: user.plan || 'free'
                    };
                }

                // HANDLE EMAIL LOGIN
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role || 'user',
                    plan: user.plan || 'free'
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" || account?.provider === "github") {
                await connectDB();
                try {
                    const normalizedEmail = user.email?.toLowerCase();
                    let existingUser = await User.findOne({ email: normalizedEmail });
                    if (!existingUser) {
                        existingUser = await User.create({
                            name: user.name,
                            email: normalizedEmail,
                            image: user.image,
                            provider: account.provider,
                        });
                    }
                    // Store MongoDB _id on the user object for the jwt callback
                    user.id = existingUser._id.toString();
                    user.role = existingUser.role;
                    user.plan = existingUser.plan;
                    return true;
                } catch (error) {
                    console.error("Error checking if user exists: ", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.id = token.sub;
                session.user.role = token.role;
                session.user.plan = token.plan;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                // For OAuth, we need to ensure we have the latest role from DB
                // because the 'user' object might be the raw provider profile
                if (account?.provider === "google" || account?.provider === "github") {
                    await connectDB();
                    const dbUser = await User.findOne({ email: user.email });
                    if (dbUser) {
                        token.sub = dbUser._id.toString();
                        token.role = dbUser.role;
                        token.plan = dbUser.plan;
                    }
                } else {
                    // For credentials, 'user' is what we returned from authorize()
                    token.sub = user.id;
                    token.role = user.role;
                    token.plan = user.plan;
                }

                // Log Login (only on initial sign in)
                if (user) {
                    // Fire and forget logging to avoid slowing down auth
                    const logAction = account?.provider === 'credentials' ? 'LOGIN_CREDENTIALS' : `LOGIN_${account?.provider?.toUpperCase()}`;
                    import("@/lib/logger").then(({ logActivity }) => {
                        logActivity(logAction, user.id, { email: user.email });
                    });
                }
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
