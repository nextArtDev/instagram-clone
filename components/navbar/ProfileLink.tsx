'use client'

import { cn } from '@/lib/utils'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '../ui/button'
import UserAvatar from './UserAvatar'
import { SafeUser } from '@/types/next-auth'
import { UserWithAvatar } from '@/types/definitions'

interface ProfileLinkProps {
  user: UserWithAvatar
}

function ProfileLink({ user }: ProfileLinkProps) {
  const pathname = usePathname()
  // if (!user) return // I add

  const href = `/social/${user.id}`
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={buttonVariants({
        variant: isActive ? 'secondary' : 'ghost',
        className: 'md:navLink',
        size: 'lg',
      })}
    >
      <UserAvatar
        user={user}
        imgUrl={user.image[0]?.url}
        className={`h-6 w-6 ${isActive && 'border-2 border-white'}`}
      />

      <p
        className={`${cn('hidden lg:block', {
          'font-extrabold': isActive,
        })}`}
      >
        پروفایل
      </p>
    </Link>
  )
}

export default ProfileLink
