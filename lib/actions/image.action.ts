'use server'

import axios from 'axios'

export async function uploadImage(params: { file: File; postId: string }) {
  const { file, postId } = params
  if (!params) return
  try {
    // @ts-ignore
    const fileType = encodeURIComponent(file.type)

    const { data } = await axios.get(
      `/api/s3-upload?fileType=${fileType}&productId=${postId}`
    )

    const { uploadUrl, key } = data

    const res = await axios.put(uploadUrl, file)
    const url = `https://mye-commerce.storage.iran.liara.space/${key}`

    console.log({ key, url })
    return { key, url }
  } catch (error) {
    console.log(error)

    throw error
  }
}
