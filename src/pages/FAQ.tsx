
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Truck, Shield, Star } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Product Quality & Authenticity",
      icon: Star,
      faqs: [
        {
          question: "How do I know if your vanilla is authentic Madagascar vanilla?",
          answer: "All our vanilla beans come with certificates of origin from Madagascar. Each batch is traceable to specific farms in the Sambava and Antalaha regions. Authentic Madagascar vanilla has a rich, creamy flavor profile with floral notes that artificial vanilla cannot replicate."
        },
        {
          question: "What's the difference between Grade A and Grade B vanilla beans?",
          answer: "Grade A beans (Gourmet) have higher moisture content (30-35%), are more pliable, and perfect for extracts and direct use. Grade B beans (Extract grade) have lower moisture (15-25%), are drier, and ideal for making extracts or cooking where the beans will be processed."
        },
        {
          question: "How long do vanilla beans stay fresh?",
          answer: "Properly stored Grade A vanilla beans can maintain their quality for 2-4 years. Store them in airtight containers away from light and heat. They may develop a white crystalline coating (vanillin crystals) which is actually a sign of high quality."
        },
        {
          question: "Can I see the vanilla beans before purchasing?",
          answer: "We offer detailed photos of each batch and can provide additional images upon request. For local customers in Mauritius, we also offer inspection before purchase through our WhatsApp contact."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: Truck,
      faqs: [
        {
          question: "Do you deliver across Mauritius?",
          answer: "Yes! We provide island-wide delivery across Mauritius. Free delivery for orders over Rs 1000. Same-day delivery available in Grand Bay area, and next-day delivery for other regions."
        },
        {
          question: "How is vanilla packaged for shipping?",
          answer: "All vanilla products are vacuum-sealed and packaged in food-grade containers to maintain freshness. Orders of 3, 5, or 10 vanilla beans are carefully placed in a premium glass tube, while extracts are securely packaged to prevent breakage during transit."
        },
        {
          question: "What are your delivery charges?",
          answer: "Delivery charges: Postage - Rs 60, Home Delivery - Rs 150, Pickup at Pereybere - Free. Delivery is free for orders over Rs 1000, and we continue to offer express same-day delivery in the Grand Bay area."
        },
        {
          question: "Can I track my order?",
          answer: "Yes, you'll receive tracking information via WhatsApp or SMS once your order is dispatched. You can also contact us anytime for order updates."
        }
      ]
    },
    {
      title: "Storage & Usage Tips",
      icon: Shield,
      faqs: [
        {
          question: "How should I store vanilla beans?",
          answer: "Store vanilla beans in airtight containers at room temperature, away from direct sunlight. Avoid refrigeration as it can cause moisture issues. Properly stored beans can last 2-4 years."
        },
        {
          question: "How much vanilla extract should I use in recipes?",
          answer: "Generally, use 1 teaspoon of pure vanilla extract per cup of flour in baking recipes. For custards and ice creams, start with 1/2 teaspoon per cup of liquid and adjust to taste."
        },
        {
          question: "Can I reuse vanilla beans after scraping?",
          answer: "Absolutely! Used vanilla bean pods can be placed in sugar to make vanilla sugar, added to milk for flavoring, or used to make vanilla extract. They retain flavor for several uses."
        },
        {
          question: "What's the shelf life of vanilla extract?",
          answer: "Pure vanilla extract has an indefinite shelf life when stored properly. The alcohol content preserves it, and it may actually improve with age. Store in a cool, dark place."
        }
      ]
    },
    {
      title: "Returns & Guarantees",
      icon: MessageCircle,
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your vanilla products, contact us within 30 days for a full refund or exchange. Products must be in original packaging."
        },
        {
          question: "Do you guarantee the quality of your vanilla?",
          answer: "Yes! We guarantee that all our vanilla products are authentic Madagascar vanilla of the highest quality. If any product doesn't meet our quality standards, we'll replace it or provide a full refund."
        },
        {
          question: "What if my vanilla beans arrive damaged?",
          answer: "Contact us immediately with photos of the damaged product. We'll arrange a replacement or full refund within 24 hours. Customer satisfaction is our top priority."
        },
        {
          question: "Can I return opened products?",
          answer: "Yes, if you're not satisfied with the quality, you can return even opened products within 30 days. We stand behind our quality guarantee completely."
        }
      ]
    }
  ];

  const handleWhatsApp = () => {
    window.open("https://wa.me/23052345678", "_blank");
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-vanilla-cream">
        {/* Hero Section */}
        <section className="gradient-bg py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-vanilla-brown mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-vanilla-brown/80 max-w-2xl mx-auto">
              Everything you need to know about our premium Madagascar vanilla products, 
              shipping, storage, and more.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Quick Contact */}
          <Card className="mb-12 luxury-shadow border-vanilla-beige/30 bg-vanilla-brown text-vanilla-cream">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-serif font-bold mb-4">
                Can't Find Your Answer?
              </h2>
              <p className="mb-6 text-vanilla-cream/90">
                Our vanilla experts are here to help! Get personalized advice and quick answers.
              </p>
              <Button
                onClick={handleWhatsApp}
                className="bg-vanilla-yellow text-vanilla-brown hover:bg-vanilla-yellow/90"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with Us on WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-serif text-vanilla-brown">
                    <category.icon className="w-6 h-6 mr-3 text-vanilla-brown" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem 
                        key={faqIndex} 
                        value={`item-${categoryIndex}-${faqIndex}`}
                        className="border-vanilla-beige/30"
                      >
                        <AccordionTrigger className="text-left text-vanilla-brown hover:text-vanilla-brown/80">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-vanilla-brown/80 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Help */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-vanilla-brown">
                  Vanilla Usage Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-vanilla-brown/80 mb-4">
                  New to using premium vanilla? Download our comprehensive guide with 
                  recipes, storage tips, and usage recommendations.
                </p>
                <Button 
                  variant="outline" 
                  className="border-vanilla-brown text-vanilla-brown hover:bg-vanilla-brown/5"
                >
                  Download Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
              <CardHeader>
                <CardTitle className="text-xl font-serif text-vanilla-brown">
                  Still Have Questions?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-vanilla-brown/80 mb-4">
                  Our team is always ready to help with personalized advice 
                  for your specific vanilla needs and applications.
                </p>
                <Button 
                  asChild
                  className="bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream"
                >
                  <a href="/contact">Contact Us</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQ;
