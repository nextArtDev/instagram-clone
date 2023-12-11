// import { Icons } from '@/components/Icons'

import Link from 'next/link'
import { UserAuthForm } from './UserAuthForm'

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
        <h1 className="text-2xl font-semibold tracking-tight ">وارد شوید</h1>
        <p className="text-sm max-w-xs mx-auto"></p>
      </div>
      {/* its a server component and we can not have interactivity with that. */}
      <UserAuthForm />
      <p className="px-8 text-center text-sm    ">
        هنوز عضو نیستید؟{' '}
        <Link
          href="/sign-up"
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          عضویت
        </Link>
      </p>
    </div>
  )
}

export default SignIn
