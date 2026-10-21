import { editorial, site } from "@/content/site";

export function Impact() {
  return (
    <section
      id="impact"
      className="section impact-section"
      aria-labelledby="impact-title"
    >
      <h2 id="impact-title" className="eyebrow">
        {editorial.impact.label}
      </h2>
      <dl className="impact-grid">
        {site.metrics.map((metric) => (
          <div className="impact-metric" key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.display}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
