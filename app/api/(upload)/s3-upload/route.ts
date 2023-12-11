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
    if (!uploadUrl || !postId) return

    const url = uploadUrl.split('?')[0]

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
    // const rawParams = request.url.split('?')[1]
    // const Key = rawParams.split('key=')[1]
    // // const Key = KeyUrl.split('.')[0]
    //**** */
    // const id = await request.json()
    // const product = await prisma.product.findUnique({
    //   where: {
    //     id: +id,
    //   },
    //   include: {
    //     images: true,
    //   },
    // })
    // const productImages = product?.images
    // if (!productImages) return
    // for (const productImage of productImages) {
    //   try {
    //     const { key } = productImage
    //     console.log(key)
    //     const s3Params = {
    //       Bucket: process.env.LIARA_BUCKET_NAME!,
    //       Key: key,
    //     }
    //     await s3.deleteObject(s3Params, (error, data) => {})
    //     await prisma.image.deleteMany({
    //       where: {
    //         productId: +id,
    //       },
    //     })
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error uploading image:', error)
    NextResponse.json({ message: 'Error uploading image' })
  }
}
