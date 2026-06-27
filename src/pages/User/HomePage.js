import React from "react";
import LoadingSpinner from "components/LoadingSpinner";
import {Container , Row , Col, Button} from "react-bootstrap";
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
        <Container className="my-3">

            <Row className="my-2 d-flex align-items-center">
                <Col md={3} className="my-1">
                    {/* 產業別 */}
                    <CategoryDropdown></CategoryDropdown>
                </Col>
                <Col md={9} >
                    <SearchBar></SearchBar>
                </Col>
            </Row>
            <Row>
                <Col>
                    {/* 照片輪播 */}
                    <Slide></Slide>
                </Col>
            </Row>
            <Row>
                <Col>
                    {/* 最新消息 */}
                    <News></News>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col >
                    {/* 公司介紹 */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 style={{ color: '#1e3a8a', fontWeight: '700', borderLeft: '4px solid #1e3a8a', paddingLeft: '0.75rem', margin: 0 }}>系友企業</h3>
                    </div>
                    <Company></Company>
                </Col>
            </Row>
            <h3 style={{ color: '#1e3a8a', fontWeight: '700', borderLeft: '4px solid #1e3a8a', paddingLeft: '0.75rem', marginBottom: '1rem' }}>公司類別</h3>
            <Row>
                <Col>
                <CompanyTabsSearch></CompanyTabsSearch>
                </Col>
            </Row>
            {/* 簡單自動輪播 */}
            <Row className="d-flex flex-column flex-md-row mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                    <SimpleAutoCarousel title={"最新上架"}></SimpleAutoCarousel>
                </Col>
                <Col md={6}>
                    <SimpleAutoCarousel title={"最多點閱"}></SimpleAutoCarousel>
                </Col>
            </Row>

        </Container>
        </>
    )
}

export default Home