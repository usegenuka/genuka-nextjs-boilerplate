import { SearchIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";
import { Input } from "./input";

// The dashboard's search field: an input with a thin magnifier on the left, above lists.
function Search({ className, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <Input
      type="search"
      leading={<SearchIcon />}
      className={cn("sm:w-72", className)}
      {...props}
    />
  );
}

export { Search };
