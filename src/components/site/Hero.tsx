import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import heroImg from "@/assets/hero-plantation.jpg";

const words = "Premium Coffee Supply, Rooted in Quality.".split(" ");

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section id="home" ref={ref} className="relative min-h-[100svh] overflow-hidden pt-32 pb-24">
      {/* Floating blurred circles */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-secondary/40 blur-[120px] animate-float-slow"
      />
      <motion.div
        style={{ x: useTransform(sx, (v) => -v), y: useTransform(sy, (v) => -v) }}
        className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-gold/30 blur-[120px] animate-float-slower"
      />
      <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-coffee/20 blur-[140px]" />

      {/* Coffee bean particles */}
      <BeanParticles />

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.2em] text-foreground/70"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Focus West Java · Indonesia
        </motion.div>

        <h1 className="mt-8 font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] tracking-tight text-balance max-w-6xl">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {w === "Quality." ? <em className="italic text-primary font-light">{w}</em> : w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 max-w-xl text-lg text-foreground/70 leading-relaxed"
        >
          Grind Roots provides Green Bean, Roasted Bean, and Grind Bean through a
          fully integrated supply chain—from farm to premium coffee.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#products"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-7 py-4 text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary via-secondary to-primary transition-transform duration-700 group-hover:translate-x-0" />
            <span className="relative z-10">Explore Products</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-transparent px-7 py-4 text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Contact Us
          </a>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 rounded-3xl overflow-hidden shadow-soft"
        >
          <motion.img
            src={heroImg}
            alt="Coffee plantation in West Java"
            width={1920}
            height={1280}
            style={{ y: imgY, scale: imgScale }}
            className="h-[52vh] min-h-[380px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

          {/* Glass stat card */}
          <div className="absolute left-6 bottom-6 md:left-10 md:bottom-10 glass rounded-2xl p-5 max-w-xs">
            <div className="text-xs uppercase tracking-widest text-foreground/60">Origin</div>
            <div className="mt-1 font-display text-2xl">West Java Highlands</div>
            <div className="mt-2 text-sm text-foreground/70">
              1,200–1,700m altitude · Arabica & Robusta
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-foreground/50"
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="h-6 w-px bg-foreground/40"
        />
      </motion.div>
    </section>
  );
}

function BeanParticles() {
  const beans = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {beans.map((_, i) => {
        const left = (i * 73) % 100;
        const top = (i * 41) % 100;
        const size = 8 + ((i * 7) % 14);
        const delay = (i % 5) * 0.6;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0], y: [0, -60, -120] }}
            transition={{ duration: 8 + (i % 4), delay, repeat: Infinity, ease: "easeInOut" }}
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size * 1.4 }}
            className="absolute rounded-full bg-coffee/40"
          >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-background/40" />
          </motion.span>
        );
      })}
    </div>
  );
}
