import { ModeToggle } from '@/components/mode-toggle'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <ModeToggle />
    </div>
  )
}
