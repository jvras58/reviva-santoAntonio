"use client"

import Link from "next/link"
import { Grid3x3, Folder, Layers, Filter, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function MapSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { icon: Grid3x3, label: "Camadas selecionado", active: true },
    { icon: Folder, label: "Portal de Dados", active: false },
    { icon: Layers, label: "Camadas", active: false },
    { icon: Filter, label: "Filtros", active: false },
  ]

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1E3A8A] text-white rounded-lg shadow-lg"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-[60px] bg-[#1E3A8A] z-40 flex flex-col items-center py-6 transition-transform duration-300",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <Link href="/" className="mb-8">
          <div className="flex h-10 w-10 items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </Link>

        {/* Navigation icons */}
        <nav className="flex flex-col gap-6 flex-1">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                item.active ? "bg-blue-400 text-white" : "text-white/70 hover:text-white hover:bg-white/10",
              )}
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
            </button>
          ))}
        </nav>

        {/* Footer link */}
        <Link
          href="#"
          className="text-white/70 hover:text-white text-xs font-medium transition-colors writing-mode-vertical"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Leiamais
        </Link>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}
    </>
  )
}
