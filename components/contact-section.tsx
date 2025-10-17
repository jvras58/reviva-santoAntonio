"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", formData)
  }

  return (
    <section className="bg-primary py-16 md:py-24" id="contato">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-primary-foreground">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
              Vamos conversar sobre seu projeto?
            </h2>
            <p className="text-lg leading-relaxed opacity-90">
              Entre em contato e descubra como podemos ajudar você a encontrar as melhores oportunidades urbanas.
            </p>
            <ul className="space-y-3 text-sm leading-relaxed opacity-90">
              <li>• Análise detalhada de potencial construtivo</li>
              <li>• Consultoria em zoneamento e legislação urbana</li>
              <li>• Identificação de oportunidades de investimento</li>
              <li>• Visualização 3D de dados urbanos complexos</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary-foreground">
                Nome completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-primary-foreground">
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-primary-foreground">
                Mensagem
              </Label>
              <Textarea
                id="message"
                placeholder="Conte-nos sobre seu projeto..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 min-h-32"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Enviar mensagem
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
