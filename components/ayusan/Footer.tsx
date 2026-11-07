import { site } from "./site";

/**
 * Site footer — minimal closing line with real contact details.
 */
export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        AYUSAN LIBRARY &nbsp;/&nbsp; A quieter way to spend the day
      </span>
      <span>
        &copy; {new Date().getFullYear()} {site.name} &nbsp;&middot;&nbsp;{" "}
        <a href={site.contact.phoneHref}>{site.contact.phone}</a>
      </span>
    </footer>
  );
}
