import { motion } from "framer-motion";
import { Leaf, ShieldCheck, HandHeart, Truck, Package, Headphones } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Farm-to-Business Supply",
    desc: "Direct sourcing from West Java partner farms.",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality Control",
    desc: "Cupping, grading and defect check on every batch.",
  },
  {
    icon: HandHeart,
    title: "Sustainable Partnerships",
    desc: "Fair pricing and long-term farmer relationships.",
  },
  { icon: Truck, title: "Reliable Distribution", desc: "On-time export and domestic logistics." },
  {
    icon: Package,
    title: "Flexible Bulk Orders",
    desc: "From 60kg jute sacks to full container loads.",
  },
  {
    icon: Headphones,
    title: "Trusted Customer Service",
    desc: "Direct WhatsApp support with your account lead.",
  },
];

export function WhyUs() {
  return (
    <section className="section-overlap z-[20] bg-surface lg:py-48 py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-6">
            — Why Grind Roots
          </div>
          <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-balance">
            Built for buyers who won't <em className="italic text-primary">compromise.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl bg-background border border-border p-8 overflow-hidden transition-shadow hover:shadow-soft"
            >
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-colors duration-500" />
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-6 font-display text-2xl">{f.title}</h3>
              <p className="relative mt-3 text-foreground/70">{f.desc}</p>
              {/* <span className="relative mt-8 inline-flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                Learn more →
              </span> */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
