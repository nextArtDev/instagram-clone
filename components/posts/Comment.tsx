'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { CommentWithExtras } from '@/types/definitions'
import UserAvatar from '../navbar/UserAvatar'
import CommentOptions from './CommentOptions'
// import Timestamp from '../Timestamp'
import { timestamp } from '@/lib/date-utils'

type Props = {
  comment: CommentWithExtras
  inputRef?: React.RefObject<HTMLInputElement>
}

function Comment({ comment, inputRef }: Props) {
  const { data: session } = useSession()
  const username = comment.user.name
  const href = `/social/${username}`

  return (
    <div dir="rtl" className="group p-3 px-3.5  flex items-start gap-x-2.5">
      <Link href={href}>
        <UserAvatar user={comment.user} />
      </Link>
      <div className="space-y-1.5">
        <div className="flex  gap-x-1.5 leading-none text-sm">
          <Link href={href} className=" font-semibold">
            {username}
          </Link>
          <p className="font-medium">{comment.body}</p>
        </div>
        <div className="flex h-5 items-center space-x-2.5">
          {/* <Timestamp createdAt={comment.createdAt} /> */}
          <div className="opacity-70 text-xs">
            {timestamp(comment.createdAt)}
          </div>
          {/* <button
            className="text-xs font-semibold text-neutral-500"
            onClick={() => inputRef?.current?.focus()}
          >
            Reply
          </button> */}
          {comment.userId === session?.user.id && (
            <CommentOptions comment={comment} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Comment
