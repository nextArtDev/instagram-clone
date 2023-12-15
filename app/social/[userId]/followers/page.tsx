import FollowersModal from '@/components/posts/FollowersModal'
import { fetchProfile } from '@/queries'

async function FollowersPage({
  params: { userId },
}: {
  params: {
    userId: string
  }
}) {
  const profile = await fetchProfile(userId)
  const followers = profile?.followedBy

  return <FollowersModal followers={followers} userId={userId} />
}

export default FollowersPage
