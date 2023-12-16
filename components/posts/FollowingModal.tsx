'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import useMount from '@/hooks/useMount'

import { usePathname, useRouter } from 'next/navigation'
import Following from './Following'
import { FollowingWithExtras } from '@/types/definitions'
import { ScrollArea } from '@radix-ui/react-scroll-area'

function FollowingModal({
  following,
  userId,
}: {
  following: FollowingWithExtras[] | undefined
  userId: string
}) {
  const mount = useMount()
  const pathname = usePathname()
  const router = useRouter()
  const isFollowingPage = pathname === `/social/${userId}/following`

  if (!mount) return null

  return (
    <Dialog
      open={isFollowingPage}
      onOpenChange={(isOpen) => !isOpen && router.back()}
    >
      <DialogContent className="dialogContent">
        <DialogHeader className="border-b border-zinc-300 dark:border-neutral-700 py-2 w-full">
          <DialogTitle className="mx-auto font-bold text-base">
            فالوئینگ
          </DialogTitle>
        </DialogHeader>

        {following?.length === 0 && (
          <p className="p-6 text-xs text-center font-medium">
            این کاربر هنوز کسی را فالو نکرده است.
          </p>
        )}

        <ScrollArea className="min-h-fit max-h-[350px]">
          {following?.map((following) => (
            <Following key={following.followingId} following={following} />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default FollowingModal
