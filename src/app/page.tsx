import HeroParallaxDemo from "./components/hero-parallax-demo";
import { About } from "./components/About";
import { FeaturesData, HowItWorksData, FaqsData } from "./data/content";
import { HowItWorks } from "@/app/components/HowItWorks"
import { FAQs } from "./components/FAQs";
import { featuredFaqs, getFaqCategories, getPricing } from "@/sanity/content";
import PricingSection from "@/app/components/Pricing"
import CTA2 from "./components/CTA";
import { Features } from "./components/Features";
import DesktopTemplateCompare from "./components/template-compare/DesktopTemplateCompare";

export default async function Home() {
  const [categories, pricing] = await Promise.all([getFaqCategories(), getPricing()]);
  return (
    <div>
      <div className="flex flex-col items-center justify-center overflow-x-hidden bg-foreground">
        <HeroParallaxDemo />
        <div className="bg-[#FFF] mx-auto w-full">
          <div className="px-4 py-26 max-w-7xl mx-auto">
            <About />
          </div>
        </div>
        <Features data={FeaturesData.data} />
      </div>
      <HowItWorks data={HowItWorksData.data} />
      <div className="max-w-7xl mx-auto w-full">
        <DesktopTemplateCompare />
        <PricingSection tiers={pricing.tiers} disclosure={pricing.disclosure} />
        <FAQs data={FaqsData.data} items={featuredFaqs(categories)} showAllLink id="faq" />
        <div className="px-4">
          <CTA2 />
        </div>
      </div>
    </div>
  );
}
