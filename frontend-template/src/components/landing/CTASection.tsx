import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-4 text-primary-foreground">Ready to Track Political Accountability?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Join thousands of engaged citizens using PolicyTrack to stay informed about their representatives and hold them accountable.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-card text-foreground hover:bg-card/90"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              View Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-primary-foreground/70">
            No credit card required • Free tier available • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
