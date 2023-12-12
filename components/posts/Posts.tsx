import Post from './Post'
import { fetchPosts } from '@/queries'

async function Posts() {
  const posts = await fetchPosts()

  return (
    <section className="w-full space-y-20 ">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  )
}

export default Posts
