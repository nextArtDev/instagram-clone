'use client'

import Link from 'next/link'
import PostOptions from './PostOptions'

import { useSession } from 'next-auth/react'

import { timestamp } from '@/lib/date-utils'
import UserAvatar from '../navbar/UserAvatar'
import { PostWithExtras } from '@/types/definitions'
// import Timestamp from "./Timestamp";

function MiniPost({ post }: { post: PostWithExtras }) {
  const username = post.user.name
  const href = `/social/${post.user.id}`

  const { data: session, status } = useSession()
  const user = session?.user

  if (!user) return null
  // console.log(post)
  return (
    <div dir="rtl" className="group  p-3 px-3.5  flex items-start gap-x-2.5">
      <Link href={href}>
        <UserAvatar
          user={post.user}
          imgUrl={post?.user?.image[0]?.url}
          name={post?.user?.name}
        />
      </Link>
      <div className="space-y-1.5">
        <div className="flex items-center space-x-1.5 leading-none text-sm">
          <Link href={href} className="font-semibold">
            {username}.
          </Link>
          <p className="font-medium px-1 ">{post.caption}</p>
        </div>
        <div className=" flex h-5 items-center gap-x-2.5 py-4 ">
          {/* <Timestamp createdAt={post.createdAt} /> */}
          <div className="text-xs font-thin opacity-70">
            {timestamp(post.createdAt)}
          </div>
          <PostOptions
            post={post}
            userId={user.id}
            className="hidden group-hover:inline"
          />
        </div>
      </div>
    </div>
  )
}

export default MiniPost
