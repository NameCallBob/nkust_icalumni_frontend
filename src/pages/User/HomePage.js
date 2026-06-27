import React from "react";
import LoadingSpinner from "components/LoadingSpinner";
import Slide from "components/User/Home/Slide";
import News from "components/User/Home/News";
import Company from "components/User/Home/Company";
import SimpleAutoCarousel from "components/User/Home/SimpleAutoCarousel";
import CategoryDropdown from "components/User/Home/dropdown";
import SearchBar from "components/User/Home/SearchBar";
import CompanyTabsSearch from "components/User/Home/CompanySearch";
import TechBackground from "components/TechBackground";
import { Section } from "components/common/ui";
import SEO from "SEO";

function Home() {


    return (
        <>
        {/* 科技感背景動畫 - 已停用，使用企業專業風格 */}
        {/* <TechBackground /> */}

        <SEO
        main={true}
        title="首頁"
        description="國立高雄科技大學智慧商務系系友會官方網站 - 提供系友交流、產品查詢、職涯媒合、產學合作等多元服務。加入系友會，拓展人脈網絡，共創商機！"
        keywords={["國立高雄科技大學", "智慧商務系", "系友會", "NKUST", "智商系友會", "產品查詢", "職缺媒合", "產學合作", "校友網絡", "人才招募"]}
        url="https://nkusticalumni.org/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://nkusticalumni.org/#webpage",
          "url": "https://nkusticalumni.org/",
          "name": "國立高雄科技大學 智慧商務系系友會 | 首頁",
          "isPartOf": {
            "@id": "https://nkusticalumni.org/#website"
          },
          "about": {
            "@id": "https://nkusticalumni.org/#organization"
          },
          "description": "國立高雄科技大學智慧商務系系友會官方網站，提供系友交流、產品查詢、職涯媒合等服務",
          "breadcrumb": {
            "@id": "https://nkusticalumni.org/#breadcrumb"
          },
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://nkusticalumni.org/search?q={search_term_string}"
              },
              "query-input": {
                "@type": "PropertyValueSpecification",
                "valueRequired": "http://schema.org/True",
                "valueName": "search_term_string"
              }
            }
          ]
        }}
        />
        <div className="min-h-screen bg-base-200/40">

            {/* 搜尋區：深藍漸層形象帶 */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a]">
                <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
                <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
                    <div className="text-center mb-8">
                        <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-secondary uppercase">
                            NKUST · Intelligent Commerce Alumni
                        </p>
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                            智慧商務系系友會
                        </h1>
                        <p className="mt-4 text-sm sm:text-base text-white/70 max-w-2xl mx-auto break-words">
                            連結系友、媒合商機，探索系友企業與精選產品。
                        </p>
                    </div>

                    {/* 產業別 + 搜尋列 */}
                    <div className="mx-auto max-w-4xl rounded-2xl bg-white/95 backdrop-blur p-3 sm:p-4 shadow-2xl ring-1 ring-white/20">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                            <div className="md:col-span-4">
                                {/* 產業別 */}
                                <CategoryDropdown></CategoryDropdown>
                            </div>
                            <div className="md:col-span-8">
                                <SearchBar></SearchBar>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">

                {/* 照片輪播 */}
                <div className="mt-8 sm:mt-10">
                    <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-base-300/60">
                        <Slide></Slide>
                    </div>
                </div>

                {/* 最新消息（標題由 News 元件自帶） */}
                <div className="mt-12 sm:mt-16">
                    <News></News>
                </div>

                {/* 系友企業 */}
                <Section title="系友企業" eyebrow="Featured Companies" width="full" className="!px-0">
                    <Company></Company>
                </Section>

                {/* 公司類別 */}
                <Section title="公司類別" eyebrow="Categories" width="full" className="!px-0 !pt-0">
                    <CompanyTabsSearch></CompanyTabsSearch>
                </Section>

                {/* 精選產品輪播（標題由 SimpleAutoCarousel 自帶） */}
                <div className="pb-16 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-2xl bg-base-100 p-4 sm:p-5 shadow-sm ring-1 ring-base-300/60">
                            <SimpleAutoCarousel title={"最新上架"}></SimpleAutoCarousel>
                        </div>
                        <div className="rounded-2xl bg-base-100 p-4 sm:p-5 shadow-sm ring-1 ring-base-300/60">
                            <SimpleAutoCarousel title={"最多點閱"}></SimpleAutoCarousel>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </>
    )
}

export default Home