export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null; // Changed from string to string | null
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null; // Changed from string to string | null
}
