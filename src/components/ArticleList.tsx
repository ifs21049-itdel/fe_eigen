import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Card,
  Typography,
  Button,
  Image,
  Tag,
  Space,
  Spin,
  Alert,
  Input,
  Row,
  Col,
} from "antd";
import {
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { Article } from "../types/news";
import { fetchTopHeadlines, searchArticles } from "../services/newsApi";

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [error, setError] = useState<string>("");

  const loadArticles = async (
    searchQuery?: string,
    selectedCategory?: string
  ) => {
    setLoading(true);
    setError("");

    try {
      let data: Article[];

      if (searchQuery && searchQuery.trim()) {
        data = await searchArticles(searchQuery, 20);
      } else {
        data = await fetchTopHeadlines("us", 20, selectedCategory || undefined);
      }

      setArticles(data);
      if (data.length > 0) {
        setFeaturedArticle(data[0]);
        setRecentArticles(data.slice(1));
      } else {
        setFeaturedArticle(null);
        setRecentArticles([]);
      }
    } catch (err) {
      console.error("Error loading articles:", err);
      setError("Failed to load articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    loadArticles(value, category);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" />
        <Text style={{ display: "block", marginTop: "16px" }}>
          Loading latest news...
        </Text>
      </div>
    );
  }

  return (
    <Layout className="site-layout" style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          height: 64,
          display: "flex",
          alignItems: "center",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          padding: "0 24px",
        }}
      >
        <Title
          level={3}
          style={{
            margin: 0,
            color: "#1890ff",
            display: "flex",
            alignItems: "center",
          }}
        >
          Worldwide News
        </Title>
      </Header>

      <Content
        style={{
          padding: "24px",
          paddingTop: 1500,
          marginTop: 64,
          maxWidth: "100%",
        }}
      >
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Input
              placeholder="Search articles..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={(e) =>
                handleSearch((e.target as HTMLInputElement).value)
              }
              size="large"
              allowClear
            />
          </Col>
        </Row>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError("")}
            style={{ marginBottom: 24 }}
          />
        )}
        {featuredArticle && (
          <div
            style={{
              backgroundImage: `url(${
                featuredArticle.urlToImage ||
                "https://via.placeholder.com/800x400"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 12,
              padding: "48px 24px",
              color: "#fff",
              marginBottom: 48,
              minHeight: 320,
              position: "relative",
            }}
          >
            <div
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                padding: 24,
                borderRadius: 8,
                maxWidth: "auto",
              }}
            >
              <Tag color="gold">Featured</Tag>
              <Title level={2} style={{ color: "#fff", marginTop: 8 }}>
                {featuredArticle.title}
              </Title>
              <Paragraph style={{ color: "#ddd" }}>
                {featuredArticle.description || "No description available."}
              </Paragraph>
              <Space size="middle">
                <Text style={{ color: "#fff" }}>
                  <CalendarOutlined /> {formatDate(featuredArticle.publishedAt)}
                </Text>
                <Text style={{ color: "#fff" }}>
                  <UserOutlined /> {featuredArticle.source.name}
                </Text>
              </Space>
              <div style={{ marginTop: 16 }}>
                <Link
                  to={`/article/${encodeURIComponent(featuredArticle.title)}`}
                >
                  <Button type="primary" icon={<EyeOutlined />}>
                    Read Full Article
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 16 }}>
            Recent News
          </Title>
          <Row gutter={[24, 24]}>
            {recentArticles.map((article, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card
                  hoverable
                  style={{ borderRadius: 8 }}
                  cover={
                    article.urlToImage ? (
                      <Image
                        alt={article.title}
                        src={article.urlToImage}
                        height={160}
                        style={{ objectFit: "cover" }}
                        preview={false}
                        fallback="https://via.placeholder.com/300x200?text=No+Image"
                      />
                    ) : null
                  }
                >
                  <Link to={`/article/${encodeURIComponent(article.title)}`}>
                    <Title level={5} style={{ marginBottom: 8 }}>
                      {article.title}
                    </Title>
                    <Paragraph style={{ fontSize: "13px" }}>
                      {article.description || "No description"}
                    </Paragraph>
                    <Space size="small">
                      <Text type="secondary">
                        <CalendarOutlined /> {formatDate(article.publishedAt)}
                      </Text>
                      <Text type="secondary">
                        <UserOutlined /> {article.source.name}
                      </Text>
                    </Space>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};
