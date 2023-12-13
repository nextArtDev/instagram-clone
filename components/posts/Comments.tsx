'use client'

import { CreateComment } from '@/lib/schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Comment } from '@prisma/client'
import { User } from 'next-auth'
import Link from 'next/link'
import { useOptimistic, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CommentWithExtras } from '@/types/definitions'
import { TooltipText } from '../share/tooltip'
import { createComment } from '@/lib/actions/post.action'

function Comments({
  postId,
  comments,
  user,
}: {
  postId: string
  comments: CommentWithExtras[]
  user?: User | null
}) {
  const form = useForm<z.infer<typeof CreateComment>>({
    resolver: zodResolver(CreateComment),
    defaultValues: {
      body: '',
      postId,
    },
  })
  let [isPending, startTransition] = useTransition()
  const [optimisticComments, addOptimisticComment] = useOptimistic<
    CommentWithExtras[]
  >(
    comments,
    // @ts-ignore
    (state: Comment[], newComment: string) => [
      { body: newComment, userId: user?.id, postId, user },
      ...state,
    ]
  )
  const body = form.watch('body')
  const commentsCount = optimisticComments.length

  return (
    <div className="space-y-1 px-3 sm:px-0 ">
      {commentsCount > 1 && (
        <Link
          scroll={false}
          href={`/dashboard/p/${postId}`}
          className="text-sm font-medium text-neutral-500"
        >
          مشاهده همه {commentsCount} کامنت
        </Link>
      )}

      {optimisticComments.slice(0, 3).map((comment, i) => {
        const username = comment.user?.name

        return (
          <div
            key={i}
            className="text-sm flex items-center gap-x-2  font-medium"
          >
            <Link
              href={`/social/${username}`}
              className="font-semibold opacity-60"
            >
              {username}:
            </Link>
            <p className=""> {comment.body} </p>
          </div>
        )
      })}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            // copy to immediately reset the form
            const valuesCopy = { ...values }
            form.reset()
            startTransition(() => {
              addOptimisticComment(valuesCopy.body)
            })

            await createComment(valuesCopy)
          })}
          className="border-b border-gray-300 dark:border-neutral-800 pb-3 py-1 flex items-center space-x-2"
        >
          <FormField
            control={form.control}
            name="body"
            render={({ field, fieldState }) => (
              <FormItem className="w-full flex">
                <FormControl>
                  <input
                    autoComplete="false"
                    type="text"
                    placeholder="کامنت بگذارید..."
                    className="bg-transparent text-sm border-none focus:outline-none flex-1 placeholder-neutral-500 dark:text-white dark:placeholder-neutral-400 font-medium"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {body.trim().length > 0 && (
            <TooltipText text="ارسال">
              <button
                type="submit"
                className="flex justify-center items-center text-sky-500 text-sm font-semibold hover:text-white disabled:hover:text-sky-500 disabled:cursor-not-allowed"
              >
                {/* پست */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-send-horizontal fill-sky-500 dark:stroke-white stroke-black/70 rotate-180"
                >
                  <path d="m3 3 3 9-3 9 19-9Z" />
                  <path d="M6 12h16" />
                </svg>
              </button>
            </TooltipText>
          )}
        </form>
      </Form>
    </div>
  )
}

export default Comments
