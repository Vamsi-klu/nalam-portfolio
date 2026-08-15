/**
 * Single source of truth for every word on the site.
 *
 * Components in `src/components` hold layout and behavior only — they contain no copy.
 * Changing what a visitor reads should mean editing this file and nothing else.
 *
 * ## Editorial rules
 *
 * 1. **Employer-confidential detail stays off this site.** The Meta / Amazon / UB
 *    bullets name technologies and problem shapes, never internal metrics, product
 *    names, or org structure. That vagueness is deliberate — do not "improve" these
 *    entries by adding specificity. Test: would this be fine on a public resume handed
 *    to a competitor?
 * 2. **Open-source claims must be verifiable.** Every entry in {@link oss}.prs links to
 *    a real public pull request. This section is the site's central credibility claim
 *    ("I don't just use the data stack, I fix it"), and it only works because a reader
 *    can check each item.
 *
 * @see docs/CONTENT.md for the full data model, per-field consumers, and gotchas.
 */

/**
 * Identity, contact details, and the top-level copy blocks.
 *
 * `as const` matters here: it keeps the literal types (so `heroLines` is a readonly
 * tuple of specific strings rather than `string[]`) and prevents accidental mutation.
 *
 * Consumed by `Hero`, `About`, `Impact`, `Contact`, `NavBar`, and the `metadata` export
 * in `app/layout.tsx`.
 */
export const site = {
  name: "Ramachandra Nalam",
  shortName: "Ramachandra",
  title: "Data Engineer",
  tagline: "Product Analytics · Real-time Pipelines · Scalable Platforms",
  location: "Seattle, WA",
  email: "nrcvamsi@gmail.com",
  phone: "+1 (508) 614-0301",
  github: "https://github.com/Vamsi-klu",
  githubUser: "Vamsi-klu",
  linkedin: "https://www.linkedin.com/in/ramachandra-nalam",
  domain: "https://nalamportfolio.dev",
  /**
   * Dangling: no component reads this, and `public/resume.pdf` does not exist.
   * Either ship the file and link it, or drop the field.
   */
  resumeUrl: "/resume.pdf",
  /**
   * Cycled by the `react-type-animation` typewriter in `Hero`.
   *
   * Keep each line to roughly 40-60 characters so it types out in about two seconds.
   * The first entry doubles as the static fallback under reduced motion, so it should
   * be the strongest line.
   */
  heroLines: [
    "Product Analytics | Real-time Pipelines | Data Platforms",
    "100+ Upstream PRs · Building Reliable Systems",
    "Kafka · Spark · Airflow · Snowflake · dbt",
  ],
  about: [
    "Result-oriented Data Engineer with 5+ years building large-scale data pipelines, real-time analytics, and data warehouses across technology and product analytics domains.",
    "I design batch and streaming platforms, semantic modeling layers, and quality-first warehouse patterns — emphasizing reliability, observability, and maintainable self-serve analytics. Descriptions here stay high-level on purpose; employer-confidential work stays off this site.",
    "Outside work I contribute upstream to Airflow, Pinot, Dagster, Airbyte, Flink, and Polars — I don't just use the data stack, I fix it.",
  ],
  /** Status chips rendered as `label · value` pairs in `About`. */
  now: [
    { label: "Building", value: "Reliable batch & streaming data platforms" },
    { label: "Learning", value: "Rust + OpenTelemetry for high-perf pipelines" },
    { label: "Contributing", value: "Airflow, Dagster, Airbyte, Pinot" },
    { label: "Exploring", value: "Open-source collabs & community talks" },
  ],
  /**
   * Category -> skill list. `About` renders one column per key automatically, so
   * adding a category needs no component change. The grid is two columns from `sm` up,
   * so an even number of categories fills every row.
   */
  skills: {
    Languages: ["Python", "SQL", "Scala", "TypeScript", "Java"],
    Streaming: ["Kafka", "Flink", "Spark Streaming"],
    Orchestration: ["Airflow", "dbt", "Dagster"],
    Compute: ["Spark", "PySpark", "Trino"],
    Warehouse: ["Snowflake", "Redshift", "BigQuery", "Postgres"],
    Cloud: ["AWS", "GCP", "Kubernetes", "Docker"],
    Quality: ["Great Expectations", "OpenTelemetry"],
    BI: ["Looker", "Tableau", "Power BI", "Grafana"],
  },
  /**
   * The count-up grid in `Impact`.
   *
   * Each entry carries both a numeric `value` and a `display` string because the two
   * serve different phases of the animation: `Impact` animates from zero toward
   * `value`, then snaps to `display` on the final frame. That split is what lets `100`
   * render as `100+`.
   *
   * Keep `value`, `suffix`, and `display` consistent — if they disagree, the number
   * visibly jumps when the count-up lands.
   *
   * The grid is `lg:grid-cols-6`, so a count divisible by 2, 3, and 6 fills every row.
   *
   * The OSS numbers here restate the same facts as `oss.headline`. Update both together
   * or they drift apart.
   */
  metrics: [
    { label: "Years experience", value: 5, suffix: "+", display: "5+" },
    { label: "OSS PRs opened", value: 100, suffix: "+", display: "100+" },
    { label: "OSS PRs merged", value: 29, suffix: "+", display: "29+" },
    { label: "Airflow merges", value: 19, suffix: "+", display: "19+" },
    { label: "Upstream projects", value: 6, suffix: "+", display: "6+" },
    { label: "Personal builds", value: 6, suffix: "+", display: "6+" },
  ],
} as const;

