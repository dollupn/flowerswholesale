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
            <span className="text-sm uppercase tracking-[0.3em] text-white/70">Island Celebration Cake</span>
            <h1 className="mt-4 text-3xl font-serif font-bold md:text-5xl">Mauritian Vanilla Gâteau</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg">
              A buttery sponge layered with vanilla bean pastry cream and finished with toasted coconut—born from the
              aromas of Mauritius.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/lovable-uploads/cake.webp?auto=format&fit=crop&w=1200&q=80"
                alt="Mauritian Vanilla Gateau"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <article className="space-y-10">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">Ingredients</h2>
                <ul className="mt-4 space-y-3 text-vanilla-brown/80">
                  <li>2 ½ cups cake flour</li>
                  <li>1 tbsp baking powder</li>
                  <li>225 g unsalted butter, softened</li>
                  <li>300 g caster sugar</li>
                  <li>4 large eggs</li>
                  <li>2 Madagascar vanilla beans (seeds only)</li>
                  <li>250 ml whole milk</li>
                  <li>2 cups pastry cream enriched with vanilla beans</li>
                  <li>1 cup toasted coconut flakes</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">Method</h2>
                <ol className="mt-4 space-y-4 text-vanilla-brown/80">
                  <li>
                    <strong>Cream:</strong> Beat butter, sugar, and vanilla seeds until light. Add eggs one at a time.
                  </li>
                  <li>
                    <strong>Fold:</strong> Sift in flour and baking powder, alternating with milk until a smooth batter forms.
                  </li>
                  <li>
                    <strong>Bake:</strong> Divide between two pans and bake at 175°C for 28–32 minutes. Cool completely.
                  </li>
                  <li>
                    <strong>Assemble:</strong> Spread vanilla pastry cream between layers and over the top. Finish with toasted
                    coconut.
                  </li>
                </ol>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  Serves 8
                </div>
                <div className="rounded-full bg-vanilla-yellow/50 px-4 py-2 text-sm font-medium text-vanilla-brown">
                  Prep &amp; bake: 1 hour 10 minutes
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-inner">
                <h3 className="text-lg font-semibold text-vanilla-brown">Island Hosting Tip</h3>
                <p className="mt-2 text-sm text-vanilla-brown/70">
                  Pair slices with chilled vanilla-infused rooibos tea or a splash of Mauritian rum for an adults-only
                  dessert table.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
            <h2 className="text-2xl font-serif font-semibold text-vanilla-brown md:text-3xl">
              Elevate every bake with premium vanilla
            </h2>
            <p className="max-w-2xl text-vanilla-brown/70">
              Keep your pantry stocked with beans and extracts that deliver unforgettable island flavour.
            </p>
            <Button asChild size="lg" className="bg-vanilla-brown text-vanilla-cream hover:bg-vanilla-brown/90">
              <Link to="/shop">Shop Vanilla Essentials</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MauritianVanillaGateau;
