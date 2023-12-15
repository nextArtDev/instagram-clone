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
            user: { include: { image: true } },
          },

          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: { include: { image: true } },
          },
        },
        savedBy: true,
        user: { include: { image: true } },
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
            user: { include: { image: true } },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        // fileUrl: { select: { url: true } },
        fileUrl: true,
        likes: {
          include: {
            user: { include: { image: true } },
          },
        },
        savedBy: true,
        user: { include: { image: true } },
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
            user: { include: { image: true } },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: { include: { image: true } },
          },
        },
        savedBy: true,
        user: { include: { image: true } },
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

export async function fetchProfile(userId: string) {
  noStore()

  try {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        saved: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        followedBy: {
          include: {
            follower: {
              include: {
                following: true,
                followedBy: true,
                image: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              include: {
                following: true,
                followedBy: true,
                image: true,
              },
            },
          },
        },
        image: true,
      },
    })

    return data
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch profile')
  }
}

export async function fetchSavedPostsByUserId(userId: string) {
  noStore()

  try {
    const data = await prisma.savedPost.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            fileUrl: true,
            comments: {
              include: {
                user: { include: { image: true } },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            likes: {
              include: {
                user: { include: { image: true } },
              },
            },
            savedBy: true,
            user: { include: { image: true } },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch saved posts')
  }
}

export async function fetchUserById(id: string, postId?: string) {
  noStore()
  try {
    // if (!id) return
    const data = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        image: true,
      },
    })

    return data
  } catch (error) {
    console.error('خطای شبکه!', error)
    throw new Error('Failed to fetch posts')
  }
}
