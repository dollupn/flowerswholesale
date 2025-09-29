import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MauritianVanillaGateau = () => {
  return (
    <div className="flex min-h-screen flex-col bg-vanilla-cream">
      <Header />
      <main className="flex-1">
        <section className="bg-[#738b16] py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-white/70">Corporate Event Design</span>
            <h1 className="mt-4 text-3xl font-serif font-bold md:text-5xl">Corporate Event Arrangement</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg">
              Professional floral displays combining orchids and tropical foliage for sophisticated business events 
              and upscale venues.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/lovable-uploads/cake.webp"
                alt="Corporate Event Flower Arrangement"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <article className="space-y-10">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">What You'll Need</h2>
                <ul className="mt-4 space-y-3 text-vanilla-brown/80">
                  <li>15-20 white phalaenopsis orchids</li>
                  <li>Tropical foliage (monstera, palm fronds)</li>
                  <li>Tall clear or frosted glass vases</li>
                  <li>Floral foam or chicken wire</li>
                  <li>River rocks or decorative stones</li>
                  <li>LED accent lighting (optional)</li>
                  <li>Floral wire and tape</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">Setup Guide</h2>
                <ol className="mt-4 space-y-4 text-vanilla-brown/80">
                  <li>
                    <strong>Prepare base:</strong> Secure foam in tall vases. Add river rocks around base for stability and visual interest.
                  </li>
                  <li>
                    <strong>Position foliage:</strong> Insert tropical leaves to create height and dramatic backdrop, angling outward.
                  </li>
                  <li>
                    <strong>Add orchids:</strong> Place orchid stems at varying heights throughout arrangement, creating elegant flow.
                  </li>
                  <li>
                    <strong>Final touches:</strong> Add LED lighting for evening events. Ensure all stems have water access. Mist lightly.
                  </li>
                </ol>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  Large Venue
                </div>
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  Setup: 1 hour
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-inner">
                <h3 className="text-lg font-semibold text-vanilla-brown">Event Designer's Tip</h3>
                <p className="mt-2 text-sm text-vanilla-brown/70">
                  For multi-day events, keep arrangements in air-conditioned spaces and mist daily. White orchids 
                  maintain elegance for 10-14 days with proper care.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
            <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">
              Elevate your corporate events
            </h2>
            <p className="max-w-2xl text-vanilla-brown/70">
              Order premium orchids and tropical foliage for sophisticated business gatherings.
            </p>
            <Button asChild size="lg" className="bg-vanilla-brown text-vanilla-cream hover:bg-vanilla-brown/90">
              <Link to="/shop">Browse Wholesale Flowers</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MauritianVanillaGateau;
