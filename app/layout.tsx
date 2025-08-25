import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Zählen",
  description: "Zählen is a modern, customizable form builder where users can create, share, and manage online forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
