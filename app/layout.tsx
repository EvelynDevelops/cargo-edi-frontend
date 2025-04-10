import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Cargo EDI Tool",
  description: "Generate and decode cargo EDI messages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div className="max-w-8xl mx-auto px-20 py-5">{children}</div>
      </body>
    </html>
  );
}
