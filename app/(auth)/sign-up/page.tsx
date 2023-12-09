import SignUp from '@/components/auth/SignUp'
import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

const page: FC = () => {
  return (
    // <div className="absolute inset-0 w-full h-screen bg-red-gradient overflow-hidden ">
    <div className="pt-8 h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 ">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'self-start -mt-10 border  text-blue-950 '
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
