'use client'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TooltipText } from '../share/tooltip'
import { links } from '@/constants'

function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon
        const isActive = pathname === link.href

        return (
          <TooltipText text={link.name} key={link.name}>
            <Link
              key={link.name}
              href={link.href}
              className={buttonVariants({
                variant: isActive ? 'secondary' : 'ghost',
                className: cn('navLink', {
                  'hidden md:flex': link.hideOnMobile,
                }),
                size: 'lg',
              })}
            >
              <LinkIcon className="w-6" />
              <p
                className={`${cn('hidden lg:block', {
                  'font-extrabold': isActive,
                })}`}
              >
                {link.name}
              </p>
            </Link>
          </TooltipText>
        )
      })}
    </>
  )
}

export default NavLinks
