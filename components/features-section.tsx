import { Card, CardContent } from "@/components/ui/card"
import { Check, Hash, X, Settings } from "lucide-react"

const features = [
  {
    icon: Check,
    title: "FACILITAR",
    description: "Facilitar o acesso aos dados urbanos com uma interface intuitiva",
    color: "text-primary",
  },
  {
    icon: Hash,
    title: "TORNAR",
    description: "Tornar os dados complexos em informações visuais e fáceis de entender",
    color: "text-primary",
  },
  {
    icon: X,
    title: "DIMINUIR",
    description: "Diminuir as complexidades desnecessárias",
    color: "text-primary",
  },
  {
    icon: Settings,
    title: "APRESENTAR",
    description: "Apresentar informações de forma clara e objetiva",
    color: "text-primary",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-secondary/20 py-16" id="sobre">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="mb-2 text-sm font-bold tracking-wide">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
