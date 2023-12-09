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
    // const ex = (request.query.fileType as string).split('/')[1]
    const productId = request.nextUrl.searchParams.get('productId')
    const fileType = request.nextUrl.searchParams.get('fileType')

    // const rawParams = request.url.split('?')[1]
    const ex = fileType!.split('/')[1]
    // console.log(ex)
    const Key = `${randomUUID()}.${ex}`
    // const Key = `${randomUUID()}`

    const s3Params = {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key,
      Expires: 60,
      ContentType: `image/${ex}`,
    }
    if (!fileType || !productId) return
    const uploadUrl = await s3.getSignedUrl('putObject', s3Params)

    // we should use this url to make a post request
    // console.log('uploadUrl', uploadUrl)
    if (!uploadUrl) return
    // console.log()
    const url = uploadUrl.split('?')[0]

    const image = await prisma.image.create({
      data: {
        key: Key,
        url,
        productId: +productId,
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
// export async function POST(request: NextRequest, response: NextResponse) {
//   try {
//     // const ex = (request.query.fileType as string).split('/')[1]

//     const rawParams = request.url.split('?')[1]

//     // console.log(rawParams)
//     const ex = rawParams.split('%2F')[1]
//     // const Key = `${randomUUID()}.${ex}`
//     // const Key = `${randomUUID()}`
//     const { file } = await request.json()
//     console.log('file', file)
//     const key = file.key
//     const s3Params = {
//       Bucket: process.env.LIARA_BUCKET_NAME,

//       Key: key,
//       // Expires: 60,
//       // ContentType: `image/${ex}`,
//     }

//     const uploadUrl = await s3.getSignedUrl('getObject', s3Params)

//     // we should use this url to make a post request
//     console.log('uploadUrl', uploadUrl)

//     return NextResponse.json({ success: true, uploadUrl })
//   } catch (error) {
//     console.error('Error uploading image:', error)
//     NextResponse.json({ message: 'Error uploading image' })
//   }
// }

export async function DELETE(request: NextRequest, response: NextResponse) {
  try {
    // const rawParams = request.url.split('?')[1]
    // const Key = rawParams.split('key=')[1]
    // // const Key = KeyUrl.split('.')[0]
    const id = await request.json()

    const product = await prisma.product.findUnique({
      where: {
        id: +id,
      },
      include: {
        images: true,
      },
    })

    const productImages = product?.images

    if (!productImages) return
    for (const productImage of productImages) {
      try {
        const { key } = productImage
        console.log(key)
        const s3Params = {
          Bucket: process.env.LIARA_BUCKET_NAME!,
          Key: key,
        }
        await s3.deleteObject(s3Params, (error, data) => {})

        await prisma.image.deleteMany({
          where: {
            productId: +id,
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
// import { NextRequest, NextResponse } from 'next/server'
// import { v4 as uuid } from 'uuid'
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
// import sharp from 'sharp'

// const s3Client = new S3Client({
//   //   region: process.env.REGION as string,
//   //   region: 'default',
//   credentials: {
//     accessKeyId: process.env.LIARA_ACCESS_KEY as string,
//     secretAccessKey: process.env.LIARA_SECRET_KEY as string,
//   },
// })

// async function uploadImageToS3(
//   file: Buffer,
//   fileName: string
// ): Promise<string> {
//   const resizedImageBuffer = await sharp(file)
//     .resize(400, 500) // Specify your desired width or height for resizing
//     .toBuffer()

//   const params = {
//     Bucket: process.env.LIARA_BUCKET_NAME as string,
//     Key: `${Date.now()}-${fileName}`,
//     Body: resizedImageBuffer,
//     ContentType: 'image/jpeg', // Change the content type accordingly
//   }

//   const command = new PutObjectCommand(params)
//   await s3Client.send(command)

//   return fileName
// }

// export async function POST(request: NextRequest, response: NextResponse) {
//   try {
//     const formData = await request.formData()
//     const file = formData.get('file') as Blob | null
//     if (!file) {
//       return NextResponse.json(
//         { error: 'File blob is required.' },
//         { status: 400 }
//       )
//     }

//     const mimeType = file.type
//     const fileExtension = mimeType.split('/')[1]

//     const buffer = Buffer.from(await file.arrayBuffer())
//     const fileName = await uploadImageToS3(buffer, uuid() + '.' + fileExtension)

//     return NextResponse.json({ success: true, fileName })
//   } catch (error) {
//     console.error('Error uploading image:', error)
//     NextResponse.json({ message: 'Error uploading image' })
//   }
// }

// import { APIRoute } from 'next-s3-upload'

// export default APIRoute.configure({

//   forcePathStyle: true,
//   apiVersion: '2006-03-01',
//   endpoint: process.env.LIARA_ENDPOINT,
//   accessKeyId: process.env.LIARA_ACCESS_KEY,
//   secretAccessKey: process.env.LIARA_SECRET_KEY,
//   region: process.env.REGION,
//   signatureVersion: 'v4',
// })
