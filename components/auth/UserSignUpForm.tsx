'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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
import { toast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'نام شما باید بیشتر از 2 کاراکتر باشد',
  }),
  phone: z
    .string()
    .regex(new RegExp('^09\\d{9}$'), {
      message: 'شماره موبایل معتبر نیست.',
    })
    .regex(new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'), {
      message: 'شماره موبایل معتبر نیست.',
    }),
  password: z.string().min(8, {
    message: 'برای رمز عبور حداقل 8 کاراکتر الزامیست.',
  }),
})

export function UserSignUpForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
    },
  })

  //react-query

  const { mutate: signUp, isPending: isLoading } = useMutation({
    mutationFn: async ({
      name,
      password,
      phone,
    }: z.infer<typeof FormSchema>) => {
      const payload: z.infer<typeof FormSchema> = { name, password, phone }
      const { data } = await axios.post('/api/user', payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 403) {
          // return loginToast()
          return toast({
            title: 'کاربر با این شماره موبایل وجود دارد.',
            variant: 'destructive',
          })
        }
      }

      return toast({
        title: 'مشکلی پیش آمده.',
        description: 'لطفا بعدا امتحان کنید.',
        variant: 'destructive',
      })
    },
    onSuccess: async (data) => {
      // turn pathname /r/mycommunity/submit into /r/mycommunity
      // const newPathname = pathname.split('/').slice(0, -1).join('/')
      // router.push(`${pathname}`)
      // console.log(dialogRef.current)
      // dialogRef?.current?.disabled = 'true'

      // router.refresh()
      // console.log(data)
      // console.log(data.phone)

      const { user } = data
      // console.log(user.phone)
      await axios.post(`/api/activation`, JSON.stringify(user))
      // console.log(data)
      router.push(`/activation/${user.phone}`)
      return toast({
        title: 'کد تایید بر روی شماره موبایل شما ارسال شد.',
        description: 'کد تایید را وارد کنید.',
        variant: 'default',
      })
    },
  })

  //form submition

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log(data)
    // axios.post('/api/user', JSON.stringify(data))
    // router.push('/sign-in')
    // try {
    //   const response = await axios.post(`/api/user`, JSON.stringify(data))
    //   console.log('response data', response.data.user)
    //   if (response.data.user) {
    //     await axios.post(`/api/activation`, JSON.stringify(data))
    //     router.push(`/activation/${data.phone}`)
    //   } else {
    //     console.log(response.data)
    //   }
    // } catch (error: any) {
    //   console.log(error.response.data.message)
    // }
    const payload: z.infer<typeof FormSchema> = {
      name: data.name,
      password: data.password,
      phone: data.phone,
    }
    signUp(payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                نام و نام خانوادگی <span className="text-red-400">*</span>{' '}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* <FormDescription className="text-white/50">
                نام و نام خانوادگی خود را وارد کنید.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                شماره موبایل<span className="text-red-400">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  // placeholder="09130000000"
                  {...field}
                  className="placeholder:text-gray-400"
                />
              </FormControl>
              <FormDescription className="text-white/50">
                {/* شماره شما نمایش داده نمی‌شود. */}
                <p className="text-rose-900">
                  کد تایید به این شماره ارسال خواهد شد.
                </p>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                رمز عبور<span className="text-red-400">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  // placeholder="********"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-white/50">
                از حروف بزرگ، کوچک و اعداد برای رمز عبور استفاده کنید.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="  ">
          ارسال کد تایید به شماره موبایل
        </Button>
      </form>
    </Form>
  )
}
