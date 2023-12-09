// import { Icons } from '@/components/Icons'

import { UserResetPasswordForm } from './UserResetPasswordForm'

const ForgetPassword = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <p className="text-sm max-w-xs mx-auto"></p>
      </div>
      {/* its a server component and we can not have interactivity with that. */}
      <UserResetPasswordForm />
    </div>
  )
}

export default ForgetPassword
