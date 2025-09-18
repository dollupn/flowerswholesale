import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VanillaBeanCremeBrulee = () => {
  return (
    <div className="flex min-h-screen flex-col bg-vanilla-cream">
      <Header />
      <main className="flex-1">
        <section className="bg-[#738b16] py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-white/70">Signature Dessert</span>
            <h1 className="mt-4 text-3xl font-serif font-bold md:text-5xl">
              Vanilla Bean Crème Brûlée
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg">
              Silky custard infused with Madagascar vanilla beans and finished with a shattering caramelised sugar
              crust—an indulgent finale for any dinner party.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1541959833400-049d37f98ccd?auto=format&fit=crop&w=1200&q=80"
                alt="Vanilla Bean Crème Brûlée"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <article className="space-y-10">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">Ingredients</h2>
                <ul className="mt-4 space-y-3 text-vanilla-brown/80">
                  <li>4 Madagascar vanilla beans, split and seeds scraped</li>
                  <li>6 large egg yolks</li>
                  <li>100 g caster sugar, plus extra for brûlée topping</li>
                  <li>500 ml double cream</li>
                  <li>Pinch of sea salt</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">Method</h2>
                <ol className="mt-4 space-y-4 text-vanilla-brown/80">
                  <li>
                    <strong>Infuse:</strong> Warm the cream, vanilla seeds, and pods in a saucepan until steaming. Cover and
                    steep for 20 minutes.
                  </li>
                  <li>
                    <strong>Whisk:</strong> Beat the yolks, sugar, and salt until pale, then strain in the warm cream while
                    whisking constantly.
                  </li>
                  <li>
                    <strong>Bake:</strong> Pour into ramekins, place in a bain-marie, and bake at 150°C for 30–35 minutes
                    until just set with a gentle wobble. Chill for at least 4 hours.
                  </li>
                  <li>
                    <strong>Finish:</strong> Sprinkle sugar over each custard and torch (or grill) until caramelised and crisp.
                  </li>
                </ol>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  Serves 4
                </div>
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  Prep &amp; cook: 45 minutes
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-inner">
                <h3 className="text-lg font-semibold text-vanilla-brown">Chef&apos;s Serving Suggestion</h3>
                <p className="mt-2 text-sm text-vanilla-brown/70">
                  Top with a few Maldon salt flakes or fresh berries to balance the rich custard. Serve immediately for the
                  perfect crack of caramel.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
            <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">
              Ready to stock up on Madagascar vanilla?
            </h2>
            <p className="max-w-2xl text-vanilla-brown/70">
              Explore our curated selection of beans, pastes, and extracts to bring gourmet flavour into your kitchen.
            </p>
            <Button asChild size="lg" className="bg-vanilla-brown text-vanilla-cream hover:bg-vanilla-brown/90">
              <Link to="/shop">Browse the Shop</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VanillaBeanCremeBrulee;
