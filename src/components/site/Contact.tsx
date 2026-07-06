import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { siteContent } from "@/content";
import { getIcon } from "@/content/content-assets";
import { renderEmphasisHeading } from "@/content/render-heading";

const content = siteContent.contact;
const contactRows = content.rows.map((row) => ({ ...row, Icon: getIcon(row.icon) }));

export function Contact() {
  const [sent, setSent] = useState(false);
  const firstFields = content.form.fields.slice(0, 4);
  const remainingFields = content.form.fields.slice(4);

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
              {content.eyebrow}
            </div>
            <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-balance">
              {renderEmphasisHeading(content.heading)}
            </h2>
            <p className="mt-6 text-foreground/70 max-w-md">{content.description}</p>

            <div className="mt-10 flex flex-col gap-4">
              {contactRows.map((row) => (
                <ContactRow
                  key={row.label}
                  icon={row.Icon}
                  label={row.label}
                  value={row.value}
                  href={row.href}
                />
              ))}
            </div>

            <div className="mt-6 rounded-3xl overflow-hidden border border-border h-56">
              <iframe
                title={content.map.title}
                src={content.map.src}
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
            <h3 className="font-display text-3xl">{content.form.title}</h3>
            <p className="mt-2 text-foreground/60">{content.form.subtitle}</p>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              {firstFields.map((field) => (
                <Field
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                />
              ))}
            </div>
            {remainingFields.map((field) => (
              <div key={field.name} className="mt-4">
                <Field
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <div className="mt-4">
              <label className="block text-xs uppercase tracking-widest text-foreground/60 mb-2">
                {content.form.messageLabel}
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
              {sent ? content.form.successLabel : content.form.submitLabel}
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
  icon: LucideIcon;
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
