import SignIn from '@/components/auth/SignIn'
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
    // <div className="absolute inset-0">
    <div className="h-screen px-16 max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 ">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'self-start -mt-20 border border-white/30  '
        )}
      >
        صفحه اصلی
      </Link>

      <SignIn />
    </div>
    // </div>
  )
}

export default page
