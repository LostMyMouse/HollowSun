import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hollow Sun — A Space Opera",
  description: "Explore Port Meridian and decide the fate of the Hollow Sun Syndicate in a choice-driven space RPG.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
