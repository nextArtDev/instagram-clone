import { z } from 'zod'

const MAX_IMAGE_SIZE = 5242880 // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
]

export const PostSchema = z.object({
  id: z.string(),
  // fileUrls: z.string().url().array(),
  fileUrls: z
    .custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      'Only these types are allowed .jpg, .jpeg, .png and .webp'
    ),
  caption: z.string().optional(),
})

export const CreatePost = PostSchema.omit({ id: true })
export const UpdatePost = PostSchema
export const DeletePost = PostSchema.pick({ id: true })

export const LikeSchema = z.object({
  postId: z.string(),
})

export const BookmarkSchema = z.object({
  postId: z.string(),
})

export const CommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  postId: z.string(),
})

export const CreateComment = CommentSchema.omit({ id: true })
export const UpdateComment = CommentSchema
export const DeleteComment = CommentSchema.pick({ id: true })

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  name: z.string().optional(),
  image: z.string().optional(),
  bio: z.string().max(150).optional(),
  website: z.string().optional(),
  gender: z.string().optional(),
})

export const UpdateUser = UserSchema
export const DeleteUser = UserSchema.pick({ id: true })
export const FollowUser = UserSchema.pick({ id: true })
