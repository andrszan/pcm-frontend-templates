"use client";

import { type AriaAttributes, type Ref, useState } from "react";

import { format, isAfter, isBefore, isValid, startOfDay } from "date-fns";
import { CalendarDays } from "lucide-react";
import { type DateRange as CalendarRange, DayButton, type DayButtonProps } from "react-day-picker";
import { enUS, zhCN } from "react-day-picker/locale";

import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export interface DateRange {
  start?: Date;
  end?: Date;
}

export interface DateRangePickerProps extends Pick<AriaAttributes, "aria-invalid" | "aria-describedby"> {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  disabledBefore?: Date;
  disabledAfter?: Date;
  numberOfMonths?: 1 | 2;
  locale?: "zh-CN" | "en-US";
  label?: string;
  placeholder?: string;
  triggerClassName?: string;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  id?: string;
  onBlur?: () => void;
  ref?: Ref<HTMLButtonElement>;
}

const messages = {
  "zh-CN": {
    label: "日期范围",
    placeholder: "选择日期范围",
    clear: "清除",
    cancel: "取消",
    confirm: "确认",
    hint: "选择起止日期后确认；只选一天则按单日范围提交。",
    invalid: "请选择限制范围内的有效日期。",
  },
  "en-US": {
    label: "Date range",
    placeholder: "Select date range",
    clear: "Clear",
    cancel: "Cancel",
    confirm: "Apply",
    hint: "Select a start and end date, then apply. A single date applies as a one-day range.",
    invalid: "Select valid dates within the allowed range.",
  },
};

function hasValidDates(range: DateRange) {
  return (
    !!range.start &&
    isValid(range.start) &&
    (!range.end || (isValid(range.end) && !isBefore(startOfDay(range.end), startOfDay(range.start))))
  );
}

function formatRange(range: DateRange | undefined) {
  if (!range || !hasValidDates(range)) return "";
  const start = range.start && format(range.start, "yyyy-MM-dd");
  const end = range.end && format(range.end, "yyyy-MM-dd");
  return end && end !== start ? `${start} ~ ${end}` : start;
}

export function DateRangePicker({
  value,
  onChange,
  disabledBefore,
  disabledAfter,
  numberOfMonths = 2,
  locale = "zh-CN",
  label,
  placeholder,
  triggerClassName,
  disabled = false,
  align = "start",
  id,
  onBlur,
  ref,
  ...ariaProps
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  if (disabled && open) setOpen(false);
  const isMobile = useIsMobile();
  const text = messages[locale];
  const displayValue = formatRange(value);
  const accessibleLabel = label ?? text.label;
  const sessionKey = [
    open,
    value?.start?.getTime(),
    value?.end?.getTime(),
    disabledBefore?.getTime(),
    disabledAfter?.getTime(),
  ].join(":");

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="outline" />}
        ref={ref}
        id={id}
        type="button"
        disabled={disabled}
        onBlur={onBlur}
        aria-label={`${accessibleLabel}：${displayValue || placeholder || text.placeholder}`}
        className={cn(
          "max-w-full justify-start font-normal",
          !displayValue && "text-muted-foreground",
          triggerClassName,
        )}
        {...ariaProps}
      >
        <CalendarDays aria-hidden="true" />
        <span className="truncate">{displayValue || placeholder || text.placeholder}</span>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="max-h-(--available-height) w-auto max-w-[calc(100vw-1rem)] overflow-auto *:shrink-0 motion-reduce:animate-none"
      >
        <PopoverTitle>{accessibleLabel}</PopoverTitle>
        <RangeEditor
          key={sessionKey}
          value={value}
          onChange={onChange}
          disabledBefore={disabledBefore}
          disabledAfter={disabledAfter}
          numberOfMonths={isMobile ? 1 : numberOfMonths}
          locale={locale}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

function RangeDayButton({ className, modifiers, ...props }: DayButtonProps) {
  return (
    <DayButton
      {...props}
      modifiers={modifiers}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative z-10 size-(--cell-size) rounded-(--cell-radius) p-0 font-normal",
        modifiers.range_middle && "rounded-none bg-muted text-foreground",
        modifiers.selected &&
          !modifiers.range_middle &&
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        className,
      )}
    />
  );
}

function RangeEditor({
  value,
  onChange,
  disabledBefore,
  disabledAfter,
  numberOfMonths,
  locale,
  onClose,
}: Pick<DateRangePickerProps, "value" | "onChange" | "disabledBefore" | "disabledAfter"> & {
  numberOfMonths: 1 | 2;
  locale: "zh-CN" | "en-US";
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<DateRange>(value ?? {});
  const [month, setMonth] = useState(value?.start && isValid(value.start) ? value.start : new Date());
  const text = messages[locale];
  const before = disabledBefore && startOfDay(disabledBefore);
  const after = disabledAfter && startOfDay(disabledAfter);
  const empty = !draft.start && !draft.end;
  const valid =
    empty ||
    (hasValidDates(draft) &&
      !!draft.start &&
      (!before || !isBefore(startOfDay(draft.start), before)) &&
      (!after || !isAfter(startOfDay(draft.end ?? draft.start), after)));
  const selected: CalendarRange | undefined = hasValidDates(draft) ? { from: draft.start, to: draft.end } : undefined;

  function confirm() {
    if (!valid) return;
    const next = draft.start
      ? {
          start: startOfDay(draft.start),
          end: startOfDay(draft.end ?? draft.start),
        }
      : {};
    const startChanged = next.start?.getTime() !== (value?.start && startOfDay(value.start).getTime());
    const endChanged = next.end?.getTime() !== (value?.end && startOfDay(value.end).getTime());
    if (startChanged || endChanged) onChange(next);
    onClose();
  }

  return (
    <>
      <Calendar
        mode="range"
        components={{ DayButton: RangeDayButton }}
        month={month}
        onMonthChange={setMonth}
        selected={selected}
        onSelect={(range, day) => {
          setDraft(draft.start && !draft.end ? { start: range?.from, end: range?.to } : { start: day });
        }}
        disabled={[...(before ? [{ before }] : []), ...(after ? [{ after }] : [])]}
        numberOfMonths={numberOfMonths}
        locale={locale === "zh-CN" ? zhCN : enUS}
        className="p-0"
      />
      <p className="max-w-64 text-muted-foreground text-xs">{text.hint}</p>
      {!valid && (
        <p role="alert" className="text-destructive text-sm">
          {text.invalid}
        </p>
      )}
      <div className="sticky bottom-0 z-20 flex shrink-0 flex-wrap items-center justify-end gap-2 border-t bg-popover pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => setDraft({})}>
          {text.clear}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          {text.cancel}
        </Button>
        <Button type="button" size="sm" disabled={!valid} onClick={confirm}>
          {text.confirm}
        </Button>
      </div>
    </>
  );
}

export default DateRangePicker;
