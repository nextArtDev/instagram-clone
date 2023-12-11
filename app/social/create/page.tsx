'use client'

import ImageSlider from '@/components/ImageSlider'
// import Error from "@/components/Error";
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useMount from '@/hooks/useMount'
import { uploadImage } from '@/lib/actions/image.action'
import { createPost } from '@/lib/actions/post.action'
// import { createPost } from "@/lib/actions";
import { CreatePost } from '@/lib/schemas'
import { uploadToS3 } from '@/lib/uploadToS3'
import { cn } from '@/lib/utils'
// import { UploadButton } from "@/lib/uploadthing";
import { zodResolver } from '@hookform/resolvers/zod'
import { FileUp } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function CreatePage() {
  const pathname = usePathname()
  const isCreatePage = pathname === '/social/create'
  const router = useRouter()
  const mount = useMount()
  const [files, setFiles] = useState<File[]>([])

  const form = useForm<z.infer<typeof CreatePost>>({
    resolver: zodResolver(CreatePost),
    defaultValues: {
      caption: '',
      fileUrls: undefined,
    },
  })
  // const fileUrls = form.watch('fileUrls')
  // const fileUrls = form.getFieldState('fileUrls')

  const validUrls = files
    .map((file) => URL.createObjectURL(file))
    .filter(Boolean) as string[]

  if (!mount) return null

  return (
    <div>
      <Dialog
        open={isCreatePage}
        onOpenChange={(open) => !open && router.back()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-right">ایجاد پست جدید</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                try {
                  const postCreationResult = await createPost({
                    caption: values.caption,
                  })
                  if (!postCreationResult) {
                    return toast.error('مشکلی پیش آمده')
                  }

                  for (const file of files) {
                    const res = await uploadToS3(file, postCreationResult.id)
                  }
                  toast.success('پست ایجاد شد')
                } catch (error) {
                  console.log(error)
                }
                // for (const file of files) {
                //   // console.log(file)
                //   const res = await uploadImage(file)
                //   console.log(res)
                // }
                // const res = await createPost(values);
                // if (res) {
                //   return toast.error(<Error res={res} />);
                // }
              })}
              className="space-y-4"
            >
              {files.length > 0 ? (
                <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                  <AspectRatio ratio={1 / 1} className="relative h-full">
                    {/* <Image
                      src={files}
                      alt="Post preview"
                      fill
                      className="rounded-md object-cover"
                    /> */}
                    <ImageSlider urls={validUrls} />
                  </AspectRatio>
                </div>
              ) : (
                // <FormField
                //   control={form.control}
                //   name="fileUrl"
                //   render={({ field, fieldState }) => (
                //     <FormItem>
                //       <FormLabel htmlFor="picture">تصویر</FormLabel>
                //       <FormControl>
                //         {/* <UploadButton
                //           endpoint="imageUploader"
                //           onClientUploadComplete={(res) => {
                //             form.setValue("fileUrl", res[0].url);
                //             toast.success("Upload complete");
                //           }}
                //           onUploadError={(error: Error) => {
                //             console.error(error);
                //             toast.error("Upload failed");
                //           }}
                //         /> */}
                //       </FormControl>
                //       <FormDescription>
                //         تصویر پست را آپلود کنید.
                //       </FormDescription>
                //       <FormMessage />
                //     </FormItem>
                //   )}
                // />
                <FormField
                  control={form.control}
                  name="fileUrls"
                  render={({ field: { onChange }, ...field }) => (
                    <FormItem>
                      <FormLabel className="mx-auto cursor-pointer bg-transparent rounded-xl flex flex-col justify-center gap-4 items-center border-2 border-black/20 border-dashed w-full h-24 shadow  ">
                        {/* <FileUp size={42} className=" " /> */}
                        <span
                          className={cn(buttonVariants({ variant: 'ghost' }))}
                        >
                          انتخاب عکس یا ویدئو
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          multiple={true}
                          disabled={form.formState.isSubmitting}
                          {...field}
                          onChange={async (event) => {
                            // Triggered when user uploaded a new file
                            // FileList is immutable, so we need to create a new one
                            const dataTransfer = new DataTransfer()

                            // Add old images
                            if (files) {
                              Array.from(files).forEach((image) =>
                                dataTransfer.items.add(image)
                              )
                            }

                            // Add newly uploaded images
                            Array.from(event.target.files!).forEach((image) =>
                              dataTransfer.items.add(image)
                            )

                            // Validate and update uploaded file
                            const newFiles = dataTransfer.files

                            setFiles(Array.from(newFiles))

                            onChange(newFiles)
                          }}
                        />
                      </FormControl>
                      <FormDescription className="flex justify-center items-center"></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {files.length > 0 && (
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="caption">کپشن</FormLabel>
                      <FormControl>
                        <Input
                          type="caption"
                          id="caption"
                          // placeholder="Write a caption..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button
                className=""
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                ایجاد پست
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreatePage
