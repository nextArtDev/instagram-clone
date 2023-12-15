'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import useMount from '@/hooks/useMount'
import { FollowerWithExtras } from '@/types/definitions'

import { usePathname, useRouter } from 'next/navigation'
import { ScrollArea } from '../ui/scroll-area'
import Follower from './Follower'

function FollowersModal({
  followers,
  userId,
}: {
  followers: FollowerWithExtras[] | undefined
  userId: string
}) {
  const mount = useMount()
  const pathname = usePathname()
  const router = useRouter()
  const isFollowersPage = pathname === `/social/${userId}/followers`

  if (!mount) return null

  return (
    <Dialog
      open={isFollowersPage}
      onOpenChange={(isOpen) => !isOpen && router.back()}
    >
      <DialogContent className="dialogContent">
        <DialogHeader className="border-b border-zinc-300 dark:border-neutral-700 py-2 w-full">
          <DialogTitle className="mx-auto font-bold text-base">
            فالوئرها
          </DialogTitle>
        </DialogHeader>

        {followers?.length === 0 && (
          <p className="p-4 text-sm font-medium">
            این کاربر هنوز فالوئری ندارد
          </p>
        )}

        <ScrollArea className="min-h-fit max-h-[350px]">
          {followers?.map((follower) => (
            <Follower key={follower.followerId} follower={follower} />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default FollowersModal
