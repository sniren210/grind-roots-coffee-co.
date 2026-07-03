export function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-display">G</span>
            <span className="font-display text-xl">Grind Roots</span>
          </div>
          <p className="mt-3 text-sm text-foreground/60 max-w-sm">
            Rooted in Quality. Crafted for Excellence. From farm to exceptional coffee.
          </p>
        </div>
        <div className="text-sm text-foreground/50">
          © {new Date().getFullYear()} Grind Roots · West Java, Indonesia
        </div>
      </div>
    </footer>
  );
}