export type Experience = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

/**
 * Employment history, newest first, rendered as tabs by the `Experience` section.
 *
 * Two constraints when adding an entry:
 *
 * - The tab strip is a fixed `md:w-40`, so a long company name needs a short label.
 *   `Experience.tsx` special-cases `"University at Buffalo"` to render as `"UB"`; add a
 *   similar case rather than letting the tab overflow.
 * - Bullets are keyed by their own string, so two identical bullets under one company
 *   collide as React keys. Keep them distinct.
 *
 * Remember the confidentiality rule at the top of this file — these bullets stay
 * high-level on purpose.
 */
export const experience: Experience[] = [
  {
    company: "Meta",
    role: "Data Engineer",
    period: "Sep 2024 – Present",
    bullets: [
      "Build and operate large-scale streaming and batch pipelines (Kafka, Spark, Airflow) for product analytics use cases.",
      "Design dbt models and semantic layers that support self-serve metrics and stakeholder reporting.",
      "Strengthen data quality with automated validation, monitoring, and clear ownership patterns.",
      "Improve warehouse reliability and cost efficiency through partitioning, modeling discipline, and orchestration hygiene.",
    ],
  },
  {
    company: "Amazon",
    role: "Data Engineer",
    period: "Jul 2022 – Aug 2024",
    bullets: [
      "Delivered AWS-native ETL (Glue, S3, Aurora) for multi-source batch and near-real-time workloads.",
      "Built and tuned Kafka-based streaming paths with a focus on lag, throughput, and operational stability.",
      "Implemented PySpark / Spark SQL transforms for large multi-format datasets.",
      "Optimized Redshift workloads and automated BI reporting for recurring business stakeholders.",
    ],
  },
  {
    company: "University at Buffalo",
    role: "Data Engineer",
    period: "Jan 2021 – Jun 2022",
    bullets: [
      "Built analytics pipelines and warehouses supporting institutional student-success research.",
      "Applied classical ML models (logistic regression, decision trees, random forests) for risk scoring workflows.",
      "Modeled and served datasets on Snowflake / Redshift with lake storage on S3 and Azure Data Lake.",
      "Partnered with academic stakeholders on clear metrics definitions and reproducible reporting.",
    ],
  },
];

