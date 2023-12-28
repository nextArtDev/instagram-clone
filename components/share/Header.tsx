import { Heart, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { GolpaBold, GramophoneStone, ShabnamBold } from '@/lib/fonts'
import { TooltipText } from './tooltip'

function Header() {
  return (
    <header className="fixed md:hidden bg-white top-0 flex items-center justify-evenly dark:bg-neutral-950 w-full z-50 border-b border-zinc-300 dark:border-neutral-700 px-3 py-2 sm:-ml-6">
      <Link href={'/social'}>
        {/* <p className={`font-semibold text-xl }${ShabnamBold.className}`}>
          پیکسلگرام
        </p> */}
      </Link>

      <div className="flex items-center gap-x-2">
        <div className="flex items-center text-neutral-600 dark:text-neutral-400 bg-zinc-100 dark:bg-neutral-800 gap-x-2 rounded-md px-3.5 py-1.5">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="جست‌وجو"
            className="bg-transparent placeholder:text-neutral-600 dark:placeholder:text-neutral-400 flex-1 outline-none"
          />
        </div>
        <TooltipText text="اعلانها">
          <Button size={'icon'} variant={'ghost'}>
            <Heart />
          </Button>
        </TooltipText>
      </div>
    </header>
  )
}

export default Header
