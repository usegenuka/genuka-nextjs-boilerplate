import * as React from "react";

import { cn } from "@/lib/cn";

export interface FieldProps {
  label: React.ReactNode;
  /** id of the control. Generated when omitted; the control receives it. */
  htmlFor?: string;
  required?: boolean;
  /** Help under the field, hidden while there is an error. */
  hint?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  /** One control (Input, Select, Textarea…): it receives the id, aria-invalid and aria-describedby. */
  children: React.ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>;
}

// The dashboard's field layout: a visible label above (text-slate-500), help or error under the control.
function Field({ label, htmlFor, required, hint, error, className, children }: FieldProps) {
  const generatedId = React.useId();
  const id = htmlFor ?? children.props.id ?? generatedId;
  const messageId = `${id}-message`;
  const message = error ?? hint;
  // A kit control (Input, Select…) or a native field receives the id; a wrapping <div> is left alone,
  // so the id is never set twice: give `htmlFor` and set the same id on the field inside it yourself.
  const wrapper = typeof children.type === "string" && !["input", "select", "textarea"].includes(children.type);
  const control = wrapper
    ? children
    : React.cloneElement(children, {
        id,
        "aria-invalid": error ? true : children.props["aria-invalid"],
        "aria-describedby": message ? messageId : children.props["aria-describedby"],
      });

  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <label htmlFor={id} className="text-slate-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {control}
      {message && (
        <p id={messageId} role={error ? "alert" : undefined} className={cn("text-xs", error ? "text-red-500" : "text-slate-500")}>
          {message}
        </p>
      )}
    </div>
  );
}

/** A value the user reads but cannot change, as the dashboard shows a disabled field: text over a dashed line. */
function FieldValue({ label, children, className }: { label: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <span className="text-slate-500">{label}</span>
      <span className="w-full border-b border-dashed border-slate-300 py-2 text-slate-700">{children ?? "-"}</span>
    </div>
  );
}

export { Field, FieldValue };