export type WorkItem = {
  id: string;
  title: string;
  org: string;
  summary: string;
  stack: string[];
  /**
   * Short *qualitative* pills ("Streaming + batch", "Quality-first") — not numbers.
   * Numeric achievements belong in `site.metrics`, which animates them.
   */
  metrics: string[];
};

/**
 * Themed capability cards under "selected work".
 *
 * These summarize domains rather than individual projects, which is what keeps them
 * publishable while the underlying employer work stays confidential. Cards render
 * three-up at `lg`, so multiples of three lay out cleanly.
 */
export const work: WorkItem[] = [
  {
    id: "streaming-analytics",
    title: "Streaming Product Analytics",
    org: "Meta",
    summary:
      "Event-driven analytics platforms: streaming ingestion, transform layers, semantic modeling, and self-serve reporting patterns for product stakeholders. Details kept non-confidential.",
    stack: ["Kafka", "Spark", "dbt", "Airflow", "Snowflake", "Looker"],
    metrics: ["Streaming + batch", "Semantic layers", "Quality-first"],
  },
  {
    id: "aws-data-platform",
    title: "AWS Data Platform & ETL",
    org: "Amazon",
    summary:
      "Cloud-native batch and streaming data platform work on AWS — Glue/Spark ETL, Kafka paths, warehouse tuning, and automated BI delivery for recurring reporting needs.",
    stack: ["Glue", "Kafka", "Redshift", "S3", "Aurora", "Spark"],
    metrics: ["AWS-native ETL", "Stream lag focus", "Warehouse tuning"],
  },
  {
    id: "oss-data-stack",
    title: "Upstream Data Stack Contributions",
    org: "Open source",
    summary:
      "Public PRs across Airflow, Pinot, and related projects — hooks, operators, docs, and reliability fixes anyone can review on GitHub.",
    stack: ["Airflow", "Pinot", "Python", "CI", "Docs"],
    metrics: ["100+ PRs", "20+ merges", "Public diffs"],
  },
];

export type BuildItem = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
};

/**
 * Personal side projects.
 *
 * `github` and `demo` are both optional and `Builds` renders each icon conditionally,
 * so an entry with neither still renders cleanly — it just shows no link affordance.
 *
 * Titles render in monospace and are treated as repo names, so keep them lowercase and
 * hyphenated to match the actual repository. Cards render three-up at `lg`.
 */
export const builds: BuildItem[] = [
  {
    id: "nl2sql",
    title: "nl2sql",
    description:
      "Natural language → SQL with multi-format upload, schema inference, multi-DB support, and a web UI.",
    stack: ["TypeScript", "SQL", "LLMs"],
    github: "https://github.com/Vamsi-klu/nl2sql",
  },
  {
    id: "jobkanban",
    title: "jobkanban",
    description:
      "Job hunt Kanban with drag-and-drop stages, Google Sheets sync, JWT auth, and email alerts.",
    stack: ["JavaScript", "React", "Vercel"],
    github: "https://github.com/Vamsi-klu/jobkanban",
    demo: "https://jobkanban.vercel.app",
  },
  {
    id: "prompt-optimizer",
    title: "prompt-optimizer",
    description:
      "Universal prompt scorer/optimizer across 7 dimensions with Gemini routing and history IDs.",
    stack: ["TypeScript", "Gemini", "CLI"],
    github: "https://github.com/Vamsi-klu/prompt-optimizer",
  },
  {
    id: "ytsummary",
    title: "YTSummary-Agent",
    description:
      "YouTube summarizer agent with templates, compare, playlist, export, and caching.",
    stack: ["Python", "Agents", "LLMs"],
    github: "https://github.com/Vamsi-klu/YTSummary-Agent",
  },
  {
    id: "agent-skills",
    title: "test-agent-skills",
    description:
      "Multi-agent routing system with hundreds of specialized agents across domains (Claude Agent SDK).",
    stack: ["Python", "Claude SDK", "RAG"],
    github: "https://github.com/Vamsi-klu/test-agent-skills",
  },
  {
    id: "retail-ai",
    title: "retail-ai-agent",
    description:
      "Retail AI Pro — FastAPI + React for inventory, pricing, and forecasting workflows.",
    stack: ["Python", "FastAPI", "React"],
    github: "https://github.com/Vamsi-klu/retail-ai-agent",
  },
];

