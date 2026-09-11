import type { ComponentType, ReactNode } from "react"
import { useRef, useState } from "react"

import { CircleHelpIcon } from "lucide-react"

import { FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverDescription, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface LabelWithHelpProps {
  label: ReactNode
  helpText: ReactNode
  htmlFor?: string
  helpLabel?: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delay?: number
  closeDelay?: number
  className?: string
  labelClassName?: string
  triggerClassName?: string
  contentClassName?: string
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

export function LabelWithHelp({
  label,
  helpText,
  htmlFor,
  helpLabel = "查看字段说明",
  side = "top",
  align = "center",
  delay = 200,
  closeDelay = 100,
  className,
  labelClassName,
  triggerClassName,
  contentClassName,
  icon: Icon = CircleHelpIcon,
}: LabelWithHelpProps) {
  const [open, setOpen] = useState(false)
  // 触屏可能在 pointerup 后才触发 focus，指针标记需保留到 click。
  const pointerDownRef = useRef(false)

  return (
    <div className={cn("flex w-fit items-center gap-1", className)}>
      <FieldLabel htmlFor={htmlFor} className={labelClassName}>
        {label}
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          openOnHover
          delay={delay}
          closeDelay={closeDelay}
          aria-label={helpLabel}
          onPointerDown={() => {
            pointerDownRef.current = true
          }}
          onClick={() => {
            pointerDownRef.current = false
          }}
          onPointerCancel={() => {
            pointerDownRef.current = false
          }}
          onFocus={() => {
            if (!pointerDownRef.current) {
              setOpen(true)
            }
          }}
          className={cn(
            "inline-flex size-6 shrink-0 cursor-help items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
            triggerClassName,
          )}
        >
          <Icon aria-hidden className="size-3.5" />
        </PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          aria-label={helpLabel}
          initialFocus={false}
          finalFocus={false}
          className={cn("w-fit max-w-xs motion-reduce:animate-none", contentClassName)}
        >
          <PopoverDescription className="text-pretty text-popover-foreground text-xs leading-relaxed">
            {helpText}
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default LabelWithHelp
