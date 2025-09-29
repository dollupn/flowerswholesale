import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WeddingCenterpiece = () => {
  return (
    <div className="flex min-h-screen flex-col bg-vanilla-cream">
      <Header />
      <main className="flex-1">
        <section className="bg-[#738b16] py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-white/70">Elegant Wedding Decor</span>
            <h1 className="mt-4 text-3xl font-serif font-bold md:text-5xl">Wedding Centerpiece Guide</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg">
              Create stunning table arrangements with roses, baby's breath, and eucalyptus for the perfect wedding ambiance.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/lovable-uploads/creme.webp"
                alt="Wedding Centerpiece"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <article className="space-y-10">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">What You'll Need</h2>
                <ul className="mt-4 space-y-3 text-vanilla-brown/80">
                  <li>12 premium red or white roses</li>
                  <li>Baby's breath (gypsophila) stems</li>
                  <li>Fresh eucalyptus branches</li>
                  <li>Vase or centerpiece container</li>
                  <li>Floral foam (optional)</li>
                  <li>Sharp scissors or floral shears</li>
                  <li>Clean water with flower food</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">Step-by-Step Guide</h2>
                <ol className="mt-4 space-y-4 text-vanilla-brown/80">
                  <li>
                    <strong>Prepare stems:</strong> Cut all stems at 45-degree angle under water. Remove any leaves that will sit below water line.
                  </li>
                  <li>
                    <strong>Create base:</strong> Start with eucalyptus to create greenery foundation around the vase perimeter.
                  </li>
                  <li>
                    <strong>Add roses:</strong> Insert roses at varying heights for dimension, creating a dome shape.
                  </li>
                  <li>
                    <strong>Fill gaps:</strong> Use baby's breath to fill spaces and add airy texture throughout the arrangement.
                  </li>
                  <li>
                    <strong>Final touches:</strong> Adjust heights, ensure water reaches all stems, and place in cool location until event.
                  </li>
                </ol>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  10 Centerpieces
                </div>
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  Setup: 30 minutes
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-inner">
                <h3 className="text-lg font-semibold text-vanilla-brown">Florist&apos;s Pro Tip</h3>
                <p className="mt-2 text-sm text-vanilla-brown/70">
                  Assemble centerpieces the day before your event and store in a cool room. Mist lightly with water and keep away from direct sunlight to maintain freshness.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
            <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">
              Order fresh flowers for your wedding
            </h2>
            <p className="max-w-2xl text-vanilla-brown/70">
              Our wholesale roses and premium blooms make every wedding unforgettable.
            </p>
            <Button asChild size="lg" className="bg-vanilla-brown text-vanilla-cream hover:bg-vanilla-brown/90">
              <Link to="/shop">Browse Flowers</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WeddingCenterpiece;
