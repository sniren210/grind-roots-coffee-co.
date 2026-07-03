import { motion } from "framer-motion";
import plantation from "@/assets/hero-plantation.jpg";
import harvest from "@/assets/gal-harvest.jpg";
import workshop from "@/assets/gal-workshop.jpg";
import green from "@/assets/product-green.jpg";
import warehouse from "@/assets/gal-warehouse.jpg";
import roasting from "@/assets/gal-roasting.jpg";
import packaging from "@/assets/gal-packaging.jpg";

const items = [
  { src: plantation, label: "Plantation", span: "md:col-span-2 md:row-span-2" },
  { src: harvest, label: "Harvest", span: "" },
  { src: workshop, label: "Workshop", span: "md:row-span-2" },
  { src: green, label: "Green Bean", span: "" },
  { src: warehouse, label: "Warehouse", span: "md:col-span-2" },
  { src: roasting, label: "Roasting", span: "" },
  { src: packaging, label: "Packaging", span: "" },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-6">— Gallery</div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-balance">
              A closer look at <em className="italic text-primary">the craft.</em>
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70">
            Moments from the field, the workshop and the warehouse.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-3">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-3xl bg-muted ${it.span}`}
            >
              <img
                src={it.src}
                alt={it.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <div className="text-xs uppercase tracking-widest text-background/70">Grind Roots</div>
                <div className="font-display text-xl text-background">{it.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
