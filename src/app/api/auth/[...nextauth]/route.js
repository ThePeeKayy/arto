import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { addToken, createUser, getToken, getUserByEmail, updateToken, updateUserLastLogin } from '../../../../../utils/database';
import { connect } from 'getstream'

const api_key = process.env.STREAM_APP_ID
const api_secret = process.env.STREAM_API_SECRET
const app_id= process.env.STREAM_APP_ID

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  session:{
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60,
  },
  callbacks :{
    async session({ session }) {
        const sessionUser = await getUserByEmail(session.user.email); 
        if (sessionUser) {
          session.user.id = sessionUser.id
        }
        const token = await getToken(sessionUser.id)
        if (token) {
          session.token = token
        }
        return session;
    },
    async signIn({ profile }) {
        const existingUser = await getUserByEmail(profile.email);
        if (existingUser) {
          await updateUserLastLogin(existingUser.id, profile.picture);
          const serverClient = connect(api_key, api_secret, app_id);
          const token = serverClient.createUserToken(existingUser.id);
          await updateToken(existingUser.id,token)
        }
        if (!existingUser) {
          const user = await createUser(profile.email, null, profile.name, profile.picture);
          const serverClient = connect(api_key, api_secret, app_id);
          const token = serverClient.createUserToken(user.id);
          await addToken(user.id,token)
        }
        return true;
    } 
}
}); 

export { handler as GET, handler as POST};