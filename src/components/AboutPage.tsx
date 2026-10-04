"use client";

import Image from "next/image";
import Link from "next/link";
import { Boxes, Factory, MapPin, Truck } from "lucide-react";
import { useLanguage } from "@/components/SiteShell";

export default function AboutPage() {
  const { copy } = useLanguage();
  const activities = [
    { icon: Factory, title: copy.about.process, text: copy.about.processText },
    { icon: Boxes, title: copy.about.brand, text: copy.about.brandText },
    { icon: Truck, title: copy.about.distribution, text: copy.about.distributionText },
  ];
  return <>
    <section className="about-hero"><div className="page-container about-hero-inner"><div className="about-hero-copy"><span className="eyebrow"><MapPin size={15} /> {copy.about.eyebrow}</span><h1>{copy.about.title}</h1><p className="about-lead">{copy.about.lead}</p><p>{copy.about.body}</p></div><div className="about-hero-image"><Image src="/brand/range-hero.png" alt="Yola yogurt range" fill priority sizes="(max-width: 800px) 100vw, 50vw" /></div></div></section>
    <section className="about-work page-container"><span className="eyebrow green">SOEICAM</span><h2>{copy.about.whatTitle}</h2><div className="activity-grid">{activities.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={31} strokeWidth={1.7} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="about-brand"><div className="page-container about-brand-inner"><div className="about-brand-image"><Image src="/brand/products/stirred-500g-strawberry.png" alt="Yola strawberry stirred yogurt" fill sizes="(max-width: 800px) 70vw, 36vw" /></div><div><Image src="/brand/logos/yola.png" alt="Yola" width={180} height={106} /><span className="eyebrow green">{copy.common.brand}</span><h2>{copy.about.brandTitle}</h2><p>{copy.about.brandTextLong}</p><Link className="button button-primary" href="/products">{copy.common.explore}</Link></div></div></section>
    <section className="about-more page-container"><div><h2>{copy.about.contactTitle}</h2><p>{copy.about.contactText}</p><Link className="text-link dark" href="/contact">{copy.common.contact}</Link></div><Link className="about-more-link" href="/dairy">{copy.about.learn}</Link></section>
  </>;
}
