import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Coffee, Flame, CircleDot, Sprout, Warehouse, Wrench } from "lucide-react";
import { useRef, useState } from "react";
import plantation from "@/assets/hero-plantation.jpg";
import workshop from "@/assets/gal-workshop.jpg";
import warehouse from "@/assets/gal-warehouse.jpg";
import green from "@/assets/product-green.jpg";
import roasting from "@/assets/gal-roasting.jpg";
import grind from "@/assets/product-grind.jpg";

const steps = [
  {
    icon: Sprout,
    title: "Farm",
    label: "Origin",
    img: plantation,
    desc: "Partner farms across the West Java highlands harvest ripe cherries at altitude for clean, traceable lots.",
  },
  {
    icon: Wrench,
    title: "Workshop",
    label: "Processing",
    img: workshop,
    desc: "Cherries move into controlled processing, sorting, and quality checks before each batch is approved.",
  },
  {
    icon: Warehouse,
    title: "Warehouse",
    label: "Storage",
    img: warehouse,
    desc: "Approved lots are stored in export-ready conditions with clear batch visibility and documentation.",
  },
  {
    icon: Coffee,
    title: "Green Bean",
    label: "Export grade",
    img: green,
    desc: "Grade 1 raw beans are prepared for roasters, distributors, and private-label coffee programs.",
  },
  {
    icon: Flame,
    title: "Roasted Bean",
    label: "Profiled roast",
    img: roasting,
    desc: "Custom roast profiles bring each origin into the right expression for cafes, hotels, and brands.",
  },
  {
    icon: CircleDot,
    title: "Grind Bean",
    label: "Ready to brew",
    img: grind,
    desc: "Finished coffee is ground to spec, packed to order, and prepared for smooth fulfillment.",
  },
];

export function SupplyChain() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: mobileProgress } = useScroll({
    target: mobileRef,
    offset: ["start end", "end start"],
  });
  const railScale = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);
  const mobileRailScale = useTransform(mobileProgress, [0.05, 0.9], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.min(steps.length - 1, Math.max(0, Math.floor(latest * steps.length)));
    setActiveIndex(nextIndex);
  });

  const active = steps[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <section
      id="supply"
      ref={sectionRef}
      className="section-overlap relative z-[15] bg-background overflow-x-clip lg:pb-80"
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 18%, var(--primary), transparent 34%), radial-gradient(circle at 82% 62%, var(--accent), transparent 36%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-background/15" />

      <div className="hidden md:block h-[620vh]">
        <div className="sticky top-0 h-screen">
          <div className="relative mx-auto grid h-screen max-w-7xl grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] items-center gap-16 px-6 py-24">
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.25em] text-primary mb-6">
                — Supply Chain
              </div>
              <h2 className="font-display text-[clamp(3rem,5vw,5.4rem)] leading-[1.02] text-balance">
                Six stages. <em className="italic text-primary">One promise.</em>
              </h2>
              <p className="mt-6 max-w-lg text-foreground/70 text-lg leading-relaxed">
                The story stays fixed while each stage moves through the chain, connecting origin,
                processing, storage, and finished coffee.
              </p>

              <div className="mt-14 grid grid-cols-[3rem_1fr] gap-8">
                <div className="relative flex justify-center py-2">
                  <div className="absolute inset-y-0 w-px bg-background/15" aria-hidden="true" />
                  <motion.div
                    style={{ scaleY: railScale }}
                    className="absolute inset-y-0 w-px origin-top bg-gradient-to-b from-primary via-secondary to-accent"
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex flex-col justify-between">
                    {steps.map((step, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <span
                          key={step.title}
                          className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-500 ${
                            isActive
                              ? "border-primary bg-primary text-primary-foreground shadow-soft"
                              : "border-background/20 bg-footer text-background/45"
                          }`}
                        >
                          <step.icon className="h-4 w-4" />
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="min-h-[22rem]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.title}
                      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                      transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="inline-flex items-center gap-3 rounded-full border border-background/15 bg-background/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-foreground/70 backdrop-blur">
                        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        <span>{active.label}</span>
                      </div>

                      <div className="mt-8 flex items-center gap-4">
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                          <ActiveIcon className="h-6 w-6" />
                        </span>
                        <h3 className="font-display text-[clamp(3rem,4vw,5rem)] leading-none">
                          {active.title}
                        </h3>
                      </div>

                      <p className="mt-6 max-w-xl leading-relaxed text-foreground/70">
                        {active.desc}
                      </p>

                      <a
                        href="#contact"
                        className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-7 py-4 text-primary-foreground transition-transform hover:scale-[1.02]"
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary via-secondary to-primary transition-transform duration-700 group-hover:translate-x-0" />
                        <span className="relative z-10">Request Quote</span>
                        <span className="relative z-10 transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </a>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[76vh] overflow-hidden rounded-[2rem] border border-background/10 bg-background/10 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.65)]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active.img}
                    src={active.img}
                    alt={`${active.title} stage of the Grind Roots supply chain`}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.01 }}
                    transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-footer/70 via-footer/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-background/60">
                      Current stage
                    </div>
                    <div className="mt-1 font-display text-4xl text-background/80">
                      {active.title}
                    </div>
                  </div>
                  <div className="rounded-full border border-background/20 text-background/80 bg-background/10 px-4 py-2 text-sm backdrop-blur">
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(steps.length).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none -mt-[100vh]" aria-hidden="true">
          {steps.map((step) => (
            <div key={step.title} className="h-screen" />
          ))}
        </div>
      </div>

      <div ref={mobileRef} className="relative md:hidden px-6 py-28">
        <div className="mx-auto max-w-2xl">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-6">
            — Supply Chain
          </div>
          <h2 className="font-display text-[clamp(2.4rem,13vw,4rem)] leading-[1.02] text-balance">
            Six steps. One integrated <em className="italic text-primary">journey.</em>
          </h2>
          <p className="mt-5 text-background/70 leading-relaxed">
            Every stage stays visible and traceable, from farm origin to export-ready coffee.
          </p>

          <div className="relative mt-14 pl-9">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-background/15" />
            <motion.div
              style={{ scaleY: mobileRailScale }}
              className="absolute left-4 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-primary via-secondary to-accent"
            />
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{
                    duration: 0.65,
                    delay: (index % 2) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative overflow-hidden rounded-[1.5rem] border border-background/10 bg-background/10"
                >
                  <div className="absolute left-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-primary bg-footer text-primary">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={step.img}
                      alt={`${step.title} stage of the Grind Roots supply chain`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-footer/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-full border border-background/20 bg-background/10 px-3 py-1 text-xs uppercase tracking-[0.16em] backdrop-blur">
                      {String(index + 1).padStart(2, "0")} · {step.label}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-3xl">{step.title}</h3>
                    <p className="mt-3 text-foreground/70 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
