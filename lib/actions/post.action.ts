'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '../getCurrentUser'
import { prisma } from '../prisma'
import { redirect } from 'next/navigation'
import axios from 'axios'
import {
  BookmarkSchema,
  CreateComment,
  DeleteComment,
  DeletePost,
  LikeSchema,
  UpdatePost,
} from '../schemas'
import { z } from 'zod'

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

export async function likePost(value: FormDataEntryValue | null) {
  // const userId = await getUserId()
  const user = await getCurrentUser()
  if (!user) return
  const userId = user.id

  const validatedFields = LikeSchema.safeParse({ postId: value })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'خطا، لایک ناموفق!',
    }
  }

  const { postId } = validatedFields.data

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    throw new Error('پست پیدا نشد!')
  }

  const like = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  })

  if (like) {
    try {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })
      revalidatePath('/social')
      return { message: 'لایک برداشته شد.' }
    } catch (error) {
      return { message: 'خطا در شبکه!' }
    }
  }

  try {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    })
    return { message: 'پست لایک شد.' }
  } catch (error) {
    return { message: 'خطای شبکه، لطفا دوباره امتحان کنید!' }
  } finally {
    revalidatePath('/social')
  }
}

export async function bookmarkPost(value: FormDataEntryValue | null) {
  // const userId = await getUserId()
  const user = await getCurrentUser()
  if (!user) return
  const userId = user.id

  const validatedFields = BookmarkSchema.safeParse({ postId: value })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'خطا! ذخیره ناموفق.',
    }
  }

  const { postId } = validatedFields.data

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    throw new Error('پست پیدا نشد!')
  }

  const bookmark = await prisma.savedPost.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  })

  if (bookmark) {
    try {
      await prisma.savedPost.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })
      revalidatePath('/social')
      return { message: 'از ذخیره خارج شد.' }
    } catch (error) {
      return {
        message: 'خطای شبکه! ناموفق در ذخیره پست.',
      }
    }
  }

  try {
    await prisma.savedPost.create({
      data: {
        postId,
        userId,
      },
    })
    revalidatePath('/social')
    return { message: 'پست ذخیره شد.' }
  } catch (error) {
    return {
      message: 'خطای شبکه! لطفا دوباره امتحان کنید.',
    }
  }
}

export async function createComment(values: z.infer<typeof CreateComment>) {
  // const userId = await getUserId()
  const user = await getCurrentUser()
  if (!user) return
  const userId = user.id

  const validatedFields = CreateComment.safeParse(values)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'ارسال کامنت ناموفق بود! دوباره امتحان کنید.',
    }
  }

  const { postId, body } = validatedFields.data

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    throw new Error('پست حذف شده است.')
  }

  try {
    await prisma.comment.create({
      data: {
        body,
        postId,
        userId,
      },
    })
    revalidatePath('/social')
    return { message: 'کامنت ارسال شد.' }
  } catch (error) {
    return { message: 'خطا در شبکه! لطفا بعدا امتحان کنید.' }
  }
}

export async function deleteComment(formData: FormData) {
  // const userId = await getUserId()
  const user = await getCurrentUser()
  if (!user) return
  const userId = user.id

  const { id } = DeleteComment.parse({
    id: formData.get('id'),
  })

  const comment = await prisma.comment.findUnique({
    where: {
      id,
      userId,
    },
  })

  if (!comment) {
    throw new Error('کامنت یافت نشد!')
  }

  try {
    await prisma.comment.delete({
      where: {
        id,
      },
    })
    revalidatePath('/social')
    return { message: 'کامنت حذف شد!' }
  } catch (error) {
    return { message: 'خطای شبکه! لطفا بعدا امتحان کنید.' }
  }
}

export async function updatePost(values: z.infer<typeof UpdatePost>) {
  // const userId = await getUserId()
  const user = await getCurrentUser()
  if (!user) return
  const userId = user.id

  const validatedFields = UpdatePost.safeParse(values)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'خطا در ویرایش پست!',
    }
  }

  // const { id, fileUrl, caption } = validatedFields.data
  const { id, caption } = validatedFields.data

  const post = await prisma.post.findUnique({
    where: {
      id,
      userId,
    },
  })

  if (!post) {
    throw new Error('پست حذف شده است.')
  }

  try {
    await prisma.post.update({
      where: {
        id,
      },
      data: {
        // fileUrl,
        caption,
      },
    })
  } catch (error) {
    return { message: 'خطا در شبکه! پست آپدیت نشد.' }
  }

  revalidatePath('/social')
  redirect('/social')
}
