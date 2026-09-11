import { type ComponentProps, type ReactElement, useCallback, useRef, useState } from "react"

import { Loader2Icon, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type DeleteAlertDialogLocale = "zh-CN" | "en-US"

export interface DeleteAlertDialogProps {
  trigger: ReactElement
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
  subjectName?: string
  confirmText?: string
  cancelText?: string
  errorText?: string
  locale?: DeleteAlertDialogLocale
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const COPY = {
  "zh-CN": {
    title: "确认删除",
    description: (subjectName?: string) =>
      subjectName ? `确定要删除“${subjectName}”吗？此操作可能无法撤销。` : "确定要删除此项吗？此操作可能无法撤销。",
    cancel: "取消",
    confirm: "删除",
    error: "删除失败，请稍后重试。",
  },
  "en-US": {
    title: "Confirm deletion",
    description: (subjectName?: string) =>
      subjectName
        ? `Delete “${subjectName}”? This action may not be reversible.`
        : "Delete this item? This action may not be reversible.",
    cancel: "Cancel",
    confirm: "Delete",
    error: "Deletion failed. Please try again.",
  },
} satisfies Record<
  DeleteAlertDialogLocale,
  {
    title: string
    description: (subjectName?: string) => string
    cancel: string
    confirm: string
    error: string
  }
>

type AlertDialogChangeDetails = Parameters<NonNullable<ComponentProps<typeof AlertDialog>["onOpenChange"]>>[1]

export function DeleteAlertDialog({
  trigger,
  onConfirm,
  title,
  description,
  subjectName,
  confirmText,
  cancelText,
  errorText,
  locale = "zh-CN",
  disabled = false,
  open,
  onOpenChange,
}: DeleteAlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const submittingRef = useRef(false)
  const isControlled = open !== undefined
  const actualOpen = open ?? internalOpen
  const copy = COPY[locale]

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  const handleOpenChange = useCallback(
    (nextOpen: boolean, eventDetails: AlertDialogChangeDetails) => {
      if (submittingRef.current && !nextOpen) {
        eventDetails.cancel()
        return
      }
      if (nextOpen) {
        setHasError(false)
      }
      setOpen(nextOpen)
    },
    [setOpen],
  )

  const handleConfirm = useCallback(async () => {
    if (disabled || submittingRef.current) {
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    setHasError(false)

    try {
      await onConfirm()
      setOpen(false)
    } catch {
      setHasError(true)
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }, [disabled, onConfirm, setOpen])

  return (
    <AlertDialog open={actualOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={trigger} disabled={disabled} />
      <AlertDialogContent aria-busy={submitting} className="motion-reduce:animate-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2Icon aria-hidden="true" className="size-5 text-destructive" />
            {title ?? copy.title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description ?? copy.description(subjectName)}</AlertDialogDescription>
        </AlertDialogHeader>

        {hasError && (
          <p role="alert" className="text-destructive text-sm">
            {errorText ?? copy.error}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>{cancelText ?? copy.cancel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={disabled || submitting}
            onClick={() => void handleConfirm()}
          >
            {submitting && <Loader2Icon aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}
            {confirmText ?? copy.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAlertDialog
