import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
// import useMount from '@/hooks/useMount'
import { Shabnam } from '@/lib/fonts'
import { type ReactNode } from 'react'
type TooltipProp = {
  children: ReactNode
  text: string
  asChild?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'center' | 'end' | 'start'
}
export function TooltipText({
  children,
  text,
  side,
  align,
  asChild,
}: TooltipProp) {
  // const mount = useMount()

  // if (!mount) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={(asChild = true)}>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={`${Shabnam.className}`}
        >
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
