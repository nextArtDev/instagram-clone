'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import FollowButton from './FollowButton'
import { FollowerWithExtras } from '@/types/definitions'
import UserAvatar from '../navbar/UserAvatar'

function Follower({ follower }: { follower: FollowerWithExtras }) {
  const { data: session } = useSession()
  const isFollowing = follower.follower.followedBy.some(
    (user) => user.followerId === session?.user.id
  )
  const isCurrentUser = session?.user.id === follower.followerId

  if (!session) return null

  return (
    <div className="p-4 flex items-center justify-between gap-x-3">
      <Link
        href={`/social/${follower.follower.id}`}
        className="flex items-center gap-x-3"
      >
        <UserAvatar
          user={follower.follower}
          imgUrl={follower.follower?.image[0]?.url}
          name={follower.follower.name}
          className="h-10 w-10"
        />
        <p className="font-bold text-sm">{follower.follower.name}</p>
      </Link>
      {!isCurrentUser && (
        <FollowButton
          profileId={follower.followerId}
          isFollowing={isFollowing}
          buttonClassName={
            isFollowing ? 'bg-neutral-700 dark:hover:bg-neutral-700/40' : ''
          }
        />
      )}
    </div>
  )
}

export default Follower
