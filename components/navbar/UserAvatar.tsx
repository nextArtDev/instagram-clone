import { Avatar } from '@/components/ui/avatar'
import { UserWithAvatar, UserWithExtras } from '@/types/definitions'
import { Image } from '@prisma/client'
import type { AvatarProps } from '@radix-ui/react-avatar'
import type { User } from 'next-auth'
import NextImage from 'next/image'

type Props = Partial<AvatarProps> & {
  // user: (User & { image: Image }) | undefined
  user?: any
  imgUrl?: string
  name?: string
}

function UserAvatar({ user, imgUrl, name, ...avatarProps }: Props) {
  // console.log({ imgUrl, name })
  return (
    <Avatar className="relative h-8 w-8" {...avatarProps}>
      {/* {!imgUrl && (
        <NextImage
          src={user?.image?.url || '/defPic.jpg'}
          fill
          alt={`${user?.name}'s profile picture`}
          className="rounded-full object-cover"
        />
      )}
      {imgUrl && ( */}
      <NextImage
        src={imgUrl || '/defPic.jpg'}
        fill
        alt={`${name}'s profile picture`}
        className="rounded-full object-cover"
      />
      {/* )} */}
    </Avatar>
  )
}

export default UserAvatar
