import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/shared/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cargo EDI Generator",
  description: "Generate EDI messages for cargo shipments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
