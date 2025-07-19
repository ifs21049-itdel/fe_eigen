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
      <div
        style={{ textAlign: "center", padding: "100px 20px", width: "100%" }}
      >
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
          Today's News
        </Title>
      </Header>

      <Content
        style={{
          padding: "24px",
          marginTop: 64,
          maxWidth: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            paddingTop: 1500,
            width: "100%",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              marginBottom: 24,
            }}
          >
            {/* Search Field */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={24} md={14} lg={14}>
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

            {/* Error Alert */}
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

            {/* Title */}
            <div style={{ marginBottom: 24 }}>
              <Title level={4} style={{ marginBottom: 0 }}>
                {searchTerm
                  ? `Search results for "${searchTerm}"`
                  : "Top Headlines"}
              </Title>
              <Text type="secondary">
                Showing {articles.length}{" "}
                {articles.length === 1 ? "article" : "articles"}
              </Text>
            </div>
          </div>

          {/* Articles */}
          {articles.length === 0 ? (
            <Card>
              <Alert
                message="No articles found"
                description="Try adjusting your search terms or check back later for new content."
                type="info"
                showIcon
              />
            </Card>
          ) : (
            <Row gutter={[24, 24]}>
              {articles.map((article, index) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={index}
                  style={{ display: "flex" }}
                >
                  <Card
                    hoverable
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                    }}
                    bodyStyle={{
                      padding: 16,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                    cover={
                      article.urlToImage ? (
                        <div style={{ height: 160, overflow: "hidden" }}>
                          <Image
                            alt={article.title}
                            src={article.urlToImage}
                            height="100%"
                            width="100%"
                            style={{ objectFit: "cover" }}
                            preview={false}
                            fallback="https://via.placeholder.com/300x200?text=No+Image"
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: 160,
                            background: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999",
                          }}
                        >
                          No Image Available
                        </div>
                      )
                    }
                    actions={[
                      <Link
                        to={`/article/${encodeURIComponent(article.title)}`}
                        key="read-more"
                        style={{ width: "100%" }}
                      >
                        <Button
                          type="primary"
                          icon={<EyeOutlined />}
                          size="small"
                          style={{ width: "100%" }}
                        >
                          Read More
                        </Button>
                      </Link>,
                    ]}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Link
                        to={`/article/${encodeURIComponent(article.title)}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Title
                          level={5}
                          style={{
                            marginBottom: 8,
                            fontSize: "16px",
                            lineHeight: "1.4",
                            height: "44px",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {article.title}
                        </Title>
                      </Link>

                      <Paragraph
                        style={{
                          marginBottom: 12,
                          color: "rgba(0, 0, 0, 0.65)",
                          fontSize: "14px",
                          lineHeight: "1.5",
                          height: "63px",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          flex: 1,
                        }}
                      >
                        {article.description || "No description available"}
                      </Paragraph>

                      <div style={{ marginTop: "auto" }}>
                        <Space size={[4, 8]} wrap>
                          <Tag
                            icon={<CalendarOutlined />}
                            style={{ fontSize: "12px" }}
                          >
                            {formatDate(article.publishedAt)}
                          </Tag>
                          <Tag
                            icon={<UserOutlined />}
                            style={{ fontSize: "12px" }}
                          >
                            {article.source.name}
                          </Tag>
                        </Space>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
};