export type OssPr = {
  title: string;
  repo: string;
  url: string;
};

/**
 * The open-source section — the site's strongest differentiator, and the only place
 * where specific, checkable claims are made.
 *
 * Every entry in `prs` must point at a real public pull request. An unverifiable entry
 * doesn't just fail to help, it undermines the whole section.
 *
 * `headline` restates the counts that also appear in `site.metrics`. Update both
 * together.
 */
export const oss = {
  headline: "100+ PRs · 20+ merged across the modern data stack",
  summary:
    "I don't just use the data stack — I fix it upstream. Production merges into Apache Airflow providers, APIs, tests, and Apache Pinot docs.",
  upstreams: ["Airflow", "Pinot", "Dagster", "Airbyte", "Flink", "Polars"],
  prs: [
    {
      title: "Fix DatabricksSqlHook sqlalchemy_url missing http_path",
      repo: "apache/airflow",
      url: "https://github.com/apache/airflow/pull/69747",
    },
    {
      title: "Add proxy support to Databricks connections",
      repo: "apache/airflow",
      url: "https://github.com/apache/airflow/pull/68527",
    },
    {
      title: "Fix Databricks operators with templated JSON payloads",
      repo: "apache/airflow",
      url: "https://github.com/apache/airflow/pull/68519",
    },
    {
      title: "Add Beeline JDBC parameters to HiveCliHook",
      repo: "apache/airflow",
      url: "https://github.com/apache/airflow/pull/68144",
    },
    {
      title: "Expose authorization header in Swagger API docs",
      repo: "apache/pinot",
      url: "https://github.com/apache/pinot/pull/18974",
    },
    {
      title: "Fix airflow db clean hang on MySQL",
      repo: "apache/airflow",
      url: "https://github.com/apache/airflow/pull/66296",
    },
  ] satisfies OssPr[],
  /**
   * GitHub search scoped to the author, so the "View all PRs" link stays current
   * without anyone maintaining a list.
   */
  allPrsUrl:
    "https://github.com/search?q=author%3AVamsi-klu+is%3Apr&type=pullrequests",
};

/**
 * Drives both `NavBar` (top bar) and `SidebarNav` (the vertical rail on large screens).
 *
 * Each `id` **must** match the `id` attribute of the corresponding `<section>` in
 * `app/page.tsx`. If it doesn't, the anchor link and the sidebar scroll-spy both fail
 * silently — no error, the link simply does nothing.
 *
 * Order matters twice: `NavBar` derives its `01.` / `02.` numbering from the array
 * index, and the sidebar highlights in scroll order, so this should mirror the section
 * order in `page.tsx`.
 *
 * Note `impact` is a rendered section that is deliberately absent here, so it has no
 * nav link and the sidebar doesn't highlight while you scroll past it. Adding
 * `{ id: "impact", label: "impact" }` between `about` and `experience` would change
 * that — it's a decision, not a missing entry.
 */
export const nav = [
  { id: "intro", label: "home" },
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "work", label: "work" },
  { id: "oss", label: "oss" },
  { id: "builds", label: "builds" },
  { id: "contact", label: "contact" },
] as const;

/**
 * Currently unused — no component imports this. Kept for a future education section.
 */
export const education = [
  {
    degree: "MS Data Science",
    school: "University at Buffalo",
    period: "Jan 2021 – Aug 2022",
  },
  {
    degree: "BTech Computer Science",
    school: "K L University",
    period: "Jun 2014 – Aug 2018",
  },
];
