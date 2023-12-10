import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Shabnam } from '@/lib/fonts'
import { type ReactNode } from 'react'
type TooltipProp = {
  children: ReactNode
  text: string
}
export function TooltipText({ children, text }: TooltipProp) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className={`${Shabnam.className}`}>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
