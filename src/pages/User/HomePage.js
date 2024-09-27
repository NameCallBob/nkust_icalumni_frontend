import React from "react";
import LoadingSpinner from "components/LoadingSpinner";
import UserNav from "components/User/UserNav";
import {Container , Row , Col} from "react-bootstrap";
import Slide from "components/User/Home/Slide";
import News from "components/User/Home/News";
import Company from "components/User/Home/Company";
import Product from "components/User/Home/Product";
import IconGrid from "components/User/Home/CompanyType";
import VerticalCarousel from "components/User/Home/VerticalSlide";

function Home() {


    return (
        <>
        <Container className="my-3">

            <Row>
                <Col md={4} style={{
                    display:"flex",
                    flexDirection:"column",
                    height:"100%"}}>
                    {/* 最新消息 */}
                    <News></News>
                </Col>
                <Col md={8}>
                    {/* 照片輪播 */}
                    <Slide></Slide>
                </Col>
            </Row>
            <Row>
                <Col>
                <IconGrid></IconGrid>
                </Col>
            </Row>
            {/* 垂直輪播 */}
            <Row className="d-flex flex-column flex-md-row">
                <Col md={6} className="mb-3 mb-md-0">
                    <VerticalCarousel title={"最新上架"}></VerticalCarousel>
                </Col>
                <Col md={6}>
                    <VerticalCarousel title={"最多點閱"}></VerticalCarousel>
                </Col>
            </Row>
            <Row>
                <Col >
                    {/* 公司介紹 */}
                    <Company></Company>
                </Col>
            </Row>

            <Row>
                <Col >
                    {/* 產品 */}
                    <Product></Product>
                </Col>
            </Row>

        </Container>
        </>
    )
}

export default Home