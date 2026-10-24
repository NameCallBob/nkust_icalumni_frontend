import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from 'components/common/ui';
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';

const FeaturedAlumni = ({ featuredAlumni }) => {
    const itemsPerPage = 6; // 每頁顯示6個
    const [currentPage, setCurrentPage] = useState(1); // 當前頁數

    // 根據 sort_order 欄位排序（由小到大）
    const sortedAlumni = [...featuredAlumni].sort((a, b) => {
        const orderA = a.sort_order ?? 999;
        const orderB = b.sort_order ?? 999;
        return orderA - orderB;
    });

    // 計算分頁的範圍
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAlumni = sortedAlumni.slice(startIndex, startIndex + itemsPerPage);

    // 處理頁面切換
    const handleNextPage = () => {
        if (currentPage < Math.ceil(sortedAlumni.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {currentAlumni.map((alumni) => (
                    <article
                        key={alumni.id}
                        onClick={() => (window.location.href = `/alumni/${alumni.member}`)}
                        className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1e3a8a]/30 hover:shadow-xl cursor-pointer"
                    >
                        {/* 左側金色裝飾線 */}
                        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#a0781c] to-[#1e3a8a] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* 人物照片 */}
                        <div className="relative w-full sm:w-44 lg:w-48 shrink-0 overflow-hidden bg-slate-100">
                            <div className="aspect-[4/3] sm:aspect-auto sm:h-full">
                                <img
                                    src={getImageSrc(alumni.photo, 'avatar')}
                                    alt={alumni.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => handleImageError(e, 'avatar')}
                                />
                            </div>
                            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f172a]/30 to-transparent" />
                        </div>

                        {/* 內容 */}
                        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                            <div>
                                <h2 className="font-serif text-xl font-bold text-[#0f172a] break-words">
                                    {alumni.name}
                                    {alumni?.position?.title && (
                                        <span className="ml-2 align-middle text-sm font-medium text-[#a0781c]">
                                            {alumni.position.title}
                                        </span>
                                    )}
                                </h2>
                                {/* 強調的成就 */}
                                {alumni.achievements && (
                                    <p className="mt-1.5 text-sm font-semibold text-[#1e3a8a] break-words">
                                        {alumni.achievements}
                                    </p>
                                )}
                            </div>

                            {/* 可滾動的亮點描述 */}
                            <p className="max-h-24 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-sm leading-relaxed text-slate-600 break-words">
                                {alumni.highlight}
                            </p>

                            <div className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-medium text-[#1e3a8a] opacity-70 transition-opacity group-hover:opacity-100">
                                查看系友介紹
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {sortedAlumni.length > itemsPerPage && (
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        上一頁
                    </Button>
                    <span className="text-sm font-medium text-slate-500">
                        第 {currentPage} / {Math.ceil(sortedAlumni.length / itemsPerPage)} 頁
                    </span>
                    <Button
                        variant="primary"
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(sortedAlumni.length / itemsPerPage)}
                    >
                        下一頁
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FeaturedAlumni;
