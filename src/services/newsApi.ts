export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

const makeRequest = async (
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<NewsResponse> => {
  const url = new URL(`${BASE_URL}${endpoint}`);

  // Add API key and other parameters
  url.searchParams.append("apiKey", API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const fetchTopHeadlines = async (
  country: string = "us",
  pageSize: number = 20,
  category?: string
): Promise<Article[]> => {
  try {
    const params: Record<string, string | number> = {
      country,
      pageSize,
    };

    if (category) {
      params.category = category;
    }

    const response = await makeRequest("/top-headlines", params);
    return response.articles;
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    return [];
  }
};

export const searchArticles = async (
  query: string,
  pageSize: number = 20,
  sortBy: "relevancy" | "popularity" | "publishedAt" = "publishedAt"
): Promise<Article[]> => {
  try {
    const response = await makeRequest("/everything", {
      q: query,
      pageSize,
      sortBy,
      language: "en",
    });
    return response.articles;
  } catch (error) {
    console.error("Error searching articles:", error);
    return [];
  }
};

export const fetchArticleById = async (
  title: string
): Promise<Article | null> => {
  try {
    const articles = await searchArticles(title, 1);
    return articles.length > 0 ? articles[0] : null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};
