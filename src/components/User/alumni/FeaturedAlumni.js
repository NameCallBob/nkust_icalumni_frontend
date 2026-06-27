import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Row, Col } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaArrowRight, FaStar, FaAward, FaQuoteLeft } from 'react-icons/fa';
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';
import styles from './FeaturedAlumni.module.css';

const FeaturedAlumni = ({ featuredAlumni }) => {
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    // 計算分頁的範圍
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAlumni = featuredAlumni.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(featuredAlumni.length / itemsPerPage);

    // 處理頁面切換
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 動畫變體
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    if (!featuredAlumni || featuredAlumni.length === 0) {
        return (
            <div className={styles.emptyState}>
                <h3>目前沒有傑出系友資料</h3>
                <p>我們正在努力收集更多優秀系友的精彩故事，敬請期待！</p>
            </div>
        );
    }

    return (
        <div className={styles.featuredContainer}>
            {/* 區塊分隔裝飾 */}
            {/* <div className={styles.sectionDivider}> */}
                {/* <h2 className={styles.sectionTitle}>校友風采</h2> */}
            {/* </div> */}

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <Row className="g-3">
                        {currentAlumni.map((alumni, index) => (
                            <Col key={alumni.id} lg={6} md={6} sm={12} xs={12}>
                                <motion.div
                                    className={styles.outstandingCard}
                                    variants={cardVariants}
                                    whileHover={{
                                        y: -8,
                                        transition: { duration: 0.3 }
                                    }}
                                    onClick={() => (window.location.href = `/alumni/${alumni.member}`)}
                                >
                                    {/* 金色榮耀邊框 */}
                                    <div className={styles.goldenBorder}></div>

                                    {/* 榮耀徽章 */}
                                    {/* <div className={styles.honorBadge}>
                                        <FaStar className={styles.crownIcon} />
                                    </div> */}

                                    <div className={`${styles.cardContent} row g-0`}>
                                        {/* 圖片區域 - 左側 */}
                                        <div className="col-4">
                                            <div className={styles.imageSection}>
                                                <img
                                                    src={getImageSrc(alumni.photo, 'avatar')}
                                                    alt={alumni.name}
                                                    className={styles.profileImage}
                                                    onError={(e) => handleImageError(e, 'avatar')}
                                                />
                                                <div className={styles.imageOverlay}></div>
                                                <div className={styles.goldenGlow}></div>
                                            </div>
                                        </div>

                                        {/* 內容區域 - 右側 */}
                                        <div className="col-8">
                                            <div className={styles.contentSection}>
                                                <div className={styles.contentWrapper}>
                                                    <h3 className={styles.alumniName}>
                                                        {alumni.name}
                                                    </h3>
                                                    <div className={styles.alumniPosition}>
                                                        {alumni?.position?.title || '職位未提供'}
                                                    </div>

                                                    {alumni.achievements && (
                                                        <div className={styles.achievements}>
                                                            <FaAward className={styles.achievementIcon} />
                                                            <span>{alumni.achievements}</span>
                                                        </div>
                                                    )}

                                                    {alumni.highlight && (
                                                        <div className={styles.highlight}>
                                                            <FaQuoteLeft className={styles.quoteIcon} />
                                                            <span>{alumni.highlight}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 查看詳情按鈕 - 固定在內容區域右下角 */}
                                                <Button
                                                    className={styles.viewProfileBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `/alumni/${alumni.member}`;
                                                    }}
                                                    title="查看詳細資訊"
                                                >
                                                    <FaArrowRight />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </motion.div>
            </AnimatePresence>

            {/* 分頁控制 */}
            {totalPages > 1 && (
                <motion.div
                    className={styles.paginationContainer}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button
                        className={styles.paginationBtn}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft />
                        上一頁
                    </Button>

                    <div className={styles.paginationInfo}>
                        第 {currentPage} 頁，共 {totalPages} 頁
                    </div>

                    <Button
                        className={styles.paginationBtn}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        下一頁
                        <FaChevronRight />
                    </Button>
                </motion.div>
            )}

            {/* 區塊分隔裝飾 - 底部 */}
            <div className={styles.sectionDivider} style={{ marginTop: '2.5rem' }}>
                <div style={{
                    position: 'relative',
                    background: 'transparent',
                    padding: '0 2rem',
                    fontSize: '1rem',
                    color: '#a0781c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <FaStar style={{ color: '#d4af37', opacity: 0.8 }} />
                    <FaStar style={{ color: '#d4af37', opacity: 0.8 }} />
                    <FaStar style={{ color: '#d4af37', opacity: 0.8 }} />
                </div>
            </div>
        </div>
    );
};

export default FeaturedAlumni;