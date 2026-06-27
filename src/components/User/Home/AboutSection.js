import React from 'react';
import { FileText, Users, UserPlus, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Section, Card } from 'components/common/ui';

/**
 * 系友會介紹卡片式布局組件
 * 替代原本的下拉選單，提供更直觀的導航體驗
 */
function AboutSection() {
    const aboutCards = [
        {
            id: 'intro',
            title: '系友會簡介',
            description: '了解智慧商務系系友會的成立宗旨、發展歷程與未來願景',
            icon: FileText,
            link: '/IC/intro',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            details: ['成立宗旨', '發展歷程', '組織願景', '核心價值']
        },
        {
            id: 'constitution',
            title: '系友會章程',
            description: '查閱系友會組織章程、運作規則與相關規範',
            icon: FileText,
            link: '/IC/constitution',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            details: ['組織章程', '運作規則', '會員權利', '義務規範']
        },
        {
            id: 'structure',
            title: '組織架構',
            description: '認識系友會組織架構、幹部成員與各部門職責',
            icon: Users,
            link: '/IC/structure',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            details: ['組織架構', '幹部介紹', '部門職責', '聯絡方式']
        },
        {
            id: 'join',
            title: '入會方式',
            description: '了解如何加入系友會，享受專屬會員服務與權益',
            icon: UserPlus,
            link: '/IC/joinUs',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            details: ['入會條件', '申請流程', '會員權益', '費用說明']
        },
        {
            id: 'contact',
            title: '聯絡我們',
            description: '歡迎聯絡系友會，我們竭誠為您服務',
            icon: MessageCircle,
            link: '/IC/contactUs',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            details: ['聯絡資訊', '服務時間', '常見問題', '意見回饋']
        }
    ];

    return (
        <div id="about" className="bg-base-200/40">
            <Section
                eyebrow="About Us"
                title="關於系友會"
                subtitle="深入了解智慧商務系系友會，探索我們的理念與服務"
                center
                width="wide"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aboutCards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <Card
                                key={card.id}
                                hover
                                padding="none"
                                className="group flex flex-col overflow-hidden"
                            >
                                {/* 深藍卡頭 */}
                                <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] px-6 pt-7 pb-6">
                                    <div className="absolute right-5 top-5 h-16 w-16 rounded-full bg-white/5 blur-xl" />
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-secondary ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105">
                                            <IconComponent size={28} />
                                        </span>
                                        <h3 className="font-serif text-xl font-bold text-white">
                                            {card.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* 內容 */}
                                <div className="flex flex-1 flex-col p-6">
                                    <p className="text-sm leading-relaxed text-base-content/70 break-words">
                                        {card.description}
                                    </p>

                                    <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2.5">
                                        {card.details.map((detail, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-center gap-1.5 text-sm text-base-content/80"
                                            >
                                                <CheckCircle2
                                                    size={16}
                                                    className="shrink-0 text-secondary"
                                                />
                                                <span className="truncate">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto pt-6">
                                        <a
                                            href={card.link}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-content"
                                        >
                                            了解更多
                                            <ArrowRight
                                                size={16}
                                                className="transition-transform group-hover:translate-x-0.5"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* 快速聯絡區域 */}
                <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] shadow-lg">
                    <div className="flex flex-col items-center gap-6 px-6 py-8 sm:px-10 md:flex-row md:justify-between">
                        <div className="text-center md:text-left">
                            <h4 className="font-serif text-2xl font-bold text-white">
                                有任何問題嗎？
                            </h4>
                            <p className="mt-2 text-sm text-white/70">
                                歡迎隨時聯絡我們，系友會團隊將竭誠為您服務
                            </p>
                        </div>
                        <a
                            href="/IC/contactUs"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-secondary px-7 py-3 text-base font-semibold text-secondary-content shadow-md transition-transform hover:scale-105"
                        >
                            <MessageCircle size={20} />
                            立即聯絡
                        </a>
                    </div>
                </div>
            </Section>
        </div>
    );
}

export default AboutSection;
