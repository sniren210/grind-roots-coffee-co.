import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteContent } from "@/content";
import { getImage } from "@/content/content-assets";
import LiquidEther from "./LiquidEther";

const content = siteContent.hero;
const aboutContent = siteContent.about;
const heroImg = getImage(content.backgroundImage);
const storyWords = ["Origin", "Processing", "Warehousing", "Roasting", "Fulfillment"];
const kpis = aboutContent.stats.slice(0, 4);

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.18 } },
};

const reveal = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (latest) => Math.floor(latest).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: 1.9, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [inView, to, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % storyWords.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-grid min-w-[8.8ch] overflow-hidden align-bottom text-secondary-foreground md:min-w-[10.5ch]">
      <AnimatePresence mode="wait">
        <motion.span
          key={storyWords[index]}
          initial={{ y: "105%", opacity: 0, filter: "blur(10px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-105%", opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1"
        >
          {storyWords[index]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 hero-grid opacity-35" />
      <div className="absolute inset-0 hero-light-sweep opacity-40" />
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1200 800" fill="none">
        <motion.path
          d="M90 580 C260 390 390 675 540 430 S835 250 1110 355"
          stroke="url(#hero-route)"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.6, delay: 1.1, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="hero-route" x1="90" y1="580" x2="1110" y2="355">
            <stop stopColor="var(--background)" stopOpacity="0" />
            <stop offset="0.45" stopColor="var(--background)" stopOpacity="0.7" />
            <stop offset="1" stopColor="var(--secondary)" stopOpacity="0.75" />
          </linearGradient>
        </defs>
      </svg>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-background/55 shadow-[0_0_24px_rgba(245,245,220,0.55)]"
          style={{ left: `${8 + ((i * 17) % 84)}%`, top: `${12 + ((i * 29) % 72)}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.25, 0.8, 0.25], scale: [1, 1.65, 1] }}
          transition={{
            duration: 5 + (i % 5),
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  useEffect(() => {
    document.body.style.overflow = isProfileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isProfileOpen]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate min-h-[120svh] overflow-hidden bg-footer text-background"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: bgY, scale: bgScale }}
        className="absolute -inset-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(245,245,220,0.2),transparent_28%),linear-gradient(115deg,rgba(42,26,23,0.96)_0%,rgba(42,26,23,0.7)_46%,rgba(27,94,32,0.46)_100%)]" />
        <LiquidEther
          colors={["#3e2723", "#6d4c41", "#a1887f", "#d7ccc8", "#f5f5dc"]}
          mouseForce={14}
          cursorSize={90}
          autoDemo={true}
          autoSpeed={0.45}
          autoIntensity={1.8}
          resolution={0.3}
          iterationsPoisson={20}
          dt={0.016}
        />
        {/* <img src={heroImg} alt={content.backgroundAlt} className="h-full w-full object-cover" /> */}
      </motion.div>
      <HeroAtmosphere />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32"
      >
        <motion.div
          variants={reveal}
          className="inline-flex w-fit items-center gap-3 rounded-full border border-background/15 bg-background/10 px-4 py-2 text-xs uppercase tracking-[0.22em] backdrop-blur-md"
        >
          <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_20px_var(--secondary)]" />
          {content.eyebrow}
        </motion.div>

        <motion.div
          variants={reveal}
          className="mt-8 overflow-hidden text-sm uppercase tracking-[0.35em] text-background/65 md:text-base"
        >
          We Move <RotatingWord />
        </motion.div>

        <motion.h1
          variants={reveal}
          className="mt-5 max-w-6xl font-display text-[clamp(3rem,16vw,9.5rem)] leading-[0.95] tracking-[-0.06em] text-balance sm:leading-[1] sm:tracking-[-0.07em]"
        >
          Building Smarter Coffee Supply Solutions
        </motion.h1>

        <motion.p
          variants={reveal}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-background/72 md:text-xl"
        >
          {content.description}
        </motion.p>

        <motion.div
          variants={reveal}
          className="mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:mt-8 md:grid-cols-4"
        >
          {kpis.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="group rounded-2xl border border-background/12 bg-background/[0.075] p-4 backdrop-blur-md sm:rounded-3xl sm:p-5"
            >
              <div className="font-display text-3xl text-background sm:text-4xl md:text-5xl">
                <Counter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-[0.68rem] uppercase tracking-[0.14em] text-background/65 sm:text-xs sm:tracking-[0.18em]">
                {stat.label}
              </div>
              <motion.div
                className="mt-4 h-px origin-left bg-gradient-to-r from-background/70 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
