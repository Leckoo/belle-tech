import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";

type FloatingInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  id: string;
  label: string;
  endSlot?: ReactNode;
  icon?: LucideIcon;
  inputRef?: Ref<HTMLInputElement>;
  inputClassName?: string;
  wrapperClassName?: string;
};

export function FloatingInput({
  id,
  label,
  icon: Icon,
  endSlot,
  inputRef,
  inputClassName = "",
  wrapperClassName = "",
  ...props
}: FloatingInputProps) {
  return (
    <label className="relative block">
      <div
        className={`relative flex min-h-[5rem] items-center rounded-[1.35rem] border border-[#d7c7c2] bg-white px-5 shadow-[0_14px_30px_var(--shadow-rose-light)] transition-all duration-300 focus-within:border-[#8e4b63] focus-within:shadow-[0_18px_36px_rgba(142,75,99,0.16)] ${wrapperClassName}`}
      >
        <input
          id={id}
          ref={inputRef}
          placeholder=" "
          className={`peer w-full border-none bg-transparent pb-1 pr-14 pt-5 text-base font-semibold text-[var(--color-text-rose-accent)] outline-none placeholder:text-transparent ${inputClassName}`}
          {...props}
        />
        <span className="pointer-events-none absolute left-4 top-0 z-10 -translate-y-1/2 bg-white px-2 text-[0.72rem] font-semibold tracking-[0.08em] text-[var(--color-text-rose-accent)] transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-[var(--color-text-rose-soft)] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.72rem] peer-focus:font-semibold peer-focus:tracking-[0.08em] peer-focus:text-[var(--color-text-rose-accent)]">
          {label}
        </span>
        {endSlot ?? (
          Icon ? (
            <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            </span>
          ) : null
        )}
      </div>
    </label>
  );
}
