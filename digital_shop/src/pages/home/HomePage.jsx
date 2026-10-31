import { HeroSection } from '@components/home/HeroSection'
import { FeaturedCategories } from '@components/home/FeaturedCategories'
import { TopSellers } from '@components/home/TopSellers'
import { FeaturesSection } from '@components/home/FeaturesSection'
import { CTASection } from '@components/home/CTASection'

export function HomePage() {
  return (
    <div className="">
      <HeroSection />
      <FeaturedCategories />
      <TopSellers />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}
