"use client";

import Image from "next/image";
import Link from "./LocalizedLink";
import { MapPin, Milk, Package } from "lucide-react";
import { useLanguage } from "@/components/SiteShell";
import { products } from "@/lib/products";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import HomeDiscovery from "./HomeDiscovery";

const featuredSlugs = [
  "stirred-strawberry-500g",
  "stirred-chocolate-500g",
  "drinkable-vanilla-330g",
  "stirred-nature-2.5kg",
];

export default function HomePage() {
  const { copy, language } = useLanguage();
  const featured = featuredSlugs
    .map((slug) => products.find((item) => item.slug === slug))
    .filter((item): item is Product => Boolean(item));

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <Image
          className="home-hero-image"
          src="/brand/range-hero-milk.png"
          alt={
            language === "fr"
              ? "Bouteilles et pots de yaourt YOLA dans une composition avec du lait"
              : "YOLA yogurt bottles and pots in a milk-splash composition"
          }
          fill
          priority
          sizes="100vw"
        />
        <div className="home-hero-shade" />
        <div className="page-container home-hero-content">
          <span className="eyebrow">
            <MapPin size={15} /> {copy.home.eyebrow}
          </span>
          <h1 className="hero-statement" id="home-title">
            {copy.home.hero}
          </h1>
          <p className="hero-description">{copy.home.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/products">
              {copy.common.explore}
            </Link>
            <Link className="button button-quiet" href="/about">
              {copy.nav.about}
            </Link>
          </div>
        </div>
      </section>

      <section
        className="range-section page-container"
        aria-labelledby="range-title"
      >
        <div className="section-heading">
          <div>
            <h2 className="brand-script" id="range-title">
              {copy.home.exploreTitle}
            </h2>
            <p>{copy.home.exploreIntro}</p>
          </div>
          <Image
            className="range-heading-logo"
            src="/brand/logos/yola.png"
            alt="Yola"
            width={126}
            height={75}
          />
        </div>
        <div className="range-paths">
          <Link
            href="/products/category/stirred"
            className="range-path stirred-path"
          >
            <div className="range-path-copy">
              <h3 className="brand-script">{copy.home.stirredTitle}</h3>
              <p>{copy.home.stirredText}</p>
              <span className="text-link">{copy.common.discover}</span>
            </div>
            <Image
              src="/brand/products/stirred-500g-strawberry.png"
              alt={
                language === "fr"
                  ? "Yaourt brassé YOLA Fraise 500 g"
                  : "YOLA Strawberry stirred yogurt 500 g"
              }
              width={225}
              height={300}
            />
          </Link>
          <Link
            href="/products/category/drinkable"
            className="range-path drinkable-path"
          >
            <div className="range-path-copy">
              <h3 className="brand-script">{copy.home.drinkableTitle}</h3>
              <p>{copy.home.drinkableText}</p>
              <span className="text-link">{copy.common.discover}</span>
            </div>
            <Image
              src="/brand/products/drinkable-330g-vanilla.png"
              alt={
                language === "fr"
                  ? "Yaourt à boire YOLA Vanille 330 g"
                  : "YOLA Vanilla drinking yogurt 330 g"
              }
              width={195}
              height={295}
            />
          </Link>
        </div>
      </section>

      <section className="featured-section" aria-labelledby="featured-title">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow green">{copy.home.featuredEyebrow}</span>
              <h2 className="brand-script" id="featured-title">
                {copy.home.featuredTitle}
              </h2>
            </div>
            <Link className="text-link dark" href="/products">
              {copy.common.viewAll}
            </Link>
          </div>
          <div className="product-grid featured-grid">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <HomeDiscovery />
      <section className="company-band">
        <div className="page-container company-band-inner">
          <div>
            <span className="eyebrow">{copy.home.companyEyebrow}</span>
            <h2>{copy.home.companyTitle}</h2>
            <p>{copy.home.companyText}</p>
            <Link className="text-link dark" href="/about">
              {copy.common.discover}
            </Link>
          </div>
          <div className="company-band-art">
            <Image
              src="/brand/logos/soeicam.png"
              alt="SOEICAM"
              width={320}
              height={130}
            />
          </div>
        </div>
      </section>

      <section className="dairy-teaser page-container">
        <div className="dairy-teaser-icon">
          <Milk size={52} strokeWidth={1.4} />
        </div>
        <div>
          <span className="eyebrow green">{copy.home.dairyEyebrow}</span>
          <h2 className="brand-script">{copy.home.dairyTitle}</h2>
          <p>{copy.home.dairyText}</p>
        </div>
        <Link className="button button-outline" href="/dairy">
          {copy.common.discover}
        </Link>
      </section>

      <section className="contact-band">
        <div className="page-container contact-band-inner">
          <Package size={34} strokeWidth={1.4} />
          <div>
            <h2>{copy.home.reachTitle}</h2>
            <p>{copy.home.reachText}</p>
          </div>
          <Link className="button button-light" href="/contact">
            {copy.common.contact}
          </Link>
        </div>
      </section>
    </>
  );
}
