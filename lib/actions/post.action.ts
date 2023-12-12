'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '../getCurrentUser'
import { prisma } from '../prisma'
import { redirect } from 'next/navigation'
import axios from 'axios'
import { DeletePost } from '../schemas'

interface CreatePostParams {
  caption?: string
}
export async function createPost(params: CreatePostParams) {
  const { caption } = params

  const user = await getCurrentUser()
  if (!user) return

  const userId = user.id

  try {
    const newPost = await prisma.post.create({
      data: {
        caption,
        userId,
      },
    })

    revalidatePath('/social')
    return newPost
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(formData: FormData) {
  const currentUser = await getCurrentUser()

  // if (!currentUser || currentUser.role !== 'ADMIN') return
  if (!currentUser) return

  const { id } = DeletePost.parse({
    id: formData.get('id'),
  })
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
        userId: currentUser.id,
      },
    })

    if (!post) {
      throw new Error('پست پیدا نشد!')
    }

    await prisma.post.delete({
      where: { id },
    })

    // return uploadUrl
    revalidatePath('/social')
    return { message: 'پست با موفقیت حذف شد' }
  } catch (error) {
    console.log(error)
    return {
      message: 'مشکلی پیش آمده، لطفا دوباره امتحان کنید.',
    }
  }
}
