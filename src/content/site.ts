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
  resumeUrl: "/resume.pdf",
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
  now: [
    { label: "Building", value: "Reliable batch & streaming data platforms" },
    { label: "Learning", value: "Rust + OpenTelemetry for high-perf pipelines" },
    { label: "Contributing", value: "Airflow, Dagster, Airbyte, Pinot" },
    { label: "Exploring", value: "Open-source collabs & community talks" },
  ],
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
  metrics: string[];
};

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
  allPrsUrl:
    "https://github.com/search?q=author%3AVamsi-klu+is%3Apr&type=pullrequests",
};

export const nav = [
  { id: "intro", label: "home" },
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "work", label: "work" },
  { id: "oss", label: "oss" },
  { id: "builds", label: "builds" },
  { id: "contact", label: "contact" },
] as const;

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
