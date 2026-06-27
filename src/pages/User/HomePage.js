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
        <div className="container mx-auto px-4 my-3">

            <div className="grid grid-cols-12 gap-4 my-2 items-center">
                <div className="col-span-12 md:col-span-3 my-1">
                    {/* 產業別 */}
                    <CategoryDropdown></CategoryDropdown>
                </div>
                <div className="col-span-12 md:col-span-9">
                    <SearchBar></SearchBar>
                </div>
            </div>
            <div>
                {/* 照片輪播 */}
                <Slide></Slide>
            </div>
            <div>
                {/* 最新消息 */}
                <News></News>
            </div>
            <div className="mb-4">
                {/* 公司介紹 */}
                <div className="flex justify-between items-center mb-3">
                    <h3 style={{ color: '#1e3a8a', fontWeight: '700', borderLeft: '4px solid #1e3a8a', paddingLeft: '0.75rem', margin: 0 }}>系友企業</h3>
                </div>
                <Company></Company>
            </div>
            <h3 style={{ color: '#1e3a8a', fontWeight: '700', borderLeft: '4px solid #1e3a8a', paddingLeft: '0.75rem', marginBottom: '1rem' }}>公司類別</h3>
            <div>
                <CompanyTabsSearch></CompanyTabsSearch>
            </div>
            {/* 簡單自動輪播 */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="w-full md:w-1/2 mb-3 mb-md-0">
                    <SimpleAutoCarousel title={"最新上架"}></SimpleAutoCarousel>
                </div>
                <div className="w-full md:w-1/2">
                    <SimpleAutoCarousel title={"最多點閱"}></SimpleAutoCarousel>
                </div>
            </div>

        </div>
        </>
    )
}

export default Home