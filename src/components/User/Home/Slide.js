import {Carousel} from "react-bootstrap";

// Test Pic
import image1 from "assets/slide/326431594_911615443529376_4304352214119373700_n.jpg"
import image2 from "assets/slide/403151410_742061697959924_82251486996955370_n.jpg"
import image3 from "assets/slide/403953713_742061541293273_382114322976831463_n.jpg"
/**
 * 照片輪播
 */
function Slide(){

    return(
    <div style={{ width: '100%'}}>
        <Carousel>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src={image1}
            alt="First slide"
            style={{  height: '500px', objectFit: 'cover' , margin: '0 auto'}}
            />
            <Carousel.Caption
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                padding: '10px'
            }}>
            <h3>會長交接大合照</h3>

            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src={image2}
            alt="Second slide"
            style={{  height: '500px', objectFit: 'cover' , margin: '0 auto'}}
            />
            <Carousel.Caption
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                padding: '10px'
            }}>
            <h3>校外參訪合照</h3>

            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src={image3}
            alt="Third slide"
            style={{  height: '500px', objectFit: 'cover' , margin: '0 auto'}}
            />
            <Carousel.Caption
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: 'white',
                padding: '10px'
            }}>
            <h4>112年度秋季「企業參訪暨聯誼交流」活動</h4>
            </Carousel.Caption>
        </Carousel.Item>
        </Carousel>
    </div>
    )
}

export default Slide