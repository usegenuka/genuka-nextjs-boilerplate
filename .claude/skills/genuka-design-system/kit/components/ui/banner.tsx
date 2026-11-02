import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

// The dashboard's banner: a -50 background, a -400 border and -800 text, for a message about the whole
// page or section (a missing setting, a limit reached). Short-lived feedback goes in a toast instead.
const VARIANTS = {
  info: { box: "border-blue-400 bg-blue-50 text-blue-800", icon: <Info /> },
  success: { box: "border-green-400 bg-green-50 text-green-800", icon: <CircleCheck /> },
  warning: { box: "border-orange-400 bg-orange-50 text-orange-800", icon: <TriangleAlert /> },
  error: { box: "border-red-400 bg-red-50 text-red-800", icon: <CircleAlert /> },
} as const;

export interface BannerProps {
  variant?: keyof typeof VARIANTS;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** A button or link on the right: "Configurer", "Réessayer". */
  action?: React.ReactNode;
  className?: string;
}

function Banner({ variant = "info", title, children, action, className }: BannerProps) {
  const { box, icon } = VARIANTS[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn("flex w-full flex-col gap-3 rounded-md border p-3 px-4 text-sm shadow-sm sm:flex-row sm:items-center", box, className)}
    >
      <div className="flex flex-1 items-start gap-3">
        <span aria-hidden className="mt-0.5 shrink-0 [&_svg]:size-4">
          {icon}
        </span>
        <div className="min-w-0">
          {title && <p className="font-medium">{title}</p>}
          {children && <div className={cn(title && "mt-0.5")}>{children}</div>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export { Banner };
