"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="w-full bg-[rgb(var(--nav))]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Navigasjon + bruker */}
        <div className="flex items-center space-x-6">
          {/* Navigasjonslenker */}
          <Link
            href="/"
            className={`text-lg transition-all duration-200 hover:font-semibold ${
              pathname === "/" ? "text-[rgb(0,116,217)] font-bold" : "text-[rgb(0,116,217)]"
            }`}
          >
            Hjem
          </Link>
          <Link
            href="/projects"
            className={`text-lg transition-all duration-200 hover:font-semibold ${
              pathname === "/projects" ? "text-[rgb(0,116,217)] font-bold" : "text-[rgb(0,116,217)]"
            }`}
          >
            Prosjekter
          </Link>
          <Link
            href="/countries"
            className={`text-lg transition-all duration-200 hover:font-semibold ${
              pathname === "/countries" ? "text-[rgb(0,116,217)] font-bold" : "text-[rgb(0,116,217)]"
            }`}
          >
            Land
          </Link>
          <Link
            href="/map"
            className={`text-lg transition-all duration-200 hover:font-semibold ${
              pathname === "/map" ? "text-[rgb(0,116,217)] font-bold" : "text-[rgb(0,116,217)]"
            }`}
          >
            Kart
          </Link>
          <Link
            href="/quiz"
            className={`text-lg transition-all duration-200 hover:font-semibold ${
              pathname === "/quiz" ? "text-[rgb(0,116,217)] font-bold" : "text-[rgb(0,116,217)]"
            }`}
          >
            Quiz
          </Link>

          {/* Brukerikon eller login-knapp */}
          {session ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setOpen((prev) => !prev)}>
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="Profil"
                  width={36}
                  height={36}
                  className="rounded-full cursor-pointer border border-gray-300 shadow-sm"
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                  <hr />
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-b-xl transition"
                  >
                    Logg ut
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
            >
              Logg inn
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
