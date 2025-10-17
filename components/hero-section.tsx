import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl text-balance">
            Traduzindo dados complexos em oportunidades urbanas reais
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Conectamos as informações que você precisa para encontrar e aproveitar as melhores oportunidades no centro
            da cidade.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button size="lg" asChild>
              <Link href="/mapa">Descubra Santo Antônio</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#sobre">Saiba mais</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
          <Image
            src="/3d-urban-city-map-visualization-with-buildings.jpg"
            alt="Visualização 3D de dados urbanos"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
