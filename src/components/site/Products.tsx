import { motion } from "framer-motion";
import { siteContent } from "@/content";
import { getImage } from "@/content/content-assets";
import { renderEmphasisHeading } from "@/content/render-heading";

const content = siteContent.products;

export function Products() {
  return (
    <section
      id="products"
      className="section-overlap z-[25] bg-background lg:pt-34 lg:pb-48 py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-6">
              {content.eyebrow}
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-balance">
              {renderEmphasisHeading(content.heading)}
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70">{content.description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {content.items.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col rounded-3xl bg-card border border-border overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <motion.img
                  src={getImage(p.image)}
                  alt={p.alt}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-sm">
                  <span className="mr-1.5">{p.emoji}</span>
                  {p.originBadge}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="font-display text-3xl text-background">{p.name}</h3>
                  <span className="grid h-10 w-10 place-items-center rounded-full glass text-background">
                    →
                  </span>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col">
                <p className="text-foreground/70 leading-relaxed">{p.description}</p>
                <ul className="mt-6 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-border text-xs text-foreground/50 uppercase tracking-widest">
                  {p.origin}
                </div>
                <a
                  href={content.cta.href}
                  className="mt-6 inline-flex items-center justify-between rounded-full bg-foreground text-background px-5 py-3 hover:bg-primary transition-colors"
                >
                  {content.cta.label}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
