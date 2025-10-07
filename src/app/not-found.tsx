import FuzzyText from "@/components/FuzzyText";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 p-6">
      <div className="flex flex-col items-center justify-center">
        <FuzzyText
          fontSize={"clamp(4rem, 50vw, 12rem)"}
          color="var(--foreground)"
          baseIntensity={0.1}
          hoverIntensity={0.2}
          enableHover={true}
        >
          404
        </FuzzyText>
        <FuzzyText
          fontSize={"clamp(1rem, 10vw, 4rem)"}
          color="var(--foreground)"
          baseIntensity={0.1}
          hoverIntensity={0.2}
          enableHover={true}
        >
          Not Found
        </FuzzyText>
      </div>

      <p className="text-secondary-foreground">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}
