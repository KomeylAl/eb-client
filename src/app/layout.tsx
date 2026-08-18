import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "ابراز پلاس",
  description: "پنل مراجعان و شرکت‌کنندگان کلینیک ابراز",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/vazirmatn@33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          <UserProvider>
            <Toaster position="top-center" />
            {children}
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
