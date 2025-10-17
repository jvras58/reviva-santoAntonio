import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function ProjectSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24" id="santo-antonio">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
            Criamos a ponte entre o potencial do bairro de Santo Antônio e o seu desejo de investir
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Integrando dados do programa FAE em Pernambuco, em uma área de 2016, 8.4% dos imóveis do bairro de Santo
              Antônio estavam desocupados ou subutilizados.
            </p>
            <p>
              Esses dados, quando cruzados com as informações de zoneamento e legislação urbana, revelam oportunidades
              únicas de investimento e desenvolvimento urbano que podem transformar o bairro e gerar valor para
              investidores e para a cidade.
            </p>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link href="#projetos">SAIBA MAIS</Link>
          </Button>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="/aerial-view-of-urban-neighborhood-santo-antonio.jpg"
            alt="Vista aérea do bairro Santo Antônio"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
