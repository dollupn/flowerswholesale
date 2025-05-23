
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Mail, Instagram, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/23052345678", "_blank");
  };

  const handleInstagram = () => {
    window.open("https://instagram.com/vanilluxe", "_blank");
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-vanilla-cream">
        {/* Hero Section */}
        <section className="gradient-bg py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-vanilla-brown mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-vanilla-brown/80 max-w-2xl mx-auto">
              Have questions about our vanilla products? Need advice on usage? 
              We're here to help you discover the perfect vanilla for your needs.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-vanilla-brown">
                    Send Us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-vanilla-brown mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="border-vanilla-beige/50 focus:border-vanilla-brown"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-vanilla-brown mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="border-vanilla-beige/50 focus:border-vanilla-brown"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-vanilla-brown mb-2">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="border-vanilla-beige/50 focus:border-vanilla-brown"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-vanilla-brown mb-2">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="border-vanilla-beige/50 focus:border-vanilla-brown"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-vanilla-brown mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="border-vanilla-beige/50 focus:border-vanilla-brown"
                        placeholder="Tell us about your vanilla needs, questions, or how we can help you..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream"
                      size="lg"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-vanilla-brown">
                    Quick Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp Chat
                  </Button>
                  
                  <Button
                    onClick={handleInstagram}
                    variant="outline"
                    className="w-full border-vanilla-brown text-vanilla-brown hover:bg-vanilla-brown/5"
                    size="lg"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Instagram DM
                  </Button>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-vanilla-brown">
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2 text-vanilla-brown/80">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-vanilla-yellow/20 rounded-lg">
                    <p className="text-sm text-vanilla-brown">
                      <strong>Response Time:</strong> We typically respond to inquiries within 2-4 hours during business hours.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-vanilla-brown">
                    Location & Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <MapPin className="w-5 h-5 text-vanilla-brown mt-1" />
                    <div>
                      <p className="text-vanilla-brown/80">
                        Based in Mauritius<br />
                        Island-wide delivery available
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-vanilla-brown/70">
                    <p>• Free delivery for orders over Rs 500</p>
                    <p>• Same-day delivery in Port Louis area</p>
                    <p>• Express delivery available</p>
                    <p>• Pickup options available</p>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card className="luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
                <CardContent className="p-6 text-center">
                  <h3 className="font-serif font-semibold text-vanilla-brown mb-2">
                    Need Quick Answers?
                  </h3>
                  <p className="text-vanilla-brown/70 text-sm mb-4">
                    Check our FAQ section for common questions about vanilla storage, usage, and more.
                  </p>
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-vanilla-brown text-vanilla-brown hover:bg-vanilla-brown/5"
                  >
                    <a href="/faq">View FAQ</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
