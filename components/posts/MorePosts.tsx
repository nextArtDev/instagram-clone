// import { fetchPostById, fetchPostsByUsername } from "@/lib/data";
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PostsGrid from './PostsGrid'
import { fetchPostById, fetchPostsByUserId } from '@/queries'

async function MorePosts({ postId }: { postId: string }) {
  const post = await fetchPostById(postId)
  if (!post) return notFound()

  const postUserId = post?.user.id
  // const posts = await fetchPostsByUsername(postUsername!, postId);
  const posts = await fetchPostsByUserId(postUserId, postId)
  const postUsername = post?.user.name

  return (
    <div className="flex flex-col space-y-3 max-w-3xl lg:max-w-4xl mx-auto pb-20">
      <p className="font-semibold text-sm text-neutral-600 dark:text-neutral-400">
        پست‌های بیشتر{' '}
        <Link
          href={`/social/${postUserId}`}
          className="dark:text-white text-black hover:opacity-50"
        >
          {postUsername}
        </Link>{' '}
      </p>

      <PostsGrid posts={posts} />
    </div>
  )
}

export default MorePosts
