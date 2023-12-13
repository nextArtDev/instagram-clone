'use client'
// import EmojiPicker from 'emoji-picker-react'
import { CreateComment } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createComment } from '@/lib/actions/post.action'

function CommentForm({
  postId,
  className,
  inputRef,
}: {
  postId: string
  className?: string
  inputRef?: React.Ref<HTMLInputElement>
}) {
  const form = useForm<z.infer<typeof CreateComment>>({
    resolver: zodResolver(CreateComment),
    defaultValues: {
      body: '',
      postId,
    },
  })

  const body = form.watch('body')
  const isSubmitting = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await createComment(values)
          form.reset()
        })}
        className={cn(
          'border-b relative border-gray-200 dark:border-neutral-800 py-3 flex items-center space-x-2 w-full px-3',
          className
        )}
      >
        {isSubmitting && (
          <div className="flex justify-center items-center w-full absolute">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => {
            return (
              <FormItem className="w-full flex">
                <FormControl>
                  <>
                    <input
                      disabled={isSubmitting}
                      type="text"
                      placeholder="کامنت بگذارید"
                      className="bg-transparent text-sm border-none focus:outline-none flex-1 dark:text-neutral-400 placeholder-neutral-400 font-medium disabled:opacity-30"
                      {...field}
                    />
                    {/* <EmojiPicker /> */}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <button
          disabled={!body.trim().length || isSubmitting}
          type="submit"
          className="text-sky-500 text-sm font-semibold hover:text-sky-700 dark:hover:text-white disabled:cursor-not-allowed  dark:disabled:text-slate-500 disabled:text-sky-500/40 disabled:hover:text-sky-500/40 dark:disabled:hover:text-slate-500"
        >
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
      </form>
    </Form>
  )
}

export default CommentForm
