import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MissionSection } from "@/components/mission-section"
import { FeaturesSection } from "@/components/features-section"
import { ProjectSection } from "@/components/project-section"
import { ContactSection } from "@/components/contact-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <MissionSection />
        <FeaturesSection />
        <ProjectSection />
        <ContactSection />
      </main>
    </div>
  )
}
