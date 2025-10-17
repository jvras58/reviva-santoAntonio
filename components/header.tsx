"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5 text-primary-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold">Sigma</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#sobre" className="text-sm font-medium hover:text-primary transition-colors">
            Sobre o Projeto
          </Link>
          <Link href="#informacoes" className="text-sm font-medium hover:text-primary transition-colors">
            Informações
          </Link>
          <Link href="#projetos" className="text-sm font-medium hover:text-primary transition-colors">
            Projetos
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild className="hidden md:inline-flex">
            <Link href="#contato">Contato</Link>
          </Button>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link
              href="#sobre"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre o Projeto
            </Link>
            <Link
              href="#informacoes"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Informações
            </Link>
            <Link
              href="#projetos"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projetos
            </Link>
            <Button asChild className="w-full">
              <Link href="#contato" onClick={() => setMobileMenuOpen(false)}>
                Contato
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
