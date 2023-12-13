import { Suspense } from 'react'
import { Separator } from '@/components/ui/separator'
import { SinglePostSkeleton } from '@/components/share/Skeletons'
import SinglePost from '@/components/posts/SinglePost'
import MorePosts from '@/components/posts/MorePosts'

function PostPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <Suspense fallback={<SinglePostSkeleton />}>
        <SinglePost id={id} />
      </Suspense>

      <Separator className="my-12 max-w-3xl lg:max-w-4xl mx-auto" />

      <Suspense>
        <MorePosts postId={id} />
      </Suspense>
    </div>
  )
}

export default PostPage
