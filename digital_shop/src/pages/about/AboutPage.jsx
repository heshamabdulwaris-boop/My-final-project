import { HeroSection } from '@components/about/HeroSection'
import { MissionSection } from '@components/about/MissionSection'
import { HowItWorksSection } from '@components/about/HowItWorksSection'
import { VisionSection } from '@components/about/VisionSection'
import { CoreValuesSection } from '@components/about/CoreValuesSection'

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <MissionSection />
      <VisionSection />
      <CoreValuesSection />
    </div>
  )
}
