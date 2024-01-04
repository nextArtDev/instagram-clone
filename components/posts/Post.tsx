import Image from 'next/image'
import Link from 'next/link'
// import Comments from './Comments'
// import Timestamp from './Timestamp'

// import PostOptions from './PostOptions'
// import PostActions from './PostActions'
import UserAvatar from '../navbar/UserAvatar'
import { Card } from '../ui/card'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { PostWithExtras } from '@/types/definitions'
import ImageSlider from '../ImageSlider'
import PostOptions from './PostOptions'
import PostActions from './PostActions'
import Comments from './Comments'
import { timestamp } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import { primaryFont } from '@/lib/fonts'

async function Post({ post }: { post: PostWithExtras }) {
  const user = await getCurrentUser()
  const userId = user?.id
  const username = post?.user?.name

  // console.log(post.user.image[0].url)

  if (!user) return null

  const imageUrls: string[] = []
  const validImageUrls = post.fileUrl.flatMap(({ url }) => [...imageUrls, url])

  return (
    <div className={cn('flex flex-col gap-y-2.5', primaryFont.className)}>
      <div className="flex items-center justify-between px-3 sm:px-0">
        <div className="flex gap-x-3 items-center">
          <Link href={`/social/${post.user.id}`}>
            {/* <UserAvatar user={post.user} /> */}
            <UserAvatar
              user={post.user}
              imgUrl={post?.user?.image[0]?.url}
              name={post.user.name}
            />
          </Link>
          <div className="text-sm">
            <div className="gap-x-1">
              <span className="font-semibold">{username}</span>
              <span
                dir="rtl"
                className="font-medium text-neutral-500 dark:text-neutral-400 text-xs px-1.5 "
              >
                • {timestamp(post.createdAt)}
              </span>
              {/* <Timestamp createdAt={post.createdAt} /> */}
            </div>
            <p className="text-xs text-black dark:text-white font-medium">
              {/* Dubai, United Arab Emirates */}
              {/* ادمین */}
              {post.user.role === 'USER' ? 'کاربر' : 'ادمین'}
            </p>
          </div>
        </div>

        <PostOptions post={post} userId={userId} />
      </div>
      {/* 465px should be h-[510px] until 640px */}
      <Card className="relative h-[450px] sm:h-[510px] w-full overflow-hidden rounded-sm sm:rounded-md">
        {/* <Image
          src={post.fileUrl}
          alt="Post Image"
          fill
          className="sm:rounded-md object-cover"
        /> */}
        <ImageSlider urls={validImageUrls} />
      </Card>
      <PostActions post={post} userId={userId} className="px-3 sm:px-0" />
      {post.caption && (
        <div className="text-sm leading-none flex items-center gap-x-2 font-medium px-3 sm:px-0">
          <Link href={`/social/${userId}`} className="font-bold">
            {username}
          </Link>
          <p>{post.caption}</p>
        </div>
      )}
      <Comments postId={post.id} comments={post.comments} user={user} />
    </div>
  )
}

export default Post
