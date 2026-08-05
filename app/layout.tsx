import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Stay Hydrated",
  description: "Getränkeverwaltung",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <div className="flex flex-1 h-full flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
