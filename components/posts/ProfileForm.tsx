'use client'

import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
// import { updateProfile } from "@/lib/actions";
// import { UserWithExtras } from "@/lib/definitions";
import { UserSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import ProfileAvatar from './ProfileAvatar'
import { UserWithExtras } from '@/types/definitions'
import UserAvatar from '../navbar/UserAvatar'
import { updateProfile } from '@/lib/actions/user.action'
// import UserAvatar from "./UserAvatar";

function ProfileForm({ profile }: { profile: UserWithExtras }) {
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      id: profile.id,
      image: profile.image[0].url || '',
      name: profile.name || '',
      username: profile.username || '',
      bio: profile.bio || '',
      gender: profile.gender || '',
      website: profile.website || '',
    },
  })

  const { isDirty, isSubmitting, isValid } = form.formState

  return (
    <div className="space-y-8 py-10 lg:py-10 max-w-xl">
      <div className="flex items-center gap-x-2  ">
        <ProfileAvatar user={profile}>
          <div className="md:w-20 flex md:justify-end">
            <UserAvatar
              imgUrl={profile?.image[0]?.url}
              name={profile.name}
              user={profile}
              className="w-11 h-11 cursor-pointer"
            />
          </div>
        </ProfileAvatar>
        <div>
          <p className="font-medium">{profile.name}</p>
          <ProfileAvatar user={profile}>
            <p className="text-blue-500 text-sm font-bold cursor-pointer dark:hover:text-white">
              تغییر آواتار
            </p>
          </ProfileAvatar>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            const message = await updateProfile(values)
            toast(message?.message)
          })}
          className="space-y-8"
        >
          <FormField
            disabled
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                  <FormLabel className="font-bold w-20 md:text-right">
                    وبسایت
                  </FormLabel>
                  <FormControl aria-disabled>
                    <Input placeholder="Website" disabled {...field} />
                  </FormControl>
                </div>
                {/* <FormDescription className="md:ml-24 text-xs">
                  Editing your links is only available on mobile. Visit the
                  Instagram app and edit your profile to change the websites in
                  your bio.
                </FormDescription> */}
                <FormMessage className="md:ml-24" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                  <FormLabel className="font-bold w-20 md:text-right">
                    بیوگرافی
                  </FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                </div>
                <FormDescription className="md:ml-24 text-xs">
                  {field.value?.length} / 150
                </FormDescription>
                <FormMessage className="md:ml-24" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                  <FormLabel className="font-bold w-20 md:text-right">
                    جنسیت
                  </FormLabel>
                  <Select
                    dir="rtl"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="نمی‌گویم" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="female">زن</SelectItem>
                      <SelectItem value="male">مرد</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        نمی‌گویم
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormDescription className="md:ml-24 text-xs">
                  این قسمت در صفحه شما درج نمی‌شود.
                </FormDescription>
                <FormMessage className="md:ml-24" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="md:ml-24"
            disabled={!isDirty || !isValid || isSubmitting}
          >
            تایید
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ProfileForm
