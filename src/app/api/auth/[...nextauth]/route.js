import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const authOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.idToken = account.id_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.idToken = token.idToken;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl + "/";
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };