import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VanillaSpiceIcedLatte = () => {
  return (
    <div className="flex min-h-screen flex-col bg-vanilla-cream">
      <Header />
      <main className="flex-1">
        <section className="bg-[#738b16] py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-white/70">Chilled Pick-Me-Up</span>
            <h1 className="mt-4 text-3xl font-serif font-bold md:text-5xl">Vanilla &amp; Spice Iced Latte</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg">
              Cold-brew coffee married with vanilla bean syrup and warming island spices for the ultimate afternoon
              refresher.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1200&q=80"
                alt="Vanilla and Spice Iced Latte"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <article className="space-y-10">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">Ingredients</h2>
                <ul className="mt-4 space-y-3 text-vanilla-brown/80">
                  <li>500 ml cold-brew coffee</li>
                  <li>2 Madagascar vanilla beans</li>
                  <li>3 tbsp demerara sugar</li>
                  <li>1 cinnamon stick and 2 whole cloves</li>
                  <li>250 ml whole milk or oat milk</li>
                  <li>Ice cubes</li>
                  <li>Ground nutmeg, for garnish</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">Method</h2>
                <ol className="mt-4 space-y-4 text-vanilla-brown/80">
                  <li>
                    <strong>Make the syrup:</strong> Simmer vanilla beans, sugar, cinnamon, cloves, and 120 ml water for 5
                    minutes. Cool and strain.
                  </li>
                  <li>
                    <strong>Stir:</strong> Combine cold-brew coffee with 3–4 tablespoons of the spiced vanilla syrup.
                  </li>
                  <li>
                    <strong>Serve:</strong> Fill glasses with ice, pour over the coffee mixture, and top with milk. Garnish with
                    nutmeg.
                  </li>
                </ol>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  Serves 2
                </div>
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  Ready in 15 minutes
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-inner">
                <h3 className="text-lg font-semibold text-vanilla-brown">Barista&apos;s Tip</h3>
                <p className="mt-2 text-sm text-vanilla-brown/70">
                  Freeze leftover cold brew and syrup into ice cubes to avoid dilution. Swirl in coconut milk for tropical
                  creaminess.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
            <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">
              Bring café flair home with premium vanilla
            </h2>
            <p className="max-w-2xl text-vanilla-brown/70">
              Our vanilla beans and extracts make every beverage feel like a specialty order.
            </p>
            <Button asChild size="lg" className="bg-vanilla-brown text-vanilla-cream hover:bg-vanilla-brown/90">
              <Link to="/shop">Restock Your Beans</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VanillaSpiceIcedLatte;
