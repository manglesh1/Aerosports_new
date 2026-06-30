import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Component Test | AeroSports",
  description: "Internal component test page for AeroSports.",
  robots: {
    index: false,
    follow: false,
  },
};

const ButtonShowcase = () => {
  return (
    <div className="min-h-screen p-8">
      <Button variant="primary">🎪 Start Jumping</Button>
      <Button variant="secondary">📅 Book a Party</Button>
      <Button variant="accent" size="md" asChild>
        <Link href="/oakville/pricing-promos">View Pricing & Promos</Link>
      </Button>
      <Button variant="accentOutline" size="md" asChild>
        <a href="https://ecom.roller.app/aerosportsoakvillemississauga/products/en/home">
          Buy Your Tickets
        </a>
      </Button>
      <Button variant="neonGreen" size="full" rounded="md" asChild>
        <Link href="/oakville/attractions">All Attractions →</Link>
      </Button>
    </div>
  );
};

export default ButtonShowcase;
