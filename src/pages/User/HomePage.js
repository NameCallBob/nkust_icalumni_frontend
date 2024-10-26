import React from "react";
import LoadingSpinner from "components/LoadingSpinner";
import {Container , Row , Col} from "react-bootstrap";
import Slide from "components/User/Home/Slide";
import News from "components/User/Home/News";
import Company from "components/User/Home/Company";
import VerticalCarousel from "components/User/Home/VerticalSlide";
import CategoryDropdown from "components/User/Home/dropdown";
import SearchBar from "components/User/Home/SearchBar";
import CompanyTabsSearch from "components/User/Home/CompanySearch";

function Home() {


    return (
        <>
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
            <h3>公司類別</h3>
            <Row>
                <Col>
                <CompanyTabsSearch></CompanyTabsSearch>
                </Col>
            </Row>
            {/* 垂直輪播 */}
            <Row className="d-flex flex-column flex-md-row mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                    <VerticalCarousel title={"最新上架"}></VerticalCarousel>
                </Col>
                <Col md={6}>
                    <VerticalCarousel title={"最多點閱"}></VerticalCarousel>
                </Col>
            </Row>
            <Row>
                <Col>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col >
                    {/* 公司介紹 */}
                    <Company></Company>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default Home