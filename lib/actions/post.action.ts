'use server'

import { getCurrentUser } from '../getCurrentUser'
import { prisma } from '../prisma'

interface CreatePostParams {
  caption?: string
}
export async function createPost(params: CreatePostParams) {
  const { caption } = params
  try {
    const user = await getCurrentUser()
    if (!user) return

    const userId = user.id

    const newPost = await prisma.post.create({
      data: {
        caption,
        userId,
      },
    })
    // console.log(newPost.id)
    return newPost
  } catch (error) {
    throw error
  }
}
