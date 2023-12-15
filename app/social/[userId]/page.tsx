import PostsGrid from '@/components/posts/PostsGrid'
import { fetchPostsByUserId } from '@/queries'

async function ProfilePage({
  params: { userId },
}: {
  params: { userId: string }
}) {
  const posts = await fetchPostsByUserId(userId)

  return <PostsGrid posts={posts} />
}

export default ProfilePage
