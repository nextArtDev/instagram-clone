import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import * as bcrypt from 'bcrypt'
// import bcrypt from 'bcryptjs-react'
// Define Zod Schema for input validation

const userSchema = z.object({
  //z.string().regex("^09\\d{9}$")
  //^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$
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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { phone, password, name } = userSchema.parse(body)
    // console.log('phone', phone)
    // console.log('password', password)

    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone },
    })
    if (existingUserByPhone) {
      return NextResponse.json(
        {
          user: null,
          message: 'کاربر با این شماره تلفن وجود دارد.',
        },
        { status: 403 }
      )
    }
    // console.log('existingUserByPhone', existingUserByPhone)
    // } else if (existingUserByPhone && !existingUserByPhone.isVerified) {
    //   return NextResponse.json(
    //     {
    //       user: null,
    //       message: 'شما هنوز اکانت خود را از طریق اس‌ام‌اس فعال نکرده‌اید.',
    //     },
    //     { status: 401 }
    //   )
    // }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        phone,
        name,
        password: hashedPassword,
      },
    })
    const { password: userPassword, ...rest } = newUser
    // console.log('nwe user', newUser)
    return NextResponse.json(
      {
        user: rest,
        message: 'کاربر با موفقیت ثبت نام شد.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: 'مشکلی پیش آمده. لطفا دوباره امتحان کنید.',
      },
      { status: 500 }
    )
  }
}
