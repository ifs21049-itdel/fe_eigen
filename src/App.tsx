import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import { ArticleList } from "./components/ArticleList";
import { ArticleDetail } from "./components/ArticleDetail";

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content>
        <Router>
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/article/:title" element={<ArticleDetail />} />
          </Routes>
        </Router>
      </Content>
    </Layout>
  );
}

export default App;
