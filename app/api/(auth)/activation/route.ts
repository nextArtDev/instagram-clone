import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import randomInteger from 'random-int'
import TrezSMSClient from 'trez-sms-client'
// Define Zod Schema for input validation

// const userSchema = z.object({
//   name: z.string().min(2, {
//     message: 'نام شما باید بیشتر از 2 کاراکتر باشد',
//   }),
//   //z.string().regex("^09\\d{9}$")
//   //^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$
//   phone: z.string().regex(new RegExp('^09\\d{9}$'), {
//     message: 'شماره موبایل معتبر نیست.',
//   }),
// })

export async function POST(req: NextRequest) {
  const verificationCode = randomInteger(100123, 999879)
  const client = new TrezSMSClient(
    process.env.SMS_USERNAME!,
    process.env.SMS_PASSWORD!
  )
  try {
    const body = await req.json()
    console.log(body)
    const { phone } = body

    // const existingUserByPhone = await prisma.user.findUnique({
    //   where: { phone },
    // })
    // if (existingUserByPhone) {
    //   return NextResponse.json(
    //     {
    //       user: null,
    //       message: 'کاربر با این شماره تلفن وجود دارد.',
    //     },
    //     { status: 409 }
    //   )
    // }
    const messageId = await client.manualSendCode(
      phone,
      ` \n کد تایید شما: ${
        verificationCode as number
      } \n مدت اعتبار این کد ۲ دقیقه می‌باشد`
    )

    console.log(messageId)
    if (messageId <= 2000) {
      return NextResponse.json(
        {
          message: 'ارسال کد تایید با خطا مواجه شد لطفا دوباره تلاش نمایید',
        },
        { status: 500 }
      )
    }
    const user = await prisma.user.findUnique({
      where: { phone },
    })
    if (!user) {
      return NextResponse.json(
        {
          message: 'شما هنوز ثبت نام نکرده‌اید.',
        },
        { status: 401 }
      )
    }
    // await prisma.user.findUnique({
    //   where: {
    //     phone,
    //   },
    // })

    await prisma.user.update({
      where: { phone },
      data: { verificationCode, verificationDate: new Date() },
    })
    console.log(verificationCode)
    return NextResponse.json(
      {
        phone,
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
// function getMessageStatus(verificationCode: number) {
//   throw new Error('Function not implemented.')
// }
