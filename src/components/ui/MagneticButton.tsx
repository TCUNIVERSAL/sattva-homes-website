"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

/** A link that leans towards the pointer and springs back when it leaves. */
export default function MagneticButton({ href, className, children }: {
  href: string; className?: string; children: React.ReactNode;
}) {
  const { enabled } = useMotion();
  const el = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const b = el.current;
    if (!enabled || !b || !window.matchMedia("(hover: hover)").matches) return;
    const xTo = gsap.quickTo(b, "x", { duration: 0.6, ease: "elastic.out(1,.4)" });
    const yTo = gsap.quickTo(b, "y", { duration: 0.6, ease: "elastic.out(1,.4)" });
    const move = (e: MouseEvent) => {
      const r = b.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    };
    const leave = () => { xTo(0); yTo(0); };
    b.addEventListener("mousemove", move);
    b.addEventListener("mouseleave", leave);
    return () => { b.removeEventListener("mousemove", move); b.removeEventListener("mouseleave", leave); };
  }, { dependencies: [enabled], revertOnUpdate: true });

  if (!href.startsWith("/")) return <a ref={el} href={href} className={className}>{children}</a>;
  return <Link ref={el} href={href} className={className}>{children}</Link>;
}
