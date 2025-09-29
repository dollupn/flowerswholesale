import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const whatsappNumber = "23059447719";
const defaultMessage = encodeURIComponent(
  "Hello! I'd love a personalized wholesale flower quote."
);

const FloatingWhatsAppButton = () => {
  const { t } = useLanguage();

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-white shadow-xl transition-all hover:scale-105 hover:bg-[#1DA851] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1DA851]"
      aria-label={t("whatsapp.cta")}
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="hidden text-sm font-semibold sm:inline">{t("whatsapp.cta")}</span>
    </a>
  );
};

export default FloatingWhatsAppButton;
