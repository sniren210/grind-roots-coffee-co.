import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/content";

const { brand, nav } = siteContent.global;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navTextClass = scrolled || open ? "text-foreground" : "text-background";
  const navMutedTextClass = scrolled || open ? "text-foreground/70" : "text-background/80";
  const navHoverTextClass = scrolled || open ? "hover:text-foreground" : "hover:text-background";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-glass" : "bg-transparent"
          }`}
        >
          <a
            href={brand.homeHref}
            className={`flex items-center gap-2 group text-background lg:${navTextClass}`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-full font-display text-lg transition-colors ${
                scrolled ? "bg-primary text-primary-foreground" : "bg-background text-footer"
              }`}
            >
              {brand.logoLetter}
            </span>
            <span className="font-display text-xl tracking-tight">{brand.name}</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`relative px-4 py-2 text-sm transition-colors group ${navMutedTextClass} ${navHoverTextClass}`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ${
                    scrolled ? "bg-primary" : "bg-background"
                  }`}
                />
              </a>
            ))}
          </nav>

          <a
            href={nav.cta.href}
            className={`hidden md:inline-flex items-center gap-2 rounded-full  px-5 py-2.5 text-sm  hover:bg-primary/90 transition-all hover:gap-3 ${
              scrolled ? "bg-primary text-primary-foreground" : "bg-background text-footer"
            }`}
          >
            {nav.cta.label} →
          </a>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden grid h-10 w-10 place-items-center rounded-full transition-all duration-300 ${
              scrolled || open ? "glass shadow-glass" : "bg-background/15 backdrop-blur-md"
            }`}
            aria-label={nav.menuAriaLabel}
          >
            <span className={`relative block h-3 w-4 ${navTextClass}`}>
              <span
                className={`absolute inset-x-0 top-0 h-px transition-all duration-300 bg-background ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-px transition-all duration-300 bg-background ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-3 rounded-3xl border border-border bg-surface p-4 flex flex-col text-foreground shadow-glass"
          >
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-foreground/80 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
