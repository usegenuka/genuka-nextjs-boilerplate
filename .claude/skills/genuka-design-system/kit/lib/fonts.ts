import { Bricolage_Grotesque, Outfit } from "next/font/google";

// Same fonts as the Genuka dashboard: Bricolage Grotesque for all the text, Outfit for the toasts.
// Put `fontVariables` on <html>; app/genuka-theme.css makes Bricolage the `font-sans` and gives Outfit to the toasts.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const fontVariables = `${bricolage.variable} ${outfit.variable}`;
