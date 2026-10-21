import { ArrowUp } from "lucide-react";
import { editorial, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <a
          className="wordmark"
          href="#intro"
          aria-label={editorial.navigation.home}
        >
          {editorial.brand}
        </a>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <a href="#intro">
          {editorial.footer.top}
          <ArrowUp size={13} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
