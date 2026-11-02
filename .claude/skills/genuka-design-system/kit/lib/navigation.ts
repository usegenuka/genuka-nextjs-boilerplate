// The kit's components import their links from here, so a project can swap the router in one place.
// With next-intl (locale in the URL, as in Genuka Gym), replace the two lines by:
//   export { Link, usePathname, useRouter } from "@/i18n/navigation";
export { default as Link } from "next/link";
export { usePathname, useRouter } from "next/navigation";
