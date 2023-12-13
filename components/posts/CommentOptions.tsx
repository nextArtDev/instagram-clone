'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Comment } from '@prisma/client'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import SubmitButton from './SubmitButton'
import { deleteComment } from '@/lib/actions/post.action'

type Props = {
  comment: Comment
}

function CommentOptions({ comment }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <MoreHorizontal className="h-5 w-5 hidden group-hover:inline cursor-pointer dark:text-neutral-400" />
      </DialogTrigger>
      <DialogContent className="dialogContent">
        <form
          action={async (formData) => {
            const res = await deleteComment(formData)
            toast(res?.message)
          }}
          className="postOption"
        >
          <input type="hidden" name="id" value={comment.id} />
          <SubmitButton className="text-red-500 font-bold disabled:cursor-not-allowed w-full p-3">
            حذف
          </SubmitButton>
        </form>

        <DialogClose className="postOption border-0 w-full p-3">
          صرف‌نظر
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default CommentOptions
