"use client";

import { useState } from "react";
import { editorial, site } from "@/content/site";

export function CopyEmail() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="contact-copy">
      <button type="button" onClick={copyEmail}>
        {status === "copied"
          ? editorial.contact.copied
          : editorial.contact.copy}
        <span aria-hidden="true">{status === "copied" ? "✓" : "+"}</span>
      </button>
      <span
        className={status === "error" ? "contact-copy-error" : "sr-only"}
        role="status"
      >
        {status === "copied"
          ? editorial.contact.copied
          : status === "error"
            ? editorial.contact.copyError
            : ""}
      </span>
    </div>
  );
}
