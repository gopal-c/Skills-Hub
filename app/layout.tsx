import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillsHub",
  description: "Find the right person. In plain English.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
