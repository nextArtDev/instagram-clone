import { getCurrentUser } from '@/lib/getCurrentUser'
import { prisma } from '@/lib/prisma'
import S3 from 'aws-sdk/clients/s3'
import { randomUUID } from 'crypto'

import { NextRequest, NextResponse } from 'next/server'

const s3 = new S3({
  apiVersion: '2006-03-01',
  endpoint: process.env.LIARA_ENDPOINT,
  accessKeyId: process.env.LIARA_ACCESS_KEY,
  secretAccessKey: process.env.LIARA_SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: 'v4',
})

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const postId = request.nextUrl.searchParams.get('postId')
    const userId = request.nextUrl.searchParams.get('userId')
    const fileType = request.nextUrl.searchParams.get('fileType')

    const ex = fileType!.split('/')[1]

    const Key = `${randomUUID()}.${ex}`

    const s3Params = {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key,
      Expires: 60,
      ContentType: `image/${ex}`,
    }
    if (!fileType) return
    const uploadUrl = await s3.getSignedUrl('putObject', s3Params)

    // we should use this url to make a post request
    // console.log('uploadUrl', uploadUrl)
    if (!uploadUrl) return
    if (!userId && !postId) return
    const url = uploadUrl.split('?')[0]

    if (!userId && postId) {
      const image = await prisma.image.create({
        data: {
          key: Key,
          url,
          postId,
        },
      })

      await prisma.post.update({
        where: { id: postId },
        data: {
          fileUrl: { connect: { id: image.id } },
        },
      })
    } else if (userId && !postId) {
      const image = await prisma.image.create({
        data: {
          key: Key,
          url,
          userId,
        },
      })
      const oldPic = await prisma.image.findFirst({
        where: { userId },
      })
      if (oldPic) {
        const s3Params = {
          Bucket: process.env.LIARA_BUCKET_NAME!,
          Key: oldPic.key,
        }
        await s3.deleteObject(s3Params, (error, data) => {
          console.log('deleted successfully')
        })
      }
      await prisma.$transaction(async (prisma) => {
        // First, disconnect all images
        await prisma.user.update({
          where: { id: userId },
          data: {
            image: {
              // Assuming there's a field that can be set to an empty array to disconnect all images
              set: [],
            },
          },
        })

        // Then, connect the new image
        await prisma.user.update({
          where: { id: userId },
          data: {
            image: {
              connect: { id: image.id },
            },
          },
        })
      })
    }

    return NextResponse.json({
      success: true,
      uploadUrl,
      key: Key,
      // imageId: image.id,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    NextResponse.json({ message: 'Error uploading image' })
  }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  try {
    const user = await getCurrentUser()
    if (!user) return
    // const rawParams = request.url.split('?')[1]
    // const Key = rawParams.split('key=')[1]
    // // const Key = KeyUrl.split('.')[0]
    //**** */
    const { id } = await request.json()

    const post = await prisma.post.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        fileUrl: true,
      },
    })

    const postImages = post?.fileUrl

    if (!postImages) return

    for (const postImage of postImages) {
      try {
        const { key } = postImage

        const s3Params = {
          Bucket: process.env.LIARA_BUCKET_NAME!,
          Key: key,
        }
        await s3.deleteObject(s3Params, (error, data) => {})
        const delREs = await prisma.image.deleteMany({
          where: {
            postId: id,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error uploading image:', error)
    NextResponse.json({ message: 'Error uploading image' })
  }
}
