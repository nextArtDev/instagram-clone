import ForgetPassword from '@/components/auth/ForgetPassword'
import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

const page: FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 ">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'self-start -mt-20 border border-white/30 text-blue-950'
          )}
        >
          {/* <ChevronRight className="mr-2 h-6 w-6 " /> */}
          صفحه اصلی
        </Link>

        <ForgetPassword />
      </div>
    </div>
  )
}

export default page
