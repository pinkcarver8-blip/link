"use client";

import LinkGrid from "./LinkGrid";
import { useLinks } from "./LinksProvider";

export default function SavedLinkGrid() {
  const { links } = useLinks();
  return <LinkGrid links={links} />;
}
