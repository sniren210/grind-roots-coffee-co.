import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sprout, Wrench, Warehouse, Coffee, Flame, CircleDot } from "lucide-react";

const steps = [
  { icon: Sprout, title: "Farm", desc: "Partner farms across West Java, hand-picked cherries." },
  { icon: Wrench, title: "Workshop", desc: "Processing, sorting and quality control." },
  { icon: Warehouse, title: "Warehouse", desc: "Climate-controlled storage, export-ready." },
  { icon: Coffee, title: "Green Bean", desc: "Grade 1 raw beans for roasters worldwide." },
  { icon: Flame, title: "Roasted Bean", desc: "Custom roast profiles for every palate." },
  { icon: CircleDot, title: "Grind Bean", desc: "Precisely ground for brewers and blends." },
];

export function SupplyChain() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  return (
    <section id="supply" className="relative py-32 bg-surface overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-6">— Supply Chain</div>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-balance">
            Six steps. One integrated <em className="italic text-primary">journey.</em>
          </h2>
        </div>

        <div ref={ref} className="relative mt-24">
          {/* Horizontal on desktop */}
          <div className="hidden md:block relative">
            <div className="absolute left-0 right-0 top-8 h-px bg-border" />
            <motion.div
              style={{ scaleX: lineScale }}
              className="absolute left-0 right-0 top-8 h-px origin-left bg-primary"
            />
            <div className="grid grid-cols-6 gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="relative"
                >
                  <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full bg-background border border-border shadow-glass mx-auto -mt-8">
                    <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="text-primary">
                      <s.icon className="h-6 w-6" />
                    </motion.div>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="text-xs text-foreground/50">0{i + 1}</div>
                    <div className="mt-1 font-display text-xl">{s.title}</div>
                    <div className="mt-2 text-sm text-foreground/60 leading-relaxed">{s.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vertical on mobile */}
          <div className="md:hidden relative pl-10">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <motion.div
              style={{ scaleY: lineScale }}
              className="absolute left-4 top-0 bottom-0 w-px origin-top bg-primary"
            />
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative pb-12"
              >
                <div className="absolute -left-10 top-0 grid h-9 w-9 place-items-center rounded-full bg-background border border-border">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="font-display text-xl">{s.title}</div>
                <div className="mt-1 text-sm text-foreground/60">{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
