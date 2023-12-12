import { prisma } from '@/lib/prisma'
import { unstable_noStore as noStore } from 'next/cache'

export async function fetchPosts() {
  // equivalent to doing fetch, cache: no-store
  noStore()

  try {
    const data = await prisma.post.findMany({
      include: {
        comments: {
          include: {
            user: true,
          },

          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
        fileUrl: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data
  } catch (error) {
    console.error('خطای دیتابیس', error)
    throw new Error('خطا در نمایش پستها')
  }
}
