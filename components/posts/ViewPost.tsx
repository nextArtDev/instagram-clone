import { cn } from '@/lib/utils'
import { View } from 'lucide-react'
import { TooltipText } from '../share/tooltip'

function ViewPost({ className }: { className?: string }) {
  return (
    <div className={cn('flex p-3', className)}>
      <button
        onClick={() => window.location.reload()}
        className="flex gap-0.5 items-center text-sky-500 hover:text-sky-700 font-semibold text-sm"
      >
        <TooltipText text="مشاهده پست">
          <View />
        </TooltipText>
      </button>
    </div>
  )
}

export default ViewPost
