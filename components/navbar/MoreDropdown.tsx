'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Activity,
  Bookmark,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

function MoreDropdown() {
  const [showModeToggle, setShowModeToggle] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Close the dropdown when the user clicks outside
    function handleOutsideClick(event: MouseEvent) {
      if (!event.target) return
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowModeToggle(false)
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [ref])

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={() => setOpen(!open)}
          variant={'ghost'}
          size={'lg'}
          className="md:w-full !justify-start gap-x-2 !px-3"
        >
          <Menu />
          <div className="hidden lg:block">بیشتر</div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        ref={ref}
        className={cn(
          'dark:bg-neutral-800 w-64 !rounded-xl !p-0 transition-opacity',
          !open && 'opacity-0'
        )}
        align="end"
        alignOffset={20}
      >
        {!showModeToggle && (
          <>
            <DropdownMenuItem className="menuItem">
              <p>تنظیمات</p>
              <Settings size={20} />
            </DropdownMenuItem>
            <DropdownMenuItem className="menuItem">
              <p>فعالیتها</p>
              <Activity size={20} />
            </DropdownMenuItem>
            <DropdownMenuItem className="menuItem">
              <p>ذخیره</p>
              <Bookmark size={20} />
            </DropdownMenuItem>

            <DropdownMenuItem
              className="menuItem"
              onClick={() => setShowModeToggle(true)}
            >
              <p>تغییر وضعیت</p>
              <Moon size={20} />
            </DropdownMenuItem>

            <DropdownMenuItem className="menuItem" onClick={() => signOut()}>
              <p>خروج</p>
              <LogOut size={20} />
            </DropdownMenuItem>
          </>
        )}

        {showModeToggle && (
          <>
            <div className="flex  items-center border-b border-gray-200 dark:border-neutral-700 py-3.5 px-2.5">
              {theme === 'dark' ? (
                <Moon size={20} className="mr-auto" />
              ) : (
                <Sun size={20} className="mr-auto" />
              )}
              <p className="font-bold mr-6">تغییر وضعیت</p>
              <ChevronRight
                size={18}
                onClick={() => setShowModeToggle(false)}
                className="cursor-pointer"
              />
            </div>

            <Label htmlFor="dark-mode" className="menuItem">
              <DropdownMenuItem className="mr-auto !p-0">
                <Switch
                  id="dark-mode"
                  className="mr-auto"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? 'dark' : 'light')
                  }}
                />
              </DropdownMenuItem>
              <span>{theme === 'dark' ? 'حالت روز' : 'حالت شب'}</span>
            </Label>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MoreDropdown
