'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import useMount from '@/hooks/useMount'
// import { updateProfile } from "@/lib/actions";
// import { UserWithExtras } from "@/lib/definitions";
// import { UploadButton } from "@/lib/uploadthing";
import { UpdateUser } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { ChangeEvent, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import SubmitButton from './SubmitButton'
import { UserWithExtras } from '@/types/definitions'
import UserAvatar from '../navbar/UserAvatar'
import { Input } from '../ui/input'

import { Loader2, PictureInPicture } from 'lucide-react'
import { uploadToS3, uploadUserImageToS3 } from '@/lib/uploadToS3'
import Image from 'next/image'
// import UserAvatar from "./UserAvatar";
// import { Form } from "./ui/form";

function ProfileAvatar({
  user,
  children,
}: {
  user: UserWithExtras
  children: React.ReactNode
}) {
  const [imgFile, setImgFile] = useState<File | undefined>(undefined)
  const [displayUrl, setDisplayUrl] = useState('')
  const { data: session } = useSession()
  const isCurrentUser = session?.user.id === user.id

  function getImageData(event: ChangeEvent<HTMLInputElement>) {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer()

    // Add newly uploaded images
    Array.from(event.target.files!).forEach((image) =>
      dataTransfer.items.add(image)
    )

    const files = dataTransfer.files
    const displayUrl = URL.createObjectURL(event.target.files![0])
    setDisplayUrl(displayUrl)

    return { files, displayUrl }
  }

  const form = useForm<z.infer<typeof UpdateUser>>({
    resolver: zodResolver(UpdateUser),
    defaultValues: {
      id: user.id,
      image: user?.image[0]?.url || undefined,
      name: user.name || '',
      username: user.username || '',
    },
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const mount = useMount()

  if (!mount || !session) return null

  // @ts-ignore
  // return <UserAvatar user={user}  className="w-20 h-20 md:w-36 md:h-36" />
  if (!isCurrentUser)
    return (
      <UserAvatar
        user={user}
        imgUrl={user?.image[0]?.url}
        name={user?.name}
        className="w-20 h-20 md:w-36 md:h-36"
      />
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="dialogContent">
        <DialogHeader>
          <DialogTitle className="mx-auto font-medium text-xl py-5">
            تغییر پروفایل
          </DialogTitle>
        </DialogHeader>

        {isCurrentUser && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                if (imgFile) {
                  await uploadUserImageToS3(imgFile, user.id)
                }
                // const { message } = await updateProfile(values)
                // toast(message)
                // setOpen(false)
                // console.log(values)
                form.reset()
                window.location.reload()
              })}
            >
              {/* <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UploadButton
                        className="text-sm h-11 ut-button:bg-transparent border-y border-zinc-300 dark:border-neutral-700 ut-button:text-blue-500 ut-button:font-bold ut-allowed-content:hidden ut-button:ring-0 ut-button:focus-visible:ring-0 ut-button:ring-offset-0 ut-button:w-full"
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          form.setValue('image', res[0].url)

                          if (inputRef.current) {
                            inputRef.current.click()
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.error(error)
                          toast.error('Upload failed')
                        }}
                      />

                      <ImageUpload
                        value={field?.value?.map((image) => image.url)}
                        disabled={loading}
                        onChange={(url) =>
                          field.onChange([...field.value, { url }])
                        }
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ])
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
                  <>
                    <FormItem className="my-8 flex flex-col items-center justify-center ">
                      <FormLabel>
                        {!displayUrl ? (
                          <PictureInPicture size={50} />
                        ) : (
                          <Image
                            width={160}
                            height={160}
                            src={displayUrl}
                            className="aspect-square object-cover rounded-full"
                            alt="temporary"
                          />
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          // multiple={''}
                          className=" hidden "
                          type="file"
                          {...rest}
                          onChange={(event) => {
                            const { files, displayUrl } = getImageData(event)
                            // console.log(files[0])
                            onChange(files)
                            setImgFile(files[0])
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />

              {user.image && (
                <SubmitButton
                  className="text-red-500 border-b border-zinc-300 dark:border-neutral-300 font-bold disabled:cursor-not-allowed w-full text-sm p-3"
                  onClick={() => {
                    form.setValue('image', '')
                    if (inputRef.current) {
                      inputRef.current.click()
                    }
                  }}
                  disabled={form.formState.isSubmitting}
                >
                  اعمال تغییرات
                </SubmitButton>
              )}

              <input type="submit" hidden ref={inputRef} />
            </form>
          </Form>
        )}

        <DialogClose className="postOption border-0 w-full p-3 py-6">
          صرف نظر
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileAvatar
