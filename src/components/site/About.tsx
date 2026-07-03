import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import aboutImg from "@/assets/about-farmer.jpg";

const stats = [
  { value: 120, suffix: "+", label: "Partner Farmers" },
  { value: 100, suffix: "%", label: "Quality Controlled" },
  { value: 8, suffix: "T", label: "Warehouse Ready" },
  { value: 15, suffix: "+", label: "Export Countries" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, mv, to]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="section-overlap scroll-stack z-[5] bg-background lg:pt-48 lg:py-64 py-32 overflow-hidden lg:h-[130svh]"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-soft">
              <img
                src={aboutImg}
                alt="Farmer holding fresh coffee cherries"
                width={1200}
                height={1500}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-accent/60 blur-2xl" />
            <div className="absolute -top-8 -left-6 glass rounded-2xl p-4 w-44">
              <div className="text-xs uppercase tracking-widest text-foreground/60">Est.</div>
              <div className="font-display text-3xl">2018</div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-6"
            >
              — Our Story
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-balance"
            >
              From West Java soil to a <em className="italic text-primary">world-class</em> cup.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-8 text-lg text-foreground/70 leading-relaxed max-w-xl"
            >
              We're an integrated coffee supplier rooted in the highlands of West Java. We work
              directly with partner farmers, process at our workshop, store in climate-controlled
              warehouses, and deliver green, roasted, and ground beans—ready for your business.
            </motion.p>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="border-t border-border/60 pt-4"
                >
                  <div className="font-display text-4xl md:text-5xl text-primary">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-sm text-foreground/60">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
