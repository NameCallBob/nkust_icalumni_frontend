import {Carousel} from "react-bootstrap";

/**
 * 照片輪播
 */
function Slide(){

    return(
    <div style={{ width: '100%', margin: '0 auto' }}>
        <Carousel>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=First+Slide"
            alt="First slide"
            />
            <Carousel.Caption>
            <h3>First Slide Label</h3>
            <p>Description for the first slide.</p>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=Second+Slide"
            alt="Second slide"
            />
            <Carousel.Caption>
            <h3>Second Slide Label</h3>
            <p>Description for the second slide.</p>
            </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=Third+Slide"
            alt="Third slide"
            />
            <Carousel.Caption>
            <h3>Third Slide Label</h3>
            <p>Description for the third slide.</p>
            </Carousel.Caption>
        </Carousel.Item>
        </Carousel>
    </div>
    )
}

export default Slide