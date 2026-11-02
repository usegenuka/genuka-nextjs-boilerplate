import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

// Recipe of the dashboard's house button (used by 332 files): regular weight, text-sm,
// rounded-md, orange at 90% that turns full on hover, grey when disabled, full width on phones.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary/90 text-white hover:bg-primary disabled:bg-slate-300 disabled:text-slate-600",
        outline:
          "border border-primary/90 bg-white text-primary hover:bg-primary hover:text-white disabled:border-slate-300 disabled:text-slate-400",
        secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:text-slate-400",
        ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:text-slate-300",
        ghostPrimary: "text-primary hover:bg-primary/5 disabled:text-slate-300",
        danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-slate-300 disabled:text-slate-600",
        ghostDanger: "text-red-500 hover:bg-red-50 disabled:text-slate-300",
        success: "bg-success text-white hover:bg-green-600 disabled:bg-slate-300 disabled:text-slate-600",
        link: "text-primary underline-offset-4 hover:underline disabled:text-slate-300",
      },
      size: {
        default: "h-9 px-7 py-2",
        sm: "h-7 px-2 text-xs",
        lg: "h-11 px-10 text-base",
        icon: "size-9",
      },
      width: {
        /** The dashboard's default: full width on phones, fitted from md. */
        responsive: "w-full md:w-fit",
        fit: "w-fit",
        full: "w-full",
      },
    },
    // Small and discreet buttons sit inside rows and cards: they keep their size on phones too.
    compoundVariants: [
      { size: "icon", className: "w-9 md:w-9" },
      { size: "sm", className: "w-fit md:w-fit" },
      { variant: ["ghost", "ghostPrimary", "ghostDanger", "link"], className: "w-fit md:w-fit" },
    ],
    defaultVariants: { variant: "primary", size: "default", width: "responsive" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renders the single child (a `Link`, an `a`) with the button's look. */
  asChild?: boolean;
  /** Disables the button and shows a spinner before the label. */
  loading?: boolean;
}

function Button({ className, variant, size, width, asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, width }), className);
  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    );
  }
  return (
    <button className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export { Button, buttonVariants };
