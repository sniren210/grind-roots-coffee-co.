import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { siteContent } from "@/content";

const { whatsapp } = siteContent.global;

export function FloatingWhatsapp() {
  return (
    <motion.a
      href={whatsapp.href}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft"
      aria-label={whatsapp.ariaLabel}
    >
      <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
      <MessageCircle className="relative h-6 w-6" />
    </motion.a>
  );
}
