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

export async function fetchPostById(id: string) {
  noStore()

  try {
    const data = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        // fileUrl: { select: { url: true } },
        fileUrl: true,
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
    })

    return data
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch post')
  }
}

export async function fetchPostsByUserId(userId: string, postId?: string) {
  noStore()

  try {
    const data = await prisma.post.findMany({
      where: {
        userId,
        NOT: {
          id: postId,
        },
      },
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
    console.error('خطای شبکه!', error)
    throw new Error('Failed to fetch posts')
  }
}
