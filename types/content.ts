export type AssetRef = {
  src?: string;
  alt: string;
  label: string;
  ratio?: "portrait" | "square" | "wide" | "poster";
};

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover?: AssetRef;
  sourceUrl?: string;
  status: "complete" | "summary-only";
  blocks: ArticleBlock[];
};

export type MediaEntry = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  href: string;
  cover: AssetRef;
};

export type SeriesEpisode = {
  episode: string;
  title: string;
  description: string;
  poster: AssetRef;
  needsContent?: boolean;
};

export type MissionQuestion = {
  id: string;
  question: string;
  options: { label: string; points: number }[];
};

export type MissionResult = {
  min: number;
  title: string;
  description: string;
};
