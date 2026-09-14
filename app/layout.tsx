import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palabra Viva · Tu grupo, en palabras",
  description: "Votaciones con QR y nube de palabras en directo.",
  other: {
    "codex-preview": "development",
  },
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
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}

