// import { auth } from "@/auth";
// import Comment from "@/components/Comment";
// import CommentForm from "@/components/CommentForm";
// import Post from "@/components/Post";
// import PostActions from "@/components/PostActions";
// import PostOptions from "@/components/PostOptions";
// import UserAvatar from "@/components/UserAvatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { ScrollArea } from '@/components/ui/scroll-area'
// import { fetchPostById } from "@/lib/data";
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
// import { Card } from "./ui/card";
import MiniPost from './MiniPost'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { Card } from '../ui/card'
import UserAvatar from '../navbar/UserAvatar'
import PostOptions from './PostOptions'
import Comment from './Comment'
import PostActions from './PostActions'
import CommentForm from './CommentForm'
import Post from './Post'
import { fetchPostById } from '@/queries'
import ImageSlider from '../ImageSlider'

async function SinglePost({ id }: { id: string }) {
  const post = await fetchPostById(id)
  // const session = await auth();
  // const userId = session?.user.id;
  const currentUser = await getCurrentUser()
  const userId = currentUser?.id

  const postUsername = post?.user.name
  if (!post) {
    notFound()
  }

  const imageUrls: string[] = []
  const validImageUrls = post.fileUrl.flatMap(({ url }) => [...imageUrls, url])

  return (
    <>
      <Card className="max-w-3xl lg:max-w-4xl hidden md:flex mx-auto">
        <div className="relative overflow-hidden h-[450px] max-w-sm lg:max-w-lg w-full">
          {/* <Image
            src={post.fileUrl}
            alt="Post preview"
            fill
            className="md:rounded-l-md object-cover"
          /> */}
          <ImageSlider
            urls={validImageUrls}
            className="md:rounded-l-md md:rounded-r-none"
          />
        </div>

        <div className="flex max-w-sm flex-col flex-1">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link
                  className="font-semibold text-sm"
                  href={`/social/${postUsername}`}
                >
                  {postUsername}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center gap-x-2">
                  <UserAvatar
                    user={post.user}
                    imgUrl={post.user.image[0].url}
                    name={post.user.name}
                    className="h-14 w-14"
                  />
                  <div>
                    <p className="font-bold">{postUsername}</p>
                    <p className="py-2 text-sm font-medium dark:text-neutral-400">
                      {post.user.role === 'ADMIN' ? 'ادمین' : 'کاربر'}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <PostOptions post={post} userId={userId} />
          </div>

          {post.comments.length === 0 && (
            <div className="flex flex-col items-center gap-1.5 flex-1 justify-center">
              <p className="text-sm lg:text-base font-semibold">
                هنوز بدون کامنت.
              </p>
              <p className="text-sm font-medium">شروع گفت‌وگو</p>
            </div>
          )}

          {post.comments.length > 0 && (
            <ScrollArea className="hidden md:inline py-1.5 flex-1">
              <MiniPost post={post} />
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </ScrollArea>
          )}

          <div className="px-2 hidden md:block mt-auto border-y p-2.5">
            <PostActions post={post} userId={userId} />
            <time className="text-[11px] uppercase text-zinc-500 font-medium">
              {new Date(post.createdAt).toLocaleDateString('fa-IR', {
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <CommentForm postId={id} className="hidden md:inline-flex" />
        </div>
      </Card>
      <div className="md:hidden">
        <Post post={post} />
      </div>
    </>
  )
}

export default SinglePost
