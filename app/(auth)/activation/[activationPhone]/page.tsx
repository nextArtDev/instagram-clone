import SignIn from '@/components/auth/SignIn'
import { UserActivationForm } from '@/components/auth/UserActivationForm'

import { FC } from 'react'
interface pageProps {
  params: {
    activationPhone: string
  }
}

const page: FC<pageProps> = ({ params }) => {
  console.log(params)
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 ">
        <div className="container mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[400px]">
          <UserActivationForm phoneNumber={params.activationPhone} />
        </div>
      </div>
    </div>
  )
}

export default page
