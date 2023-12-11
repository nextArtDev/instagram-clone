import { primaryFont } from '@/lib/fonts'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section
      className={`w-full min-h-screen flex flex-col ${primaryFont.className} `}
    >
      {children}
    </section>
  )
}
