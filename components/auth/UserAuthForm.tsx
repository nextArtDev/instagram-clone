'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios from 'axios'
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
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  phone: z
    .string()
    .regex(new RegExp('^09\\d{9}$'), {
      message: 'شماره موبایل معتبر نیست.',
    })
    .regex(new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'), {
      message: 'شماره موبایل معتبر نیست.',
    }),
  password: z.string().min(8, {
    message: 'رمز عبور بیش از 7 کاراکتر است.',
  }),
})

export function UserAuthForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      //we pass each provider we used
      // const res = await axios.post('/api/register', JSON.stringify(data))
      // console.log('res', res.data)
      // if ((res.data.response.status = 409)) {
      //   router.push(`activation/${data.phone}`)
      // }
      const callback = await signIn('credentials', {
        // `${JSON.stringify(data)}`,
        ...data,
        redirect: false,
      })
      if (callback?.error === 'CredentialsSignin') {
        return toast({
          title: 'شماره یا رمز عبور اشتباه است.',
          variant: 'destructive',
        })
      }

      // console.log(callback?.ok)
      router.push('/')
      // form.reset()
    } catch (error: any) {
      // toast({
      //   title: 'شما هنوز ثبت نام نکرده‌اید',
      //   variant: 'destructive',
      // })
      console.log(error)
      if ((error.response.status = 409)) {
        router.push(`/sign-up`)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
                  //  placeholder="*********"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="">
          ورود
        </Button>
      </form>
    </Form>
  )
}
