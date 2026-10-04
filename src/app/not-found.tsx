import Link from "next/link";

export default function NotFound() {
  return <section className="not-found page-container"><p className="eyebrow">404</p><h1>Page not found</h1><p>This page may have moved.</p><Link className="button button-primary" href="/">Return home</Link></section>;
}
