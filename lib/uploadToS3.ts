import axios from 'axios'
import { ChangeEvent } from 'react'

// export async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
export async function uploadToS3(file: File, postId: string) {
  // const formData = new FormData(e.target)

  // //getting data by the name of that in the form
  // const file = formData.get('file')

  if (!file) {
    return null
  }

  // @ts-ignore
  const fileType = encodeURIComponent(file.type)
  //we want filetype to attach our extension to our content type, because for put request we need to map signature to assigned url

  //Getting a presigned url
  const { data } = await axios.get(
    `/api/s3-upload?fileType=${fileType}&postId=${postId}`
  )
  const { uploadUrl, key } = data

  const res = await axios.put(uploadUrl, file)
  const url = `https://mye-commerce.storage.iran.liara.space/${key}`

  return { key, url }
}
// export async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
export async function uploadUserImageToS3(file: File, userId: string) {
  // const formData = new FormData(e.target)

  // //getting data by the name of that in the form
  // const file = formData.get('file')

  if (!file) {
    return null
  }

  // @ts-ignore
  const fileType = encodeURIComponent(file.type)
  //we want filetype to attach our extension to our content type, because for put request we need to map signature to assigned url

  //Getting a presigned url
  const { data } = await axios.get(
    `/api/s3-upload?fileType=${fileType}&userId=${userId}`
  )
  const { uploadUrl, key } = data

  const res = await axios.put(uploadUrl, file)
  const url = `https://mye-commerce.storage.iran.liara.space/${key}`

  return { key, url }
}
