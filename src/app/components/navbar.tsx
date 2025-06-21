"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname(); // ← Hent gjeldende sti

  return (
    <nav className="w-full bg-[rgb(var(--nav))]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>
        <div className="space-x-6">
          <Link
            href="/"
            className={`text-lg transition-all duration-200 hover:font-semibold hover:text-lg ${
              pathname === "/" ? "text-[rgb(0,116,217)] font-bold" : "text-[rgb(0,116,217)]"
            }`}
          >
            Hjem
          </Link>
          <Link
            href="/projects"
            className={`text-lg transition-all duration-200 hover:font-semibold hover:text-lg ${
              pathname === "/projects" ? "text-[rgb(0,116,217)] font-bold" : "text-[rgb(0,116,217)]"
            }`}
          >
            Prosjekter
          </Link>
        </div>
      </div>
    </nav>
  );
}
