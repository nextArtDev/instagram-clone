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
  try {
    const body = await req.json()
    const { phoneNumber, verificationCode } = body

    if (!phoneNumber || !verificationCode) {
      return NextResponse.json(
        {
          user: null,
          message: 'وارد کردن کد تایید الزامیست.',
        },
        { status: 409 }
      )
    }
    const user = await prisma.user.findUnique({
      where: {
        phone: phoneNumber,
      },
    })
    console.log('finding user', user)
    if (!user) {
      return NextResponse.json(
        {
          user: null,
          message: 'شما هنوز ثبت نام نکرده‌اید.',
        },
        { status: 400 }
      )
    }
    if (user.verificationCode !== verificationCode) {
      return NextResponse.json(
        {
          message: 'کد تایید اشتباه است.',
        },
        { status: 402 }
      )
    }
    if (!user.verificationDate) {
      return NextResponse.json(
        {
          message: 'کد ارسالی معتبر نیست.',
        },
        { status: 408 }
      )
    }
    const verificationDate = new Date(
      user.verificationDate.getTime() + 480 * 1000
    )
    if (verificationDate < new Date()) {
      user.verificationCode = null
      user.verificationDate = null
      return NextResponse.json(
        {
          message: 'کد تایید منقضی شده است.',
        },
        { status: 401 }
      )
    }

    await prisma.user.update({
      where: { phone: phoneNumber },
      data: {
        isVerified: true,
        verificationCode,
        verificationDate: new Date(),
      },
    })

    return NextResponse.json(
      {
        phoneNumber,
        message: 'کاربر با موفقیت ثبت نام شد.',
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'مشکلی پیش آمده. لطفا دوباره امتحان کنید.',
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
  } catch (error) {}
}
