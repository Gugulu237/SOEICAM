"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, ChevronDown, Milk } from "lucide-react";
import { useLanguage } from "@/components/SiteShell";

const sources = [
  "https://www.fao.org/dairy-production-products/processing/",
  "https://www.fao.org/dairy-production-products/processing/collection-and-transport/",
  "https://www.fao.org/family-farming/detail/en/c/339985/",
  "https://www.who.int/news-room/fact-sheets/detail/listeriosis",
];

export default function DairyPage() {
  const { copy } = useLanguage();
  const sourceLabels = [copy.dairy.source1, copy.dairy.source2, copy.dairy.source3, copy.dairy.source4];
  return <>
    <section className="dairy-hero"><div className="page-container dairy-hero-inner"><div><span className="eyebrow green"><Milk size={16} /> {copy.dairy.eyebrow}</span><h1>{copy.dairy.title}</h1><p>{copy.dairy.intro}</p></div><Image src="/brand/products/stirred-500g-nature.png" alt="Yola natural stirred yogurt" width={290} height={380} priority /></div></section>
    <section className="dairy-context page-container"><span className="section-number">01</span><div><h2>{copy.dairy.contextTitle}</h2><p>{copy.dairy.contextText}</p><a className="text-link dark" href={sources[2]} target="_blank" rel="noopener noreferrer">{copy.common.source}: FAO <ArrowUpRight size={16} /></a></div></section>
    <section className="dairy-steps"><div className="page-container"><div className="section-heading"><div><span className="eyebrow green">02 / PROCESS</span><h2 className="brand-script">{copy.dairy.stepsTitle}</h2><p>{copy.dairy.stepsIntro}</p></div></div><div className="step-list">{copy.dairy.steps.map((step, index) => <details key={step.title} open={index === 0}><summary><span>{step.title}</span><ChevronDown size={22} /></summary><p>{step.body}</p></details>)}</div></div></section>
    <section className="dairy-sources page-container"><div><BookOpen size={30} strokeWidth={1.5} /><h2>{copy.dairy.sourcesTitle}</h2></div><ul>{sourceLabels.map((label, index) => <li key={label}><a href={sources[index]} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={17} /></a></li>)}</ul></section>
    <section className="contact-band"><div className="page-container contact-band-inner"><Milk size={34} strokeWidth={1.5} /><div><h2>{copy.dairy.ctaTitle}</h2><p>{copy.dairy.ctaText}</p></div><Link className="button button-light" href="/products">{copy.common.explore}<ArrowRight size={17} /></Link></div></section>
  </>;
}
