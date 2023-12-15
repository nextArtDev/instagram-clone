'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '../getCurrentUser'
import { prisma } from '../prisma'
import { FollowUser, UpdateUser } from '../schemas'
import { z } from 'zod'

export async function followUser(formData: FormData) {
  //   const userId = await getUserId()
  const currentUser = await getCurrentUser()
  if (!currentUser) return
  const userId = currentUser.id

  const { id } = FollowUser.parse({
    id: formData.get('id'),
  })

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const follows = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        // followerId is of the person who wants to follow
        followerId: userId,
        // followingId is of the person who is being followed
        followingId: id,
      },
    },
  })

  if (follows) {
    try {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: id,
          },
        },
      })
      revalidatePath('/social')
      return { message: 'Unfollowed User.' }
    } catch (error) {
      return {
        message: 'Database Error: Failed to Unfollow User.',
      }
    }
  }

  try {
    await prisma.follows.create({
      data: {
        followerId: userId,
        followingId: id,
      },
    })
    revalidatePath('/social')
    return { message: 'Followed User.' }
  } catch (error) {
    return {
      message: 'Database Error: Failed to Follow User.',
    }
  }
}

export async function updateProfile(values: z.infer<typeof UpdateUser>) {
  const currentUser = await getCurrentUser()
  if (!currentUser) return
  const userId = currentUser.id

  const validatedFields = UpdateUser.safeParse(values)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Profile.',
    }
  }

  const { bio, gender, image, name, username, website } = validatedFields.data

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        name,
        bio,
        gender,
        website,
      },
    })
    // await prisma.image.updateMany({
    //   where: { userId },
    //   data: {
    //     url: image,
    //   },
    // })
    revalidatePath('/social')
    return { message: 'Updated Profile.' }
  } catch (error) {
    return { message: 'Database Error: Failed to Update Profile.' }
  }
}
