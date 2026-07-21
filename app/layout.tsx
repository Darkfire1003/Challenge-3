import type { Metadata } from "next";
import "./globals.css";
import { fraunces, inter } from "./fonts";
import Header from "./components/Header/Header";

export const metadata: Metadata = {
  title: "Stay Hydrated",
  description: "Dein Online Getränkeautomat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="bg-secon min-h-full flex flex-col mx-auto max-w-7xl">
        <Header />
        {children}
      </body>
    </html>
  );
}
