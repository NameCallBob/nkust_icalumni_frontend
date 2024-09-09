
import { Container, Row, Col, Carousel, Card, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import "css/product.css"

const ProductPage = () => {
    const navigate = useNavigate();

    // 假資料
    const product = {
        name: "AI 超級智慧手機",
        summary: "這是一款最新型的 AI 驅動智慧手機，具有卓越的性能與先進的技術，滿足所有日常需求。",
        features: [
            "5G 支援和高速處理器",
            "AI 智慧攝影功能",
            "超長續航力的電池",
            "128GB 內建儲存空間"
        ],
        specs: [
            "處理器: Snapdragon 888",
            "顯示螢幕: 6.5 吋 AMOLED",
            "相機: 108MP 主攝像頭",
            "電池: 5000mAh",
            "重量: 180g"
        ],
        price: "$899",
        company: {
            name: "AI 科技公司",
            description: "AI 科技公司致力於智能硬體的創新和開發，產品涵蓋了手機、智慧家居、和穿戴設備。"
        },
        images: [
            "https://via.placeholder.com/800x400?text=產品圖片1",
            "https://via.placeholder.com/800x400?text=產品圖片2",
            "https://via.placeholder.com/800x400?text=產品圖片3"
        ]
    };

    return (
        <Container className="product-page my-5">
            {/* 產品照片 (輪播) */}
            <Row className="justify-content-center">
                <Col xs={12} md={8}>
                    <Carousel className="product-carousel">
                        {product.images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={image}
                                    alt={`產品圖片${index + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
            </Row>

            {/* 產品名稱 */}
            <Row className="mt-4">
                <Col>
                    <h1 className="text-center fade-in">{product.name}</h1>
                </Col>
            </Row>

            {/* 產品簡介 */}
            <Row className="mt-4">
                <Col xs={12} md={8} className="mx-auto">
                    <Card className="shadow-lg fade-in">
                        <Card.Body>
                            <Card.Title>產品簡介</Card.Title>
                            <Card.Text>
                                {product.summary}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 產品介紹 */}
            <Row className="mt-4">
                <Col xs={12} md={8} className="mx-auto">
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>產品特色</Accordion.Header>
                            <Accordion.Body>
                                <ul>
                                    {product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>規格參數</Accordion.Header>
                            <Accordion.Body>
                                <ul>
                                    {product.specs.map((spec, index) => (
                                        <li key={index}>{spec}</li>
                                    ))}
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>

            {/* 預計價格 */}
            <Row className="mt-4">
                <Col>
                    <h4 className="text-center bounce-in">預計價格: {product.price}</h4>
                </Col>
            </Row>

            {/* 公司資訊 */}
            <Row className="mt-4">
                <Col xs={12} md={8} className="mx-auto">
                    <Card className="shadow-lg slide-in">
                        <Card.Body>
                            <Card.Title>公司資訊</Card.Title>
                            <Card.Text>
                                {product.company.description}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* 回上一頁按鈕 */}
            <Row className="mt-4">
                <Col>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)} // 回上一頁
                    >
                        回上一頁
                    </button>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductPage;
