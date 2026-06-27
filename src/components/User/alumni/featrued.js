import React, { useState } from 'react';
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
            <div className="grid grid-cols-12 gap-4 mb-4">
                {currentAlumni.map((alumni) => (
                    <div key={alumni.id} className="col-span-12 md:col-span-6 mb-4">
                        <div
                            className="card card-bordered card-side h-full shadow cursor-pointer flex-row"
                            onClick={() => (window.location.href = `/alumni/${alumni.member}`)}
                        >
                            <img
                                src={getImageSrc(alumni.photo, 'avatar')}
                                alt={alumni.name}
                                className="object-cover rounded-l-lg"
                                style={{ width: '200px', height: '200px' }}
                                onError={(e) => handleImageError(e, 'avatar')}
                            />
                            <div className="card-body">
                                <h2 className="card-title">
                                    {alumni.name}&nbsp;{alumni?.position?.title}
                                </h2>
                                {/* 強調的成就 */}
                                <p className="font-bold text-primary">
                                    {alumni.achievements}
                                </p>
                                {/* 可滾動的亮點描述 */}
                                <p
                                    className="overflow-y-auto border border-base-300 rounded p-1.5 bg-base-200"
                                    style={{ maxHeight: '80px' }}
                                >
                                    {alumni.highlight}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {sortedAlumni.length > itemsPerPage && (
                <div className="flex justify-between">
                    <Button
                        variant="primary"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        上一頁
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(sortedAlumni.length / itemsPerPage)}
                    >
                        下一頁
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FeaturedAlumni;
