import type {
  Comment,
  Follows,
  Image,
  Like,
  Post,
  SavedPost,
  User,
} from '@prisma/client'

export type CommentWithExtras = Comment & { user: UserWithAvatar }
export type LikeWithExtras = Like & { user: UserWithAvatar }

export type PostWithExtras = Post & {
  comments: CommentWithExtras[]
  likes: LikeWithExtras[]
  savedBy: SavedPost[]
  fileUrl: Image[]
  user: UserWithAvatar
}

export type UserWithFollows = UserWithAvatar & {
  following: Follows[]
  followedBy: Follows[]
}

export type FollowerWithExtras = Follows & { follower: UserWithFollows }
export type FollowingWithExtras = Follows & { following: UserWithFollows }

export type UserWithExtras = User & {
  posts: Post[]
  saved: SavedPost[]
  followedBy: FollowerWithExtras[]
  following: FollowingWithExtras[]
  image: Image[]
}
export type UserWithAvatar = User & {
  image: Image[]
}
