import { HeroParallax, type HeroProduct } from "@/app/components/ui/hero-parallax";
import { getTemplates } from "@/lib/templates/get-templates";

const HERO_TEMPLATES_COUNT = 8;

// Server Component: the templates come from getTemplates() (ISR, 300 s), so the
// home stays static and only the minimal card data reaches the client bundle.
export default async function HeroParallaxDemo() {
  return <HeroParallax products={await getHeroProducts()} />;
}

async function getHeroProducts(): Promise<HeroProduct[]> {
  try {
    const templates = await getTemplates();
    return templates.slice(-HERO_TEMPLATES_COUNT).map((template) => ({
      title: template.name,
      link: template.previewUrl,
      thumbnail: template.thumbnailUrl,
    }));
  } catch (error) {
    // Unlike /templates, the home has no error boundary: render the hero
    // without cards rather than failing the whole page.
    console.error("[hero] Could not load templates:", error);
    return [];
  }
}
