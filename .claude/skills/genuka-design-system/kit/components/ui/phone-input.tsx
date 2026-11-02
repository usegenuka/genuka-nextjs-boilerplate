"use client";

import { PhoneInput as InternationalPhoneInput, type PhoneInputProps as LibraryProps } from "react-international-phone";
import "react-international-phone/style.css";

import { cn } from "@/lib/cn";

export interface PhoneInputProps {
  id?: string;
  name?: string;
  value: string;
  /** Called with the number in E.164 form: "+237600000000". */
  onChange: (phone: string) => void;
  /** ISO country of the shop, lower case. Cameroon by default, as in the dashboard. */
  defaultCountry?: LibraryProps["defaultCountry"];
  disabled?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  className?: string;
}

// The dashboard's phone field (react-international-phone): a country picker with the flag
// and dial code, then the number, styled like the kit's Input. Goes inside a Field.
function PhoneInput({ id, name, value, onChange, defaultCountry = "cm", disabled, className, ...aria }: PhoneInputProps) {
  const invalid = aria["aria-invalid"];
  return (
    <InternationalPhoneInput
      defaultCountry={defaultCountry}
      value={value}
      onChange={(phone) => onChange(phone)}
      disabled={disabled}
      className={cn(
        "flex w-full rounded-md bg-white shadow-sm ring-1 ring-inset focus-within:ring-primary",
        invalid ? "ring-red-500" : "ring-slate-200",
        className,
      )}
      inputProps={{ id, name, ...aria }}
      inputClassName="!h-9 sm:!h-10 !flex-1 !rounded-r-md !border-0 !bg-transparent !px-2 !text-sm !text-slate-900 placeholder:!text-slate-400 focus:!outline-none"
      countrySelectorStyleProps={{
        buttonClassName: "!h-9 sm:!h-10 !rounded-l-md !border-0 !border-r !border-slate-200 !bg-transparent !px-2",
      }}
    />
  );
}

export { PhoneInput };
