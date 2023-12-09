# authOptions

```typescript
import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { compare } from 'bcrypt'
// import { compare, compareSync } from 'bcryptjs-react'
import bcrypt from 'bcrypt'
import { z } from 'zod'

const FormSchema = z.object({
  phone: z
    .string()
    .regex(new RegExp('^09\\d{9}$'), {
      message: 'شماره موبایل معتبر نیست.',
    })
    .regex(new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'), {
      message: 'شماره موبایل معتبر نیست.',
    }),
  password: z.string().min(8, {
    message: 'رمز عبور بیش از 7 کاراکتر است.',
  }),
})
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        // name: {
        //   label: 'موبایل',
        //   type: 'text',
        // },
        phone: {
          label: 'موبایل',
          type: 'text',
        },
        password: { label: 'رمز عبور', type: 'password' },
      },
      //this method returns null if user does not pass
      async authorize(credentials, req) {
        const { phone, password } = FormSchema.parse(credentials)

        if (!password || !credentials) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: {
            phone: phone,
          },
        })
        // console.log(user)
        if (!user) {
          return null
        }
        if (!user.isVerified) {
          return null
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          return null
        }
        // or return user
        return {
          id: `${user.id}`,
          phone: user.phone,
          name: user.name,
          isVerified: user.isVerified,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',

  //calls after some code runs
  callbacks: {
    // ****jwt gets trigger before the session
    // token:when ever the user tries to get the session, adding id to user, so we can access it on the front-end
    // async session({ session, token }) {
    //   //   session.user. .user.id = token.id
    //   //   session.user.name = token.name
    //   // session.user.phone = token.phone
    //   return session
    // },
    // when we append id to token by using session callback, we can append it to the user too
    // async jwt({ token, account, user }) {
    //   // return { ...token, ...user }
    //   // const dbUser = await prisma.user.findFirst({
    //   //   where: {
    //   //     phone: token.phone!,
    //   //   },
    //   if (account) {
    //     token.accessToken = account.access_token
    //     token.id = user.id
    //     // token.name = user.name
    //     // token.isVerified = user.isVerified
    //   }
    //   return token
    // },
    // new
    // // *** token passed from jwt to session
    // async jwt({ token, user, session, trigger }) {
    //   // for updating name:using: const {..., update} = useSession()
    //   //   <form> input... <button onClick={()=>update({name:newName})}> </form>
    //   if (trigger === 'update' && session?.name) {
    //     token.name = session.name
    //   }
    //   await prisma.user.update({
    //     where: { id: token.id },
    //     date: { name: token.name },
    //   })
    //   if (user) {
    //     return {
    //       ...token,
    //       phone: user.phone,
    //     }
    //   }
    //   return token
    // },
    // // ** session allows us to use jwt in our actual application
    // async session({ session, token, user }) {
    //   return {
    //     ...session,
    //     phone: token.phone,
    //   }
    // },
    // brand new
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      }
    },
    jwt: ({ token, user }) => {
      // user passed to it, only the first time user logs in
      // first jwt callback calls and pass through the token and session uses that token, so we have to return phone from the authorize function pass it through the jwt function and then use it in the session
      if (user) {
        return {
          ...token,
          id: user.id,
        }
      }
    },
  },

  //FOR ROLE BASED
  // {
  //   jwt({ token, user }) {
  //   if(user) token.role = user.role
  //   return token
  // },
  // session({ session, token }) {
  //   session.user.role = token.role
  //   return session
  // }
  // }
  // },

  //Here we can create our own sign-in or sign-up page:
  pages: {
    signIn: '/sign-in',
  },

  session: {
    strategy: 'jwt',
  },
}
export const getAuthSession = () => getServerSession(authOptions)

```