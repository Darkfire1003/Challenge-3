import localFont from "next/font/local";

export const fraunces = localFont({
  src: [
    {
      path: "../public/fonts/Fraunces-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Fraunces-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});
