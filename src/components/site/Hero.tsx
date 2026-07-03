import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero-plantation.jpg";

const typedPhrases = ["Rooted in Quality.", "Sourced from West Java.", "Crafted from Farm to Cup."];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 90]);
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

  useEffect(() => {
    const currentPhrase = typedPhrases[phraseIndex];
    const isComplete = typedText === currentPhrase;
    const isEmpty = typedText === "";
    const delay = isComplete ? 1400 : isDeleting ? 42 : 78;

    const timeout = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % typedPhrases.length);
        return;
      }

      setTypedText((current) =>
        isDeleting
          ? currentPhrase.slice(0, current.length - 1)
          : currentPhrase.slice(0, current.length + 1),
      );
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [isDeleting, phraseIndex, typedText]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-svh overflow-hidden pt-32 pb-48 lg:pt-36 z-30"
    >
      {/* Blurred hero image background */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY }}
        className="absolute -inset-12 overflow-hidden"
      >
        <img src={heroImg} alt="" className="h-full w-full scale-125 object-cover opacity-100 " />
        {/* <div className="absolute inset-0 bg-background/45" /> */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-background/10" />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/35" /> */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,transparent_0%,hsl(var(--background)/0.36)_45%,hsl(var(--background)/0.82)_100%)]" /> */}
      </motion.div>

      {/* Floating blurred circles */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-secondary/40 blur-[120px] animate-float-slow"
      />
      <motion.div
        style={{ x: useTransform(sx, (v) => -v), y: useTransform(sy, (v) => -v) }}
        className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-accent/30 blur-[120px] animate-float-slower"
      />
      <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-coffee/20 blur-[140px]" />

      {/* Coffee bean particles */}
      <BeanParticles />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 "
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.2em] text-foreground/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Focus West Java · Indonesia
          </motion.div>

          <h1 className="mt-8 max-w-5xl font-display text-[clamp(2.75rem,7vw,6.25rem)] leading-[0.95] tracking-tight text-balance">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block overflow-hidden pb-2"
            >
              Premium Coffee Supply,
            </motion.span>
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="block min-h-[1.05em] overflow-hidden pb-2 italic text-primary"
            >
              <span>{typedText}</span>
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="ml-1 inline-block h-[0.78em] w-[0.04em] translate-y-[0.08em] bg-primary"
              />
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-foreground/70"
          >
            Grind Roots provides Green Bean, Roasted Bean, and Grind Bean through a fully integrated
            supply chain—from farm to premium coffee.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#products"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-7 py-4 text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary via-secondary/50 to-primary transition-transform duration-700 group-hover:translate-x-0" />
              <span className="relative z-10">Explore Products</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-transparent px-7 py-4 text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>

        {/* Hero image */}
        {/* <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: bgY }}
          className="relative overflow-hidden rounded-[2rem] shadow-soft lg:min-h-[620px]"
        >
          <motion.img
            src={heroImg}
            alt="Coffee plantation in West Java"
            width={1920}
            height={1280}
            style={{ scale: useTransform(scrollYProgress, [0, 1], [1, 1.15]) }}
            className="h-[58vh] min-h-[420px] w-full object-cover lg:h-full lg:min-h-[620px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

          <div className="absolute left-6 bottom-6 md:left-10 md:bottom-10 glass rounded-2xl p-5 max-w-xs">
            <div className="text-xs uppercase tracking-widest text-foreground/60">Origin</div>
            <div className="mt-1 font-display text-2xl">West Java Highlands</div>
            <div className="mt-2 text-sm text-foreground/70">
              1,200–1,700m altitude · Arabica & Robusta
            </div>
          </div>
        </motion.div> */}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 lg:flex"
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
  const beans = Array.from({ length: 32 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {beans.map((_, i) => {
        const left = (i * 41) % 100;
        const top = (i * 73) % 100;
        const size = 8 + ((i * 7) % 14);
        const delay = (i % 5) * 0.6;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0], y: [0, 60, 120] }}
            transition={{ duration: 8 + (i % 4), delay, repeat: Infinity, ease: "easeInOut" }}
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size * 1.4 }}
            className="absolute rounded-full bg-primary rotate-45"
          >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-background" />
          </motion.span>
        );
      })}
    </div>
  );
}
