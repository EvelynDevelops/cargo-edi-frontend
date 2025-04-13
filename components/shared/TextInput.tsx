import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
  errorClassName?: string
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ 
    className,
    label,
    error,
    containerClassName,
    labelClassName,
    inputClassName,
    errorClassName,
    type = "text",
    ...props 
  }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1", containerClassName)}>
        {label && (
          <label className={cn("text-sm font-medium", labelClassName)}>
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            inputClassName
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className={cn("text-sm text-red-500", errorClassName)}>
            {error}
          </span>
        )}
      </div>
    )
  }
)
TextInput.displayName = "TextInput"

export { TextInput } 