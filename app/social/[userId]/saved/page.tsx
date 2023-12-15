import PostsGrid from '@/components/posts/PostsGrid'
import { fetchSavedPostsByUserId } from '@/queries'

async function SavedPosts({
  params: { userId },
}: {
  params: { userId: string }
}) {
  const savedPosts = await fetchSavedPostsByUserId(userId)
  const posts = savedPosts?.map((savedPost) => savedPost.post)

  return <PostsGrid posts={posts} />
}

export default SavedPosts
