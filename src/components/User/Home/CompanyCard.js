import React, { useState } from "react";
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';
import { Button, Badge } from '../../common/ui';
import { GraduationCap, ArrowRight } from 'lucide-react';

const CompanyCard = ({ company }) => {
    // 使用狀態追蹤卡片是否被懸停
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10 hover:border-slate-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`${company.name}公司卡片`}
        >
            {/* 校友標籤 */}
            {company.alumni && (
                <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#1e3a8a] shadow-sm ring-1 ring-black/5 backdrop-blur transition-transform duration-300 group-hover:scale-105">
                    <GraduationCap className="h-3.5 w-3.5 text-[#a0781c]" />
                    <span className="max-w-[120px] truncate">{company.alumni}</span>
                </div>
            )}

            {/* 公司圖片 */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                    src={getImageSrc(company.imageUrl, 'company')}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={`${company.name}公司圖片`}
                    onError={(e) => handleImageError(e, 'company')}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/15 to-transparent" />
            </div>

            <div className="flex flex-1 flex-col p-5">
                {/* 公司名稱 */}
                <h5 className="font-serif text-lg font-semibold leading-snug text-[#0f172a] transition-colors duration-300 group-hover:text-[#1e3a8a] line-clamp-1">
                    {company.name}
                </h5>

                {/* 公司描述 */}
                <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-3">
                    {company.description}
                </p>

                {/* 產品信息 */}
                <p className="mt-3 text-sm text-slate-600 line-clamp-1">
                    <span className="font-medium text-[#0f172a]">產品製作：</span>
                    {company.product}
                </p>

                {/* 按鈕區域 */}
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <Badge variant="primary">
                        {company.category || "企業"}
                    </Badge>
                    <Button
                        variant="primary"
                        size="sm"
                        className="gap-1 rounded-lg"
                        aria-label={`瞭解更多關於${company.name}的信息`}
                    >
                        瞭解更多
                        <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-0.5' : ''}`} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCard;
