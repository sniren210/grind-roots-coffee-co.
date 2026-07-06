import type { ReactNode } from "react";
import type { EmphasisHeading } from "./content-types";

export function renderEmphasisHeading(heading: EmphasisHeading): ReactNode {
  return (
    <>
      {heading.before}
      <em className="italic text-primary">{heading.emphasis}</em>
      {heading.after}
    </>
  );
}
