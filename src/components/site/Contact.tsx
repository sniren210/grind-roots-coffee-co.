import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section
      id="contact"
      className="section-overlap relative z-[30] bg-surface py-32 overflow-hidden"
    >
      <div className="absolute -top-20 right-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-6">
              — Contact
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-balance">
              Let's talk about your <em className="italic text-primary">next order.</em>
            </h2>
            <p className="mt-6 text-foreground/70 max-w-md">
              Roasters, cafés, distributors and private-label brands—reach out for samples, MOQ and
              pricing.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <ContactRow
                icon={MessageCircle}
                label="WhatsApp"
                value="+62 812 3456 7890"
                href="https://wa.me/6281234567890"
              />
              <ContactRow
                icon={Mail}
                label="Email"
                value="hello@grindroots.co"
                href="mailto:hello@grindroots.co"
              />
              <ContactRow icon={MapPin} label="Address" value="Bandung, West Java · Indonesia" />
            </div>

            <div className="mt-6 rounded-3xl overflow-hidden border border-border h-56">
              <iframe
                title="Grind Roots location"
                src="https://www.google.com/maps?q=Bandung%20West%20Java&output=embed"
                className="h-full w-full grayscale-[30%]"
                loading="lazy"
              />
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="lg:col-span-7 rounded-3xl bg-background border border-border p-8 md:p-10"
          >
            <h3 className="font-display text-3xl">Request a quote</h3>
            <p className="mt-2 text-foreground/60">We reply within one business day.</p>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <Field label="Full name" name="name" />
              <Field label="Company" name="company" />
              <Field label="Email" name="email" type="email" />
              <Field label="Phone / WhatsApp" name="phone" />
            </div>
            <div className="mt-4">
              <Field
                label="Product interest"
                name="product"
                placeholder="Green / Roasted / Grind, volume, origin…"
              />
            </div>
            <div className="mt-4">
              <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                required
                className="w-full rounded-2xl bg-surface border border-border px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="mt-8 group inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4 hover:bg-primary/90 transition-all"
            >
              {sent ? "Message sent ✓" : "Send request"}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="group flex items-center gap-4 rounded-2xl bg-background border border-border p-4 hover:border-primary/40 transition-colors">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-widest text-foreground/50">{label}</div>
        <div className="text-foreground">{value}</div>
      </div>
      {href && (
        <span className="text-foreground/40 group-hover:text-primary transition-colors">→</span>
      )}
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="w-full rounded-2xl bg-surface border border-border px-4 py-3 focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}
