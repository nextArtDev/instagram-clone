import SignUp from '@/components/auth/SignUp'
import { buttonVariants } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/getCurrentUser'

import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FC } from 'react'

const page: FC = async () => {
  const currentUser = await getCurrentUser()
  if (currentUser?.id) {
    redirect('/')
  }
  return (
    // <div className="absolute inset-0 w-full h-screen bg-red-gradient overflow-hidden ">
    <div className="pt-8 h-screen max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 ">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'self-start -mt-10 border '
        )}
      >
        صفحه اصلی
      </Link>

      <SignUp />
    </div>
    // </div>
  )
}

export default page
