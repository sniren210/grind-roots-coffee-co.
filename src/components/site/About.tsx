import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { siteContent } from "@/content";
import { getImage } from "@/content/content-assets";
import { renderEmphasisHeading } from "@/content/render-heading";

const content = siteContent.about;
const aboutImg = getImage(content.image);

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
      className="section-overlap scroll-stack z-[5] bg-background py-24 overflow-hidden sm:py-32 lg:min-h-screen lg:py-40"
    >
      <div className="absolute inset-0 opacity-60" aria-hidden="true">
        <div className="absolute left-[-12rem] top-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-10 right-[-10rem] h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative max-w-md lg:max-w-none"
          >
            <motion.div
              initial={{ clipPath: "inset(12% 12% 12% 12% round 1.5rem)", scale: 0.96 }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.5rem)", scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-soft"
            >
              <motion.img
                src={aboutImg}
                alt={content.imageAlt}
                width={1200}
                height={1500}
                loading="lazy"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-multiply" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 translate-y-full bg-gradient-to-t from-background/25 to-transparent transition-transform duration-700 group-hover:translate-y-0" />
            </motion.div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-accent/60 blur-2xl" />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-6 left-4 glass rounded-2xl p-4 w-40 sm:-left-6 sm:-top-8 sm:w-44"
            >
              <div className="text-xs uppercase tracking-widest text-foreground/60">
                {content.badge.label}
              </div>
              <div className="font-display text-3xl">{content.badge.value}</div>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-6"
            >
              {content.eyebrow}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-balance"
            >
              {renderEmphasisHeading(content.heading)}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-8 text-lg text-foreground/70 leading-relaxed max-w-xl"
            >
              {content.description}
            </motion.p>

            <div className="mt-10 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 md:gap-6 lg:mt-12">
              {content.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 28, rotateX: 12, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group rounded-3xl border border-border/70 bg-surface/55 p-5 shadow-[0_20px_60px_-45px_rgba(62,39,35,0.8)] transition-colors hover:border-primary/30"
                >
                  <div className="font-display text-4xl md:text-5xl text-primary">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-sm text-foreground/60">{s.label}</div>
                  <div className="mt-5 h-1 overflow-hidden rounded-full bg-border/60">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full origin-left rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
