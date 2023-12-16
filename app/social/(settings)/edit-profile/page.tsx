import ProfileForm from '@/components/posts/ProfileForm'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { fetchProfile } from '@/queries'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'ویرایش پروفایل',
  description: 'Edit profile',
}

async function EditProfile() {
  // const session = await auth();
  const currentUser = await getCurrentUser()
  if (!currentUser) return
  const userId = currentUser?.id
  const profile = await fetchProfile(userId)

  if (!profile) {
    notFound()
  }

  return (
    <div className="px-4 sm:px-8 md:px-16 xl:px-20 ">
      <h1 className="text-base sm:text-2xl font-medium">ویرایش پروفایل</h1>

      <ProfileForm profile={profile} />
    </div>
  )
}

export default EditProfile
