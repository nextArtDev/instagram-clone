import FollowingModal from '@/components/posts/FollowingModal'
import { fetchProfile } from '@/queries'

async function FollowingPage({
  params: { userId },
}: {
  params: {
    userId: string
  }
}) {
  const profile = await fetchProfile(userId)
  const following = profile?.following

  return <FollowingModal following={following} userId={userId} />
}

export default FollowingPage
