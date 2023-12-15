import { useSession } from 'next-auth/react'
import Link from 'next/link'
import FollowButton from './FollowButton'
import { FollowingWithExtras } from '@/types/definitions'
import UserAvatar from '../navbar/UserAvatar'

function Following({ following }: { following: FollowingWithExtras }) {
  const { data: session } = useSession()
  const isFollowing = following.following.followedBy.some(
    (user) => user.followerId === session?.user.id
  )
  // console.log(following)
  const isCurrentUser = session?.user.id === following.followingId

  if (!session) return null

  return (
    <div className="p-4 flex items-center justify-between gap-x-3">
      <Link
        href={`/social/${following.following.username}`}
        className="flex items-center gap-x-3"
      >
        <UserAvatar
          user={following.following}
          imgUrl={following.following?.image[0]?.url}
          className="h-10 w-10"
        />
        <p className="font-bold text-sm">{following.following.username}</p>
      </Link>
      {!isCurrentUser && (
        <FollowButton
          profileId={following.followingId}
          isFollowing={isFollowing}
          buttonClassName={
            isFollowing ? 'bg-neutral-700 dark:hover:bg-neutral-700/40' : ''
          }
        />
      )}
    </div>
  )
}

export default Following
