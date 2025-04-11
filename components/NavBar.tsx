"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="w-full px-10 py-4 bg-gray-50 flex items-center fixed top-0 z-50">
      <img src="/images/clearai-logo.png" alt="Logo" className="h-6 ml-4" />
      <div className="flex-1 flex justify-center gap-8">
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
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Decode EDI
        </Link>
      </div>
    </nav>
  );
}
