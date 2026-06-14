import type { Metadata } from "next";
import "./globals.css";
import MeteorCursor from "@/components/MeteorCursor";

export const metadata: Metadata = {
  title: "Divyanjali Yerraiah Gari | Portfolio",
  description: "Divyanjali's personal space-themed engineering and design portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <MeteorCursor />
        {children}
      </body>
    </html>
  );
}