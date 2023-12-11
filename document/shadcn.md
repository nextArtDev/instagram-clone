## Partial Type

It combines all the avatar props with user, we add it by _{...avatarProps}_

```typescript
type Props = Partial<AvatarProps> & {
  user: User | undefined
}

function UserAvatar({ user, ...avatarProps }: Props) {
  return (
    <Avatar className="relative h-8 w-8" {...avatarProps}>
     //..
    </Avatar>
  )
}

```
