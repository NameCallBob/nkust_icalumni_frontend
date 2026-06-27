import React from 'react';
import { Search, Users, Briefcase, UserPlus } from 'lucide-react';

/**
 * Hero Section 組件 - 展示系友會核心價值主張
 * 包含主要功能入口和視覺引導
 */
function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#162447] to-[#1e3a8a] text-white">
            {/* 裝飾性背景 */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#1e3a8a] opacity-40 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[#a0781c] opacity-10 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* 左側：文字內容 */}
                    <div className="text-center lg:text-left">
                        <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm">
                                國立高雄科技大學
                            </span>
                            <span className="inline-flex items-center rounded-full bg-[#a0781c] px-4 py-1.5 text-xs font-semibold tracking-widest text-white">
                                NKUST
                            </span>
                        </div>

                        <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            智慧商務系
                            <span className="mt-1 block bg-gradient-to-r from-[#fcd34d] to-[#a0781c] bg-clip-text text-transparent">
                                系友會
                            </span>
                        </h1>

                        <p className="mt-5 text-lg font-medium text-white/90 sm:text-xl">
                            連結校友力量，創造無限商機
                        </p>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70 lg:mx-0">
                            專業的校友網絡平台，提供企業合作、人才媒合、職涯發展等多元服務，
                            讓每一位系友都能在商業世界中發光發熱。
                        </p>

                        {/* 核心功能快速入口 */}
                        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <a
                                href="/search"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#a0781c] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[#b8892a] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#fcd34d] focus:ring-offset-2 focus:ring-offset-[#0f172a]"
                            >
                                <Search size={20} className="transition-transform group-hover:scale-110" />
                                公司查詢
                            </a>
                            <a
                                href="/recruit"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0f172a]"
                            >
                                <Briefcase size={20} className="transition-transform group-hover:scale-110" />
                                徵才啟示
                            </a>
                            <a
                                href="/alumnilist"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0f172a]"
                            >
                                <Users size={20} className="transition-transform group-hover:scale-110" />
                                系友名錄
                            </a>
                            <a
                                href="/IC/joinUs"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#1e3a8a] shadow-lg shadow-black/20 transition hover:bg-[#eef2ff] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0f172a]"
                            >
                                <UserPlus size={20} className="transition-transform group-hover:scale-110" />
                                加入我們
                            </a>
                        </div>

                        {/* 統計數據 */}
                        <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                            <div className="text-center lg:text-left">
                                <div className="font-serif text-3xl font-bold text-white sm:text-4xl">500+</div>
                                <div className="mt-1 text-xs text-white/60 sm:text-sm">系友企業</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="font-serif text-3xl font-bold text-white sm:text-4xl">1000+</div>
                                <div className="mt-1 text-xs text-white/60 sm:text-sm">系友會員</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="font-serif text-3xl font-bold text-white sm:text-4xl">50+</div>
                                <div className="mt-1 text-xs text-white/60 sm:text-sm">合作機會</div>
                            </div>
                        </div>
                    </div>

                    {/* 右側：視覺浮卡 */}
                    <div className="relative hidden min-h-[420px] lg:block">
                        {/* 中央光暈底盤 */}
                        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] shadow-2xl ring-1 ring-white/10" />
                        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a0781c]/30" />

                        {/* 浮動卡片 1 */}
                        <div className="absolute left-0 top-6 flex max-w-[16rem] items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1e3a8a] text-white">
                                <Search size={22} />
                            </div>
                            <div className="min-w-0">
                                <h6 className="font-serif text-sm font-bold text-[#0f172a]">智慧搜尋</h6>
                                <p className="truncate text-xs text-slate-500">快速找到合作夥伴</p>
                            </div>
                        </div>

                        {/* 浮動卡片 2 */}
                        <div className="absolute right-0 top-1/2 flex max-w-[16rem] -translate-y-1/2 items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#a0781c] text-white">
                                <Users size={22} />
                            </div>
                            <div className="min-w-0">
                                <h6 className="font-serif text-sm font-bold text-[#0f172a]">人脈網絡</h6>
                                <p className="truncate text-xs text-slate-500">連結系友力量</p>
                            </div>
                        </div>

                        {/* 浮動卡片 3 */}
                        <div className="absolute bottom-6 left-10 flex max-w-[16rem] items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#0f172a] text-white">
                                <Briefcase size={22} />
                            </div>
                            <div className="min-w-0">
                                <h6 className="font-serif text-sm font-bold text-[#0f172a]">職涯媒合</h6>
                                <p className="truncate text-xs text-slate-500">創造就業機會</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
