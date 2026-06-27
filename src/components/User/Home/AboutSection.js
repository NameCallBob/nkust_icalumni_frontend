import React from 'react';
import { FileText, Users, Building, UserPlus, MessageCircle } from 'lucide-react';
import './AboutSection.css';

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
        <section id="about" className="about-section py-5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-12 text-center mb-5">
                    <div className="col-span-12">
                        <div className="section-header">
                            <h2 className="section-title">關於系友會</h2>
                            <p className="section-subtitle">
                                深入了解智慧商務系系友會，探索我們的理念與服務
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {aboutCards.map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                            <div className="col-span-12 md:col-span-6 lg:col-span-4" key={card.id}>
                                <div
                                    className="card card-bordered about-card h-full"
                                    style={{ '--card-gradient': card.gradient }}
                                >
                                    <div className="card-header-custom">
                                        <div className="card-icon">
                                            <IconComponent size={32} />
                                        </div>
                                        <h4 className="card-title">{card.title}</h4>
                                    </div>

                                    <div className="card-body flex flex-col">
                                        <p className="card-description">{card.description}</p>

                                        <ul className="card-features">
                                            {card.details.map((detail, idx) => (
                                                <li key={idx}>{detail}</li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto">
                                            <a
                                                href={card.link}
                                                className="btn card-btn w-full"
                                            >
                                                了解更多
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 快速聯絡區域 */}
                <div className="grid grid-cols-12 mt-5">
                    <div className="col-span-12">
                        <div className="quick-contact-section">
                            <div className="grid grid-cols-12 items-center">
                                <div className="col-span-12 md:col-span-8">
                                    <h4 className="mb-2">有任何問題嗎？</h4>
                                    <p className="mb-0 text-base-content/60">
                                        歡迎隨時聯絡我們，系友會團隊將竭誠為您服務
                                    </p>
                                </div>
                                <div className="col-span-12 md:col-span-4 text-center md:text-right mt-3 md:mt-0">
                                    <a
                                        href="/IC/contactUs"
                                        className="btn btn-primary btn-lg contact-btn"
                                    >
                                        <MessageCircle size={20} className="mr-2" />
                                        立即聯絡
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
