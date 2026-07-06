import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Coffee, Flame, CircleDot, Sprout, Warehouse, Wrench } from "lucide-react";
import { useRef, useState } from "react";
import plantation from "@/assets/hero-plantation.jpg";
import workshop from "@/assets/gal-workshop.jpg";
import warehouse from "@/assets/gal-warehouse.jpg";
import green from "@/assets/product-green.jpg";
import roasting from "@/assets/gal-roasting.jpg";
import grind from "@/assets/product-grind.jpg";

import TiltedCard from "./TiltedCard";
import BorderGlow from "./BorderGlow";
import SpotlightCard from "./SpotlightCard";
import "./TiltedCard.css";
import "./BorderGlow.css";
import "./SpotlightCard.css";

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

// ─── Tilted Poster Wall ─────────────────────────────────────────────────────
const POSTER_WIDTH = 260;
const POSTER_GAP = 28;

function PosterWall() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const velocity = useVelocity(x);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const loopWidth = steps.length * (POSTER_WIDTH + POSTER_GAP);
  const loopedSteps = [...steps, ...steps];

  const skew = useTransform(velocity, [-1800, 0, 1800], [10, 0, -10], { clamp: true });
  const tilt = useTransform(velocity, [-1800, 0, 1800], [-6, 0, 6], { clamp: true });

  useAnimationFrame((_, delta) => {
    if (isDragging || isPaused) return;
    const next = x.get() - (delta / 1000) * 42;
    x.set(next <= -loopWidth ? next + loopWidth : next);
  });

  return (
    <div
      className="relative overflow-hidden py-4"
      style={{ perspective: 1200 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      {/* Outer drag div — handles skew/tilt based on velocity */}
      <motion.div
        ref={trackRef}
        className="flex cursor-grab items-center active:cursor-grabbing"
        style={{ x, gap: POSTER_GAP, skewX: skew, rotateZ: tilt, transformStyle: "preserve-3d" }}
        drag="x"
        dragElastic={0.12}
        dragMomentum={true}
        dragTransition={{ power: 0.35, timeConstant: 260 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false);
          window.setTimeout(() => {
            const current = x.get();
            x.set(
              current > 0
                ? current - loopWidth
                : current < -loopWidth
                  ? current + loopWidth
                  : current,
            );
          }, 900);
        }}
      >
        {loopedSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={`${step.title}-${index}`}
              // TiltedCard fills this div's dimensions
              className="relative shrink-0 rounded-2xl"
              style={{ width: POSTER_WIDTH, height: POSTER_WIDTH * 1.32 }}
            >
              {/* TiltedCard — zoom + glare + tooltip (no 3D tilt: parent is already skewed) */}
              <TiltedCard
                imageSrc={step.img}
                altText={`${step.title} stage`}
                captionText={`${step.title} · ${step.label}`}
                rotateAmplitude={12}
                scaleOnHover={1.06}
                disableTilt={true}
              />

              {/* Overlay UI — sits above TiltedCard, not affected by tilt */}
              <div className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-primary bg-footer text-primary shadow-lg">
                <Icon className="h-4 w-4" />
              </div>
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <div className="text-xs uppercase tracking-[0.16em] text-background/60">
                  {String((index % steps.length) + 1).padStart(2, "0")} · {step.label}
                </div>
                <div className="mt-1 font-display text-xl text-background/85">{step.title}</div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── Stage Card ──────────────────────────────────────────────────────────────
function StageCard({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const Icon = step.icon;
  const flipped = index % 2 === 1;

  const imageFrom = flipped ? 90 : -90;
  const textFrom = flipped ? -90 : 90;

  return (
    <motion.div
      initial={{ opacity: 0, x: imageFrom, rotate: flipped ? 4 : -4 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={`relative grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
        flipped ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Image side — BorderGlow wraps everything */}
      <BorderGlow
        borderRadius={28}
        glowRadius={30}
        glowIntensity={0.75}
        glowColor="25 50 40"
        edgeSensitivity={38}
        className="w-full"
      >
        {/* Spotlight follows cursor on the whole card */}
        <SpotlightCard
          className="w-full overflow-hidden rounded-[1.75rem]"
          spotlightColor="rgba(245, 245, 220, 0.1)"
        >
          {/* TiltedCard — 3D tilt + hover zoom on the image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <TiltedCard
              imageSrc={step.img}
              altText={`${step.title} stage`}
              captionText={`${step.title} · ${step.label}`}
              rotateAmplitude={10}
              scaleOnHover={1.07}
            />

            {/* Bottom gradient overlay — always visible, above TiltedCard */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-footer/80 via-footer/15 to-transparent" />

            {/* Icon badge */}
            <div className="absolute left-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-primary bg-footer text-primary-foreground shadow-lg">
              <Icon className="h-4 w-4" />
            </div>

            {/* Stage label */}
            <div className="absolute bottom-5 left-5 z-20 rounded-full border border-background/20 bg-background/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-background/80 backdrop-blur">
              {String(index + 1).padStart(2, "0")} · {step.label}
            </div>
          </div>
        </SpotlightCard>
      </BorderGlow>

      {/* Text side */}
      <motion.div
        initial={{ opacity: 0, x: textFrom }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-foreground/70">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="h-1 w-1 rounded-full bg-primary" />
          <span>{step.label}</span>
        </div>

        <h3 className="mt-6 font-display text-[clamp(2.4rem,4vw,3.6rem)] leading-none">
          {step.title}
        </h3>

        <p className="mt-5 max-w-md leading-relaxed text-foreground/70">{step.desc}</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────────
export function SupplyChain() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.5"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="supply"
      ref={sectionRef}
      className="section-overlap relative z-[15] overflow-x-clip bg-background py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 18%, var(--primary), transparent 34%), radial-gradient(circle at 82% 62%, var(--accent), transparent 36%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-background/15" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-6 text-xs uppercase tracking-[0.25em] text-primary">
            — Supply Chain
          </div>
          <h2 className="font-display text-[clamp(2.6rem,5vw,5rem)] leading-[1.02] text-balance">
            Six stages. <em className="italic text-primary">One promise.</em>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">
            Every stage stays visible and traceable, connecting origin, processing, storage, and
            finished coffee.
          </p>
        </motion.div>

        {/* Poster Wall */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 -mx-6"
        >
          <PosterWall />
          <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-foreground/40">
            Drag to fly through stages · Hover to zoom
          </p>
        </motion.div> */}

        {/* Stage Cards */}
        <div className="relative mt-20">
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-foreground/10 md:block" />
          <motion.div
            style={{ scaleY: railScale }}
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 origin-top bg-gradient-to-b from-primary via-secondary/50 to-accent md:block"
          />

          <div className="flex flex-col gap-20 md:gap-28">
            {steps.map((step, index) => (
              <StageCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="my-20 flex justify-center"
        >
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-7 py-4 text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary via-secondary/50 to-primary transition-transform duration-700 group-hover:translate-x-0" />
            <span className="relative z-10">Request Quote</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
