import { Container, Spinner, Alert } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import Axios from 'common/Axios';

const HTMLContentLoader = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHTMLContent = async () => {
      try {
        setIsLoading(true);
        // 替換成你的後端 API 端點
        const response = await Axios().get('');

        // 使用 DOMPurify 淨化 HTML 內容以防止 XSS 攻擊
        const sanitizedHTML = DOMPurify.sanitize(response.data);
        setContent(sanitizedHTML);
        setIsLoading(false);
      } catch (err) {
        setError('載入內容時發生錯誤');
        setIsLoading(false);
        console.error('Error fetching HTML content:', err);
      }
    };

    fetchHTMLContent();
  }, []);

  if (isLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">載入中...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      {/* 使用 dangerouslySetInnerHTML 渲染淨化後的 HTML */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Container>
  );
};

export default HTMLContentLoader;