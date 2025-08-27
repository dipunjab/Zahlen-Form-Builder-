import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ]
                    });
                    if (!user) {
                        throw new Error("No user found with this email/username")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Incorrect Password")
                    }


                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : String(error));
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await dbConnect();
            if (account?.provider === "google") {
                const existingUser = await UserModel.findOne({ email: user.email });

                if (!existingUser) {
                    await UserModel.create({
                        email: user.email,
                        username: user.name,
                        avatarUrl: user.image,
                        provider: "google",
                        isVerified: true,
                    });
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                token._id = user._id?.toString()
                token.username = user.username;
                token.isVerified = user.isVerified;
            }
            if (account) {
                token.provider = account.provider;
            }
            return token;
        },

        async session({session, token}){
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.provider = token.provider;
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}


