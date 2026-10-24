import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaArrowRight, FaStar, FaAward, FaQuoteLeft } from 'react-icons/fa';
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';
import { EmptyState, Button } from '../../common/ui';

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
            <EmptyState
                icon={<FaStar className="h-7 w-7 text-[#a0781c]" />}
                title="目前沒有傑出系友資料"
                description="我們正在努力收集更多優秀系友的精彩故事，敬請期待！"
            />
        );
    }

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {currentAlumni.map((alumni) => (
                            <motion.div
                                key={alumni.id}
                                variants={cardVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                onClick={() => (window.location.href = `/alumni/${alumni.member}`)}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                            >
                                {/* 金色榮耀邊條 */}
                                <span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#a0781c] via-[#d4af37] to-[#a0781c]" />

                                <div className="flex items-stretch gap-4 p-4 pl-6 sm:gap-6 sm:p-6 sm:pl-8">
                                    {/* 圖片區域 - 左側 */}
                                    <div className="shrink-0">
                                        <div className="relative h-24 w-24 overflow-hidden rounded-xl ring-2 ring-[#a0781c]/30 shadow-md sm:h-28 sm:w-28">
                                            <img
                                                src={getImageSrc(alumni.photo, 'avatar')}
                                                alt={alumni.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => handleImageError(e, 'avatar')}
                                            />
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f172a]/30 to-transparent" />
                                        </div>
                                    </div>

                                    {/* 內容區域 - 右側 */}
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <div className="min-w-0 flex-1 pr-8">
                                            <h3 className="font-serif text-lg font-bold text-[#1e3a8a] sm:text-xl truncate">
                                                {alumni.name}
                                            </h3>
                                            <div className="mt-1 inline-flex max-w-full items-center rounded-md bg-[#1e3a8a]/5 px-2 py-0.5 text-sm font-medium text-[#1e3a8a]/80">
                                                <span className="truncate">{alumni?.position?.title || '職位未提供'}</span>
                                            </div>

                                            {alumni.achievements && (
                                                <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                                                    <FaAward className="mt-0.5 shrink-0 text-[#a0781c]" />
                                                    <span className="break-words line-clamp-2">{alumni.achievements}</span>
                                                </div>
                                            )}

                                            {alumni.highlight && (
                                                <div className="mt-2 flex items-start gap-2 text-sm italic text-slate-500">
                                                    <FaQuoteLeft className="mt-0.5 shrink-0 text-[#a0781c]/60" />
                                                    <span className="break-words line-clamp-2">{alumni.highlight}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 查看詳情按鈕 */}
                                        <button
                                            type="button"
                                            className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a8a] text-white shadow-md transition-all duration-300 hover:bg-[#0f172a] group-hover:translate-x-0.5 sm:bottom-6 sm:right-6"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/alumni/${alumni.member}`;
                                            }}
                                            title="查看詳細資訊"
                                        >
                                            <FaArrowRight />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* 分頁控制 */}
            {totalPages > 1 && (
                <motion.div
                    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button
                        variant="outline"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft className="mr-1.5" />
                        上一頁
                    </Button>

                    <div className="text-sm font-medium text-slate-500">
                        第 <span className="text-[#1e3a8a]">{currentPage}</span> 頁，共 {totalPages} 頁
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        下一頁
                        <FaChevronRight className="ml-1.5" />
                    </Button>
                </motion.div>
            )}

            {/* 區塊分隔裝飾 - 底部 */}
            <div className="mt-10 flex items-center justify-center gap-3">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#a0781c]/40" />
                <FaStar className="text-[#d4af37]/80" />
                <FaStar className="text-[#d4af37]/80" />
                <FaStar className="text-[#d4af37]/80" />
                <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#a0781c]/40" />
            </div>
        </div>
    );
};

export default FeaturedAlumni;
