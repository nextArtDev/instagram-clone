// import { auth } from "@/auth";
// import FollowButton from "@/components/FollowButton";
// import ProfileAvatar from "@/components/ProfileAvatar";
// import ProfileHeader from "@/components/ProfileHeader";
// import ProfileTabs from "@/components/ProfileTabs";
// import UserAvatar from "@/components/UserAvatar";
import UserAvatar from '@/components/navbar/UserAvatar'
import FollowButton from '@/components/posts/FollowButton'
import ProfileAvatar from '@/components/posts/ProfileAvatar'
import ProfileHeader from '@/components/posts/ProfileHeader'
import ProfileTabs from '@/components/posts/ProfileTabs'
import { Button, buttonVariants } from '@/components/ui/button'
import { primaryFont } from '@/lib/fonts'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { cn } from '@/lib/utils'
import { fetchProfile } from '@/queries'
// import { fetchProfile } from "@/lib/data";
import { MoreHorizontal, Settings } from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    userId: string
  }
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const userId = params.userId

  const profile = await fetchProfile(userId)

  return {
    title: `${profile?.name} (@${profile?.name})`,
  }
}

async function ProfileLayout({ children, params: { userId } }: Props) {
  const profile = await fetchProfile(userId)

  const currentUser = await getCurrentUser()
  // const session = await auth();
  const isCurrentUser = currentUser?.id === profile?.id
  if (!currentUser) return
  //   the followerId here is the id of the user who is following the profile
  const isFollowing = profile?.followedBy.some(
    (user) => user.followerId === currentUser.id
  )

  if (!profile) {
    notFound()
  }
  return (
    <>
      <ProfileHeader userId={profile.id} username={profile.name} />
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-x-5 md:gap-x-10 px-4">
          <ProfileAvatar user={profile}>
            <UserAvatar
              user={profile}
              imgUrl={profile?.image[0]?.url}
              name={profile.name}
              className="w-20 h-20 md:w-36 md:h-36 cursor-pointer"
            />
          </ProfileAvatar>

          <div className={cn(`md:px-10 space-y-4`, primaryFont.className)}>
            <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-3">
              <p className="font-semibold text-xl">{profile.name}</p>
              {isCurrentUser ? (
                <>
                  <Button
                    size={'icon'}
                    variant={'ghost'}
                    className="md:order-last"
                  >
                    <Settings />
                  </Button>
                  <Link
                    href={`/social/edit-profile`}
                    className={buttonVariants({
                      className: '!font-bold px-1',
                      variant: 'secondary',
                      size: 'sm',
                    })}
                  >
                    ویرایش پروفایل
                  </Link>
                  <Button
                    variant={'secondary'}
                    className="font-bold"
                    size={'sm'}
                  >
                    دیدن آرشیو
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size={'icon'}
                    variant={'ghost'}
                    className="md:order-last"
                  >
                    <MoreHorizontal />
                  </Button>
                  <FollowButton
                    isFollowing={isFollowing}
                    profileId={profile.id}
                  />
                  <Button
                    variant={'secondary'}
                    className="font-bold"
                    size={'sm'}
                  >
                    پیام
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-x-7">
              <p className="font-medium">
                <strong>{profile.posts.length} پست</strong>
              </p>

              <Link
                href={`/social/${profile.id}/followers`}
                className="font-medium"
              >
                <strong>{profile.followedBy.length}</strong> فالوئر
              </Link>

              <Link
                href={`/social/${profile.id}/following`}
                className="font-medium"
              >
                <strong>{profile.following.length}</strong> فالوئینگ
              </Link>
            </div>

            <div className="text-sm">
              <div className="font-bold">{profile.name}</div>
              <p>{profile.bio}</p>
            </div>
          </div>
        </div>

        <ProfileTabs profile={profile} isCurrentUser={isCurrentUser} />

        {children}
      </div>
    </>
  )
}

export default ProfileLayout
