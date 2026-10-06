import LinkCard from "./LinkCard";
import type { LinkItem } from "../types";

export default function LinkGrid({ links }: { links: LinkItem[] }) {
  return (
    <section className="grid flex-1 grid-cols-1 content-start gap-3 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </section>
  );
}
