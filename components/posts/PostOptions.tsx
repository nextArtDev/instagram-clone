'use client'

// import { deletePost } from "@/lib/actions";

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { PostWithExtras } from '@/types/definitions'
import SubmitButton from './SubmitButton'
import { deletePost } from '@/lib/actions/post.action'
import axios from 'axios'

type Props = {
  post: PostWithExtras
  userId?: string
  className?: string
}

function PostOptions({ post, userId, className }: Props) {
  const isPostMine = post.userId === userId

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MoreHorizontal
          className={cn(
            'h-5 w-5 cursor-pointer dark:text-neutral-400',
            className
          )}
        />
      </DialogTrigger>
      <DialogContent className="dialogContent">
        {isPostMine && (
          <form
            action={async (formData) => {
              await axios.delete('/api/s3-upload', {
                data: { id: post.id },
              })
              const del = await deletePost(formData)

              toast(del?.message)
              // console.log(formData.get('id'))
            }}
            className="postOption"
          >
            <input type="hidden" name="id" value={post.id} />
            <SubmitButton className="text-red-500 font-bold disabled:cursor-not-allowed w-full p-3">
              حذف پست
            </SubmitButton>
          </form>
        )}

        {isPostMine && (
          <Link
            scroll={false}
            href={`/social/p/${post.id}/edit`}
            className="postOption p-3"
          >
            ویرایش
          </Link>
        )}

        <form action="" className="postOption border-0">
          <button className="w-full p-3">مخفی کردن تعداد لایک</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PostOptions
