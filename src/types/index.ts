export interface FormattedArticleData {
  title: string;
  description: string;
  publisher: string;
  url: string;
  text: string;
}

export interface RawArticleData {
  title: string;
  description: string;
  publisher: string;
  url: string;
  text: string;
}

export interface GoogleNewsResults {
  position: string | null;
  title: string | null;
  link: string | null;
  date: string | null;
  source: string | null;
  snippet: string | null;
  category: string | null;
  thumbnail: string | null;
}
