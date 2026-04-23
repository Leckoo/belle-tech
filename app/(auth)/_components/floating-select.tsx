import { ChevronDown, type LucideIcon } from "lucide-react";
import type { ReactNode, SelectHTMLAttributes } from "react";

type FloatingSelectOption = {
  label: string;
  value: string;
};

type FloatingSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "size"
> & {
  id: string;
  label: string;
  options: FloatingSelectOption[];
  placeholder: string;
  endSlot?: ReactNode;
  icon?: LucideIcon;
  selectClassName?: string;
  wrapperClassName?: string;
};

export function FloatingSelect({
  id,
  label,
  options,
  placeholder,
  endSlot,
  icon: Icon,
  selectClassName = "",
  wrapperClassName = "",
  ...props
}: FloatingSelectProps) {
  const hasValue =
    typeof props.value === "string"
      ? props.value.length > 0
      : typeof props.defaultValue === "string"
        ? props.defaultValue.length > 0
        : false;

  return (
    <label className="relative block">
      <div
        className={`relative flex min-h-[5rem] items-center rounded-[1.35rem] border border-[#d7c7c2] bg-[linear-gradient(180deg,#fffdfc_0%,#fff8f6_100%)] px-5 shadow-[0_14px_30px_var(--shadow-rose-light)] transition-all duration-300 focus-within:-translate-y-0.5 focus-within:border-[#8e4b63] focus-within:shadow-[0_18px_36px_rgba(142,75,99,0.16)] ${wrapperClassName}`}
      >
        <span className="pointer-events-none absolute left-4 top-0 z-10 -translate-y-1/2 bg-white px-2 text-[0.72rem] font-semibold tracking-[0.08em] text-[var(--color-text-rose-accent)]">
          {label}
        </span>
        <select
          id={id}
          className={`peer w-full cursor-pointer appearance-none border-none bg-transparent pb-1 pr-14 pt-5 text-base font-semibold outline-none ${hasValue ? "text-[var(--color-text-rose-accent)]" : "text-[var(--color-text-rose-soft)]"} ${selectClassName}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {endSlot ?? (
          <span className="pointer-events-none absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#ead6dd] bg-[linear-gradient(180deg,#ffffff_0%,#fff1ec_100%)] text-[#8f586b] shadow-[0_8px_18px_rgba(155,93,115,0.14)] transition duration-300 focus-within:scale-105">
            {Icon ? (
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            ) : (
              <ChevronDown aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            )}
          </span>
        )}
      </div>
    </label>
  );
}
