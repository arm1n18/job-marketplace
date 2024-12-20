import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[#D0D5DD] bg-background px-3 py-2 text-[16px] focus-visible:ring ring-offset-background focus:text-[#344054] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#D0D5DD] focus-visible:outline-none focus:ring-opacity-75 focus:border-[#1C64EE] focus:border-opacity-50 focus:transition-all disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
