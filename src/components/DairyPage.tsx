"use client";

import Image from "next/image";
import Link from "./LocalizedLink";
import { BookOpen, Milk, Plus } from "lucide-react";
import { useLanguage } from "@/components/SiteShell";
import GuideLinks from "./GuideLinks";

const sources = [
  "https://www.fao.org/dairy-production-products/processing/",
  "https://www.fao.org/dairy-production-products/processing/collection-and-transport/",
  "https://www.fao.org/dairy-production-products/socio-economics/the-dairy-chain/en",
  "https://www.who.int/news-room/fact-sheets/detail/listeriosis",
];

export default function DairyPage() {
  const { copy, language } = useLanguage();
  const sourceLabels = [
    copy.dairy.source1,
    copy.dairy.source2,
    copy.dairy.source3,
    copy.dairy.source4,
  ];
  return (
    <>
      <section className="dairy-hero">
        <div className="page-container dairy-hero-inner">
          <div>
            <span className="eyebrow green">
              <Milk size={16} /> {copy.dairy.eyebrow}
            </span>
            <h1>{copy.dairy.title}</h1>
            <p>{copy.dairy.intro}</p>
          </div>
          <Image
            src="/brand/products/stirred-500g-nature.png"
            alt={
              language === "fr"
                ? "Yaourt brassé YOLA Nature 500 g"
                : "YOLA Natural stirred yogurt 500 g"
            }
            width={290}
            height={380}
            priority
          />
        </div>
      </section>
      <section className="dairy-context page-container">
        <span className="section-number">01</span>
        <div>
          <h2>{copy.dairy.contextTitle}</h2>
          <p>{copy.dairy.contextText}</p>
          <a
            className="text-link dark"
            href={sources[2]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.common.source}: FAO
          </a>
        </div>
      </section>
      <section className="dairy-steps">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow green">
                {language === "fr"
                  ? "Les étapes générales"
                  : "General processing steps"}
              </span>
              <h2 className="brand-script">{copy.dairy.stepsTitle}</h2>
              <p>{copy.dairy.stepsIntro}</p>
            </div>
          </div>
          <div className="step-list">
            {copy.dairy.steps.map((step, index) => (
              <details key={step.title} open={index === 0}>
                <summary>
                  <span>{step.title}</span>
                  <Plus size={22} />
                </summary>
                <p>{step.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <GuideLinks />
      <section className="dairy-sources page-container">
        <div>
          <BookOpen size={30} strokeWidth={1.5} />
          <h2>{copy.dairy.sourcesTitle}</h2>
        </div>
        <ul>
          {sourceLabels.map((label, index) => (
            <li key={label}>
              <a
                href={sources[index]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="contact-band">
        <div className="page-container contact-band-inner">
          <Milk size={34} strokeWidth={1.5} />
          <div>
            <h2>{copy.dairy.ctaTitle}</h2>
            <p>{copy.dairy.ctaText}</p>
          </div>
          <Link className="button button-light" href="/products">
            {copy.common.explore}
          </Link>
        </div>
      </section>
    </>
  );
}
