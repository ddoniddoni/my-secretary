import type {
  AssistantPreview,
  ProductHighlight,
  ProductPrinciple,
} from "@/types/assistants";

export const productHighlights: ProductHighlight[] = [
  {
    label: "Saved workflows",
    value:
      "Turn repeated checks for news, markets, baseball, and housing into assistants you can rerun in one click.",
  },
  {
    label: "Structured output",
    value:
      "Render validated result cards instead of dumping raw model text into a generic chat transcript.",
  },
  {
    label: "Server-side AI",
    value:
      "Keep provider fetching, AI generation, and schema validation behind route handlers and assistant runners.",
  },
];

export const assistantPreviews: AssistantPreview[] = [
  {
    type: "news",
    badge: "news brief",
    name: "Morning News Desk",
    summary:
      "Summarize the top stories you care about into a compact morning briefing.",
    description:
      "The news assistant turns category-based source data into a readable brief with headline cards, why-it-matters copy, and source links.",
    bullets: [
      "Track categories such as IT, finance, world, or culture.",
      "Show a headline stack, a top-line summary, and source context.",
      "Stay compatible with mock providers first and real feeds later.",
    ],
    previewItems: [
      {
        title: "Semiconductor spending expands",
        meta: "IT",
        description:
          "Cloud and infrastructure demand continues to drive new capex plans across the supply chain.",
      },
      {
        title: "Why it matters",
        meta: "context",
        description:
          "The same cycle can affect enterprise budgets, AI vendors, and downstream hardware makers.",
      },
    ],
  },
  {
    type: "stock",
    badge: "market brief",
    name: "Market Radar",
    summary:
      "Track watchlist moves, key issues, and public-market context without drifting into investment advice.",
    description:
      "The stock assistant packages price moves, related headlines, and market framing into a structured result card with a clear disclaimer.",
    bullets: [
      "Watch US or KR symbols from the same dashboard.",
      "Summaries stay informational instead of making buy or sell calls.",
      "Related news and issue lists stay tied to provider data.",
    ],
    previewItems: [
      {
        title: "NVDA",
        meta: "+2.1%",
        description:
          "Demand expectations and data-center commentary continue to shape the near-term narrative.",
      },
      {
        title: "Disclaimer",
        meta: "notice",
        description:
          "This briefing is a public-data summary and not investment advice.",
      },
    ],
  },
  {
    type: "baseball",
    badge: "kbo brief",
    name: "KBO Radar",
    summary:
      "Follow your teams with standings-aware roundups instead of scanning several recap pages.",
    description:
      "The baseball assistant collects team updates, standings context, and next-game signals into a quick-read sports briefing.",
    bullets: [
      "Track one or more KBO teams from the same saved setup.",
      "Choose whether standings appear in the final brief.",
      "Keep sports data isolated behind a provider boundary.",
    ],
    previewItems: [
      {
        title: "LG Twins",
        meta: "series",
        description:
          "Pitching depth and bullpen usage are the key watchpoints heading into the next matchup.",
      },
      {
        title: "Standings",
        meta: "included",
        description:
          "League position stays visible so a single game update is easier to interpret in context.",
      },
    ],
  },
  {
    type: "real_estate",
    badge: "housing pulse",
    name: "Home Pulse",
    summary:
      "Monitor regional housing signals with a result UI built for scanning public market updates.",
    description:
      "The real-estate assistant groups public market signals by region and property type so repeated checks stay fast and readable.",
    bullets: [
      "Track multiple regions and property types in one assistant.",
      "Keep copy grounded in public market updates and supply signals.",
      "Stay ready to swap mock data for a real housing feed later.",
    ],
    previewItems: [
      {
        title: "Mapo apartments",
        meta: "Seoul",
        description:
          "Listing movement, sentiment, and supply notes are grouped into one short regional pulse.",
      },
      {
        title: "Signal",
        meta: "public data",
        description:
          "Each update is meant to summarize context, not generate a speculative recommendation.",
      },
    ],
  },
];

export const productPrinciples: ProductPrinciple[] = [
  {
    eyebrow: "Readable UI",
    title: "Result cards over chat transcripts",
    description:
      "Each assistant type should render a purpose-built result view that matches the task instead of repeating a generic chat window.",
  },
  {
    eyebrow: "Reliable boundaries",
    title: "Providers, runners, and schemas stay separate",
    description:
      "Mock providers can be swapped for real APIs later without rewriting the assistant UI or the route-level execution flow.",
  },
  {
    eyebrow: "Safe by default",
    title: "User ownership and server-only AI execution",
    description:
      "Supabase ownership checks, RLS, and server-side AI calls keep data access and secrets on the safe side of the boundary.",
  },
];
