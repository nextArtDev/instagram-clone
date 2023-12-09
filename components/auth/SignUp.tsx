// import { Icons } from '@/components/Icons'

import Link from 'next/link'

import { UserSignUpForm } from './UserSignUpForm'

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
        <h1 className="text-2xl text-blue-950 font-semibold tracking-tight">
          عضو شوید
        </h1>
        {/* <p className="text-sm max-w-xs mx-auto"></p> */}
      </div>
      <UserSignUpForm />
      <p className="px-8 text-center text-sm text-blue-950 ">
        قبلا عضو شده‌اید؟{' '}
        <Link
          href="/sign-in"
          className=" hover:text-brand text-sm underline underline-offset-4"
        >
          ورود
        </Link>
      </p>
    </div>
  )
}

export default SignUp
