import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Search, Users, Briefcase, UserPlus } from 'lucide-react';
import './HeroSection.css';

/**
 * Hero Section 組件 - 展示系友會核心價值主張
 * 包含主要功能入口和視覺引導
 */
function HeroSection() {
    return (
        <section className="hero-section">
            <Container>
                <Row className="align-items-center min-vh-75">
                    <Col lg={6} className="hero-content">
                        <div className="hero-badges">
                            <div className="hero-badge hero-badge-university">
                                <span>國立高雄科技大學</span>
                            </div>
                            <div className="hero-badge hero-badge-nkust">
                                <span>NKUST</span>
                            </div>
                        </div>
                        <h1 className="hero-title">
                            智慧商務系
                            <span className="hero-highlight">系友會</span>
                        </h1>
                        <p className="hero-subtitle">
                            連結校友力量，創造無限商機
                        </p>
                        <p className="hero-description">
                            專業的校友網絡平台，提供企業合作、人才媒合、職涯發展等多元服務，
                            讓每一位系友都能在商業世界中發光發熱。
                        </p>

                        {/* 核心功能快速入口 */}
                        <div className="hero-actions">
                            <Row className="g-3">
                                <Col sm={6}>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        href="/search"
                                        className="hero-btn hero-btn-primary w-100"
                                    >
                                        <Search size={20} className="me-2" />
                                        公司查詢
                                    </Button>
                                </Col>
                                <Col sm={6}>
                                    <Button
                                        variant="outline-primary"
                                        size="lg"
                                        href="/recruit"
                                        className="hero-btn hero-btn-outline w-100"
                                    >
                                        <Briefcase size={20} className="me-2" />
                                        徵才啟示
                                    </Button>
                                </Col>
                                <Col sm={6}>
                                    <Button
                                        variant="outline-secondary"
                                        size="lg"
                                        href="/alumnilist"
                                        className="hero-btn hero-btn-outline w-100"
                                    >
                                        <Users size={20} className="me-2" />
                                        系友名錄
                                    </Button>
                                </Col>
                                <Col sm={6}>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        href="/IC/joinUs"
                                        className="hero-btn hero-btn-secondary w-100"
                                    >
                                        <UserPlus size={20} className="me-2" />
                                        加入我們
                                    </Button>
                                </Col>
                            </Row>
                        </div>

                        {/* 統計數據 */}
                        <div className="hero-stats">
                            <Row className="text-center">
                                <Col xs={4}>
                                    <div className="stat-item">
                                        <div className="stat-number">500+</div>
                                        <div className="stat-label">系友企業</div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="stat-item">
                                        <div className="stat-number">1000+</div>
                                        <div className="stat-label">系友會員</div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="stat-item">
                                        <div className="stat-number">50+</div>
                                        <div className="stat-label">合作機會</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    <Col lg={6} className="hero-visual">
                        <div className="hero-image-container">
                            <div className="hero-floating-card card-1">
                                <div className="card-icon">
                                    <Search size={24} />
                                </div>
                                <div className="card-text">
                                    <h6>智慧搜尋</h6>
                                    <p>快速找到合作夥伴</p>
                                </div>
                            </div>

                            <div className="hero-floating-card card-2">
                                <div className="card-icon">
                                    <Users size={24} />
                                </div>
                                <div className="card-text">
                                    <h6>人脈網絡</h6>
                                    <p>連結系友力量</p>
                                </div>
                            </div>

                            <div className="hero-floating-card card-3">
                                <div className="card-icon">
                                    <Briefcase size={24} />
                                </div>
                                <div className="card-text">
                                    <h6>職涯媒合</h6>
                                    <p>創造就業機會</p>
                                </div>
                            </div>

                            <div className="hero-background-shape"></div>
                            <div className="hero-background-dots"></div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default HeroSection;