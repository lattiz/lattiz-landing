import HeroParallaxDemo from "./components/hero-parallax-demo";
import { About } from "./components/About";
import { FeaturesData, HowItWorksData, FaqsData } from "./data/content";
import { HowItWorks } from "@/app/components/HowItWorks"
import { FAQs } from "./components/FAQs";
import { FEATURED_FAQS } from "./data/faqs";
import PricingSection from "@/app/components/Pricing"
import CTA2 from "./components/CTA";
import { Features } from "./components/Features";
import TemplateCompareShowcase from "./components/template-compare/TemplateCompareShowcase";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center overflow-x-hidden">
        <HeroParallaxDemo />
        <div className="max-w-7xl mx-auto w-full">
          <div className="px-4 py-26">
            <About />
          </div>
        </div>
        <Features data={FeaturesData.data} />
      </div>
      <div className="max-w-7xl mx-auto w-full">
        <HowItWorks data={HowItWorksData.data} />
        <div className="px-4 mt-32">
          <TemplateCompareShowcase />
        </div>
        <PricingSection />
        <FAQs data={FaqsData.data} items={FEATURED_FAQS} showAllLink id="faq" />
        <div className="px-4">
          <CTA2 />
        </div>
      </div>
    </div>
  );
}
