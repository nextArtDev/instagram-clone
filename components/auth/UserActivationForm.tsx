'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const ActivationFormSchema = z.object({
  code: z.string(),
})

interface pageProps {
  phoneNumber: string
}

export function UserActivationForm({ phoneNumber: phone }: pageProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof ActivationFormSchema>>({
    resolver: zodResolver(ActivationFormSchema),
    defaultValues: {
      code: '',
    },
  })

  //react-query

  const { mutate: activation, isLoading } = useMutation({
    mutationFn: async ({ code }: z.infer<typeof ActivationFormSchema>) => {
      const payload: z.infer<typeof ActivationFormSchema> = { code }
      // const { data } = await axios.post('/api/user', payload)
      const { data } = await axios.post(
        '/api/otp',
        JSON.stringify({
          verificationCode: Number(payload.code),
          phoneNumber: phone,
        })
      )
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'وارد کردن کد تایید الزامی است.',
            variant: 'destructive',
          })
        }
      }
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          return toast({
            title: 'هنوز ثبت نام نکرده‌اید.',
            variant: 'destructive',
          })
        }
      }
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: 'کد تایید منقضی شده است.',
            variant: 'destructive',
          })
        }
      }
      if (err instanceof AxiosError) {
        if (err.response?.status === 402) {
          return toast({
            title: 'کد ارسالی معتبر نیست.',
            variant: 'destructive',
          })
        }
      }

      // return toast({
      //   title: 'مشکلی پیش آمده.',
      //   description: 'لطفا بعدا امتحان کنید.',
      //   variant: 'destructive',
      // })
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
      router.push(`/`)
      return toast({
        title: 'اکانت شما با موفقیت فعال شد.',
        // description: 'لطفا بعدا امتحان کنید.',
        variant: 'default',
      })
      // const { user } = data
      // console.log(user.phone)
      // await axios.post(`/api/activation`, JSON.stringify(user))
      // console.log(data)
      // router.push(`/activation/${user.phone}`)
      // return toast({
      //   title: 'دیدگاه شما منتشر شد.',
      //   description: 'از شما ممنونیم که نظر خود را با ما در میان گذاشتید.',
      //   variant: 'default',
      // })
    },
  })
  async function onSubmit(data: z.infer<typeof ActivationFormSchema>) {
    const payload: z.infer<typeof ActivationFormSchema> = {
      code: data.code,
    }
    activation(payload)
    // try {
    //   console.log('form data', data.code)
    // const res = await axios.post(
    //   `/api/activation`,
    //   JSON.stringify({ ...data, phone })
    // )
    // axios.post('/api/user', JSON.stringify(data))
    // router.push('/sign-in')

    // const response = await axios.post(
    //   '/api/otp',
    //   JSON.stringify({
    //     verificationCode: Number(data.code),
    //     phoneNumber: phone,
    //   })
    // )
    // console.log(response)

    // console.log('form data, code', typeof data.code)
    // console.log('form data, phone ', Number(phone))
    // router.push(`/`)

    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })

    //   axios.post('/api/login', JSON.stringify(data))
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
    // } catch (error) {
    //   toast({
    //     title: 'شما هنوز ثبت نام نکرده‌اید',
    //     variant: 'destructive',
    //   })
    //   console.log(error)
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>کد فعالسازی </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="_ _ _ _"
                  {...field}
                  className=" text-lg sm:text-xl font-bold tracking-[0.5rem] md:tracking-[0.75rem] text-center w-48 placeholder:text-gray-400"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-950 hover:bg-gray-gradient hover:text-blue-950 "
        >
          تایید{' '}
        </Button>
      </form>
    </Form>
  )
}
