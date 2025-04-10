"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="w-full px-6 py-4 bg-gray-50 border-b border-gray-300 flex justify-center gap-8">
      <Link
        href="/"
        className={`text-sm ${
          pathname === "/"
            ? "font-semibold text-black"
            : "font-normal text-gray-700 hover:text-black"
        }`}
      >
        Generate EDI
      </Link>
      <Link
        href="/decode"
        className={`text-sm ${
          pathname === "/decode"
            ? "font-semibold text-black"
            : "font-normal text-gray-700 hover:text-black"
        }`}
      >
        Decode EDI
      </Link>
    </nav>
  );
}
