"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/site";
import styles from "./EnquiryForm.module.css";

/**
 * The enquiry form from the current site (name, email, phone, build location, message).
 * There's no backend yet, so submitting opens the visitor's email app with the enquiry
 * filled in. Swap handleSubmit for a server action or form service before launch.
 */
export default function EnquiryForm({ designs }: { designs: { slug: string; name: string }[] }) {
  const params = useSearchParams();
  const design = designs.find((d) => d.slug === params.get("design"));
  const visit = params.get("enquiry") === "visit";
  const initialMessage = design
    ? `I'm interested in the ${design.name} design.`
    : visit ? "I'd like to book a visit to the Willawong display home." : "";
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const subject = design ? `Enquiry about ${design.name} from ${name}` : visit ? `Display home visit: ${name}` : `Website enquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${f.get("email")}`,
      `Phone: ${f.get("phone")}`,
      `Looking to build in: ${f.get("location")}`,
      design ? `Design: ${design.name}` : null,
      "",
      String(f.get("message") ?? ""),
    ].filter((l) => l !== null).join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {design && <p className={styles.context}>Enquiring about <b>{design.name}</b></p>}
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Your name *</span>
          <input id="enquiry-name" name="name" required autoComplete="name" />
        </label>
        <label className={styles.field}>
          <span>Your email *</span>
          <input id="enquiry-email" name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Your phone *</span>
          <input id="enquiry-phone" name="phone" type="tel" required autoComplete="tel" />
        </label>
        <label className={styles.field}>
          <span>I am looking to build in… *</span>
          <select id="enquiry-location" name="location" required defaultValue="">
            <option value="" disabled>Choose a location</option>
            {site.buildLocations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </div>
      <label className={styles.field}>
        <span>Your message *</span>
        <textarea id="enquiry-message" name="message" required rows={5} defaultValue={initialMessage} />
      </label>
      <div className={styles.actions}>
        <button type="submit">Send enquiry</button>
        <p aria-live="polite">
          {sent
            ? <>Your email app should open with the enquiry ready to send. If it didn&apos;t, email <b>{site.email}</b> or call <b>{site.phone}</b>.</>
            : "Opens your email app with your enquiry filled in."}
        </p>
      </div>
    </form>
  );
}
