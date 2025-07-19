import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Image,
  Tag,
  Space,
  Spin,
  Alert,
  Row,
  Col,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import type { Article } from "../types/news";
import { fetchArticleById } from "../services/newsApi";

const { Title, Text, Paragraph } = Typography;

export const ArticleDetail = () => {
  const { title } = useParams<{ title: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadArticle = async () => {
      if (title) {
        setLoading(true);
        setError("");

        try {
          const data = await fetchArticleById(decodeURIComponent(title));

          if (data) {
            setArticle(data);
          } else {
            setError("Article not found");
          }
        } catch (err) {
          console.error("Error loading article:", err);
          setError("Failed to load article. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadArticle();
  }, [title]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <Spin size="large" />
        <Text style={{ display: "block", marginTop: "16px" }}>
          Loading article...
        </Text>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{ margin: "0 auto", padding: "40px 20px" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: "24px" }}
        >
          Back to Articles
        </Button>

        <Alert
          message={error || "Article not found"}
          description="The article you're looking for might have been removed or doesn't exist."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ margin: "0 auto", padding: "30px" }}>
      <div style={{ padding: "50px" }}>
        {/* Article Image */}
        {article.urlToImage && (
          <Image
            src={article.urlToImage}
            alt={article.title}
            width="100%"
            height={400}
            style={{
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          />
        )}

        {/* Article Title */}
        <Title level={1} style={{ marginBottom: "16px" }}>
          {article.title}
        </Title>

        {/* Article Meta Information */}
        <Row gutter={[16, 8]} style={{ marginBottom: "16px" }}>
          <Col>
            <Space>
              <CalendarOutlined />
              <Text type="secondary">{formatDate(article.publishedAt)}</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <UserOutlined />
              <Text type="secondary">{article.author || "Unknown Author"}</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <GlobalOutlined />
              <Text type="secondary">{article.source.name}</Text>
            </Space>
          </Col>
        </Row>

        {/* Source Tag */}
        <Tag color="blue" style={{ marginBottom: "24px" }}>
          {article.source.name}
        </Tag>

        <Divider />

        {/* Article Description */}
        {article.description && (
          <Paragraph
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              marginBottom: "24px",
              fontWeight: 500,
              color: "#595959",
            }}
          >
            {article.description}
          </Paragraph>
        )}

        {/* Article Content */}
        {article.content && (
          <Paragraph
            style={{
              fontSize: "16px",
              lineHeight: "1.8",
              marginBottom: "32px",
            }}
          >
            {article.content}
          </Paragraph>
        )}

        {/* Action Buttons */}
        <Space size="large" style={{ marginTop: "32px" }}>
          <Button
            type="primary"
            size="large"
            icon={<LinkOutlined />}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Full Article
          </Button>

          <Button
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
          >
            Back to Article
          </Button>
        </Space>
      </div>
    </div>
  );
};
