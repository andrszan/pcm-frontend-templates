import type { Metadata } from "next";

import { ThemeSelect } from "@/components/theme-select";

import "./globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Next.js Web App",
  description: "基于 Next.js 和 shadcn/ui 的前端项目起点。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Providers>
          <header className="flex items-center justify-end border-b px-6 py-3">
            <ThemeSelect />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
