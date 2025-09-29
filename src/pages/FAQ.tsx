
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Truck, Shield, Star } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Product Quality & Freshness",
      icon: Star,
      faqs: [
        {
          question: "How fresh are your flowers?",
          answer: "All our flowers are sourced fresh from trusted local and international suppliers. We receive daily and weekly shipments depending on the variety. Each stem is quality-checked before delivery to ensure peak freshness."
        },
        {
          question: "What varieties do you offer?",
          answer: "We offer a wide selection including premium roses (red, white, pink), orchids, lilies, sunflowers, tulips, and seasonal blooms. We also provide tropical foliage and greenery for arrangements."
        },
        {
          question: "How long do wholesale flowers last?",
          answer: "With proper care, our roses last 7-10 days, orchids 2-3 weeks, and most seasonal flowers 5-7 days. We provide care instructions with every order to ensure maximum longevity."
        },
        {
          question: "Can I request specific flower varieties?",
          answer: "Yes! Contact us via WhatsApp with your requirements. We work with our suppliers to source specific varieties for large events and special requests."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: Truck,
      faqs: [
        {
          question: "Do you deliver across Mauritius?",
          answer: "Yes! We provide island-wide delivery across Mauritius. Free delivery for orders over Rs 1000. Same-day delivery available in the north, and scheduled delivery for other regions."
        },
        {
          question: "How are flowers packaged for delivery?",
          answer: "All flowers are carefully packed in protective sleeves with water tubes on stems. Bulk orders are transported in temperature-controlled vehicles to maintain freshness. We use sturdy boxes to prevent damage during transit."
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
      title: "Care & Handling Tips",
      icon: Shield,
      faqs: [
        {
          question: "How should I care for wholesale flowers?",
          answer: "Cut stems at 45-degree angle, remove leaves below water line, use flower food, change water every 2 days, and keep in cool location away from direct sunlight and heat sources."
        },
        {
          question: "What's the best way to prepare flowers for events?",
          answer: "Order 1-2 days before your event. Store in cool room (15-18°C), keep stems in water, and arrange the day before. Mist lightly with water and transport carefully in boxes."
        },
        {
          question: "Can flowers be stored in a refrigerator?",
          answer: "Yes, but not with fruits or vegetables as they emit ethylene gas that ages flowers. Keep at 2-4°C in a dedicated floral cooler if possible. Remove before use and let reach room temperature slowly."
        },
        {
          question: "How do I extend flower life?",
          answer: "Use clean vases, flower food, cut stems regularly, change water frequently, and keep away from heat, direct sun, and ripening fruit. Remove wilted blooms promptly."
        }
      ]
    },
    {
      title: "Returns & Guarantees",
      icon: MessageCircle,
      faqs: [
        {
          question: "What is your freshness guarantee?",
          answer: "We guarantee all flowers are fresh upon delivery. If you receive flowers that don't meet our quality standards, contact us immediately with photos for a replacement or full refund."
        },
        {
          question: "Do you offer refunds for wilted flowers?",
          answer: "Yes! If flowers arrive wilted or damaged, contact us within 24 hours with photos. We'll arrange immediate replacement or full refund. Customer satisfaction is our priority."
        },
        {
          question: "What if flowers wilt quickly after delivery?",
          answer: "Contact us immediately with photos. Quick wilting usually indicates care issues, but we'll work with you to resolve the problem and provide guidance or replacement if needed."
        },
        {
          question: "Can I return unused flowers?",
          answer: "Due to the perishable nature of flowers, we cannot accept returns of unused flowers. However, we stand behind our quality guarantee for any freshness or quality issues."
        }
      ]
    }
  ];

  const handleWhatsApp = () => {
    window.open("https://wa.me/23059447719", "_blank");
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
              Everything you need to know about our wholesale flowers, 
              delivery, care instructions, and more.
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
                Our flower specialists are here to help! Get personalized advice for your events.
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
                  Flower Care Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-vanilla-brown/80 mb-4">
                  New to wholesale flowers? Learn best practices for care, 
                  storage, and creating stunning arrangements.
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
                  for your events, weddings, and flower needs.
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
