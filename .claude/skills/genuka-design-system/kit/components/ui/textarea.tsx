import * as React from "react";

import { cn } from "@/lib/cn";
import { fieldControlClass } from "./input";

function Textarea({ className, rows = 4, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={cn(fieldControlClass, "min-h-20", className)} {...props} />;
}

export { Textarea };
