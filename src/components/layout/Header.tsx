"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { nav, site, addressLine } from "@/lib/site";
import { getLenis, scrollToHash, scrollToTop } from "@/lib/scroll";
import styles from "./Header.module.css";

// The header turns into a solid bar once the page has scrolled a little.
const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};
const useScrolled = () => useSyncExternalStore(subscribeScroll, () => window.scrollY > 40, () => false);

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();

  // Pause page scrolling while the phone menu is open; Escape closes it.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // On the homepage, "Home" glides back to the top and "/#visit" style links glide to
  // their section, instead of jumping.
  const onNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (pathname === "/" && href === "/") {
      e.preventDefault();
      requestAnimationFrame(scrollToTop);
      return;
    }
    if (pathname === "/" && href.startsWith("/#")) {
      // Wait a frame so scrolling is unpaused before gliding.
      e.preventDefault();
      requestAnimationFrame(() => { if (!scrollToHash(href.slice(1))) window.location.assign(href); });
    }
  };

  return (
    <>
      <header className={`${styles.nav} ${scrolled || open ? styles.solid : ""}`}>
        <Link className={styles.brand} href="/" aria-label="Sattva Homes, home" onClick={(e) => onNav(e, "/")}>
          <Image src="/images/brand/sattva-lockup.png" alt="Sattva Homes" width={1228} height={400} priority className={styles.logo} />
        </Link>
        <nav className={styles.menu} aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={(e) => onNav(e, item.href)}
              aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className={styles.book} href="/#visit" onClick={(e) => onNav(e, "/#visit")}>
          Book a visit
        </Link>
        <button type="button" className={styles.toggle} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
          <span className={styles.toggleText}>{open ? "Close" : "Menu"}</span>
          <span className={`${styles.burger} ${open ? styles.burgerOpen : ""}`} aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      <div id="site-menu" className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile">
          {[...nav, { href: "/#visit", label: "Book a visit" }].map((item, i) => (
            <Link key={item.href + item.label} href={item.href} onClick={(e) => onNav(e, item.href)}
              style={{ "--i": i } as React.CSSProperties} className="display">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sheetFoot}>
          <a href={site.phoneHref} className="tabular">{site.phone}</a>
          <span>{addressLine}</span>
        </div>
      </div>
    </>
  );
}
