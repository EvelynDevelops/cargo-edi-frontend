"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface INavItem {
  href: string;
  label: string;
}

/**
 * Navigation configuration
 * Define all navigation items here for easy maintenance
 */
const NAV_ITEMS: INavItem[] = [
  {
    href: "/",
    label: "Generate EDI"
  },
  {
    href: "/decode",
    label: "Decode EDI"
  }
];

/**
 * Navigation Bar Component
 * Displays the main navigation with logo and links
 */
export default function NavBar() {
  const pathname = usePathname();

  const getLinkClassName = (href: string): string => {
    const baseClasses = "text-sm transition-colors duration-200";
    const activeClasses = "font-semibold text-black";
    const inactiveClasses = "font-normal text-gray-700 hover:text-black";
    
    return `${baseClasses} ${pathname === href ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="w-full px-4 md:px-10 py-4 bg-gray-50 flex items-center fixed top-0 z-50 shadow-sm">
      <Link href="/" className="flex items-center">
        <img src="/images/clearai-logo.png" alt="ClearAI Logo" className="h-6 ml-4" />
      </Link>
      
      <div className="flex-1 flex justify-center gap-4 md:gap-8">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={getLinkClassName(item.href)}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
