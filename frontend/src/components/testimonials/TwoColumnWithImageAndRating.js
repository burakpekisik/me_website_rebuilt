import "slick-carousel/slick/slick.css";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import tw from "twin.macro";
import styled from "styled-components";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import Axios from "axios";
import { ReactComponent as StarIconBase } from "images/star-icon.svg";
import { ReactComponent as ArrowLeftIcon } from "images/arrow-left-3-icon.svg";
import { ReactComponent as ArrowRightIcon } from "images/arrow-right-3-icon.svg";
import userImage from "images/user-icon.png";
import loveIllustrationImageSrc from "images/love-illustration.svg";

const Row = tw.div`flex flex-col md:flex-row justify-between items-center`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 xl:w-6/12 flex-shrink-0 relative`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 xl:w-6/12 mt-16 md:mt-0`,
  props.textOnLeft
    ? tw`md:pr-12 lg:pr-16 md:order-first`
    : tw`md:pl-12 lg:pl-16 md:order-last`,
]);

const Subheading = tw.div`text-center md:text-left text-2xl font-semibold`;
const Heading = tw.h2`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-6 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const TestimonialSlider = styled(Slider)`
  ${tw`w-full mt-10 text-center md:text-left`}
  .slick-track {
    ${tw`flex`}
  }
  .slick-slide {
    ${tw`h-auto flex justify-center mb-1`}
  }
`;

const Testimonial = tw.div`outline-none h-full flex! flex-col`;
const StarsContainer = styled.div``;
const StarIcon = tw(
  StarIconBase
)`inline-block w-5 h-5 text-orange-400 fill-current mr-1 last:mr-0`;
const TestimonialHeading = tw.div`mt-4 text-xl font-bold`;
const Quote = tw.blockquote`mt-4 mb-8 sm:mb-10 leading-relaxed font-medium text-gray-700`;

const CustomerInfoAndControlsContainer = tw.div`mt-auto flex justify-between items-center flex-col sm:flex-row`;
const CustomerInfo = tw.div`flex flex-col sm:flex-row items-center justify-center lg:justify-start`;
const CustomerProfilePicture = tw.img`rounded-full w-16 h-16 sm:w-20 sm:h-20`;
const CustomerTextInfo = tw.div`text-center md:text-left sm:ml-6 mt-2 sm:mt-0`;
const CustomerName = tw.h5`font-bold text-xl`;

const Controls = styled.div`
  ${tw`flex mt-8 sm:mt-0`}
  .divider {
    ${tw`my-3 border-r`}
  }
`;
const ControlButton = styled.button`
  ${tw`mx-3 p-4 rounded-full transition duration-300 bg-gray-200 hover:bg-gray-300 text-primary-500 hover:text-primary-700 focus:outline-none focus:shadow-outline`}
  svg {
    ${tw`w-4 h-4 stroke-3`}
  }
`;

export default ({
  imageSrc = loveIllustrationImageSrc,
  imageRounded = true,
  imageBorder = false,
  imageShadow = false,
  subheading = "Testimonials",
  heading = "Our Clients Love Us.",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam.",
  textOnLeft = false,
}) => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [sliderRef, setSliderRef] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  // Yorumları API'den al
  useEffect(() => {
    Axios.get(`${BASE_URL}/comments`)
      .then((response) => {
        setTestimonials(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, []);

  return (
    <Container>
      <ContentWithPaddingXl>
        <Row>
          <ImageColumn>
            <img
              src={imageSrc}
              alt="Love illustration"
              css={[
                imageRounded && tw`rounded`,
                imageBorder && tw`border`,
                imageShadow && tw`shadow`,
              ]}
            />
          </ImageColumn>
          <TextColumn textOnLeft={textOnLeft}>
            <Subheading>{subheading}</Subheading>
            <Heading>{heading}</Heading>
            <Description>{description}</Description>
            {testimonials.length > 0 ? (
              <TestimonialSlider
                arrows={testimonials.length > 1} // Yalnızca bir yorum varsa okları gösterme
                ref={setSliderRef}
              >
                {testimonials.map((testimonial, index) => (
                  <Testimonial key={index}>
                    <StarsContainer>
                      {Array.from({ length: testimonial.star }).map(
                        (_, indexIcon) => (
                          <StarIcon key={indexIcon} />
                        )
                      )}
                    </StarsContainer>
                    <TestimonialHeading>{testimonial.title}</TestimonialHeading>
                    <Quote>{testimonial.text}</Quote>
                    <CustomerInfoAndControlsContainer>
                      <CustomerInfo>
                        <CustomerProfilePicture
                          src={userImage} // Sabit insan ikonu kullan
                          alt="Customer"
                        />
                        <CustomerTextInfo>
                          {/* Sadece adın ilk harfini göster */}
                          <CustomerName>
                            {testimonial.customer_name.charAt(0)}.
                          </CustomerName>
                        </CustomerTextInfo>
                      </CustomerInfo>
                      {testimonials.length > 1 && (
                        <Controls>
                          <ControlButton onClick={sliderRef?.slickPrev}>
                            <ArrowLeftIcon />
                          </ControlButton>
                          <div className="divider" />
                          <ControlButton onClick={sliderRef?.slickNext}>
                            <ArrowRightIcon />
                          </ControlButton>
                        </Controls>
                      )}
                    </CustomerInfoAndControlsContainer>
                  </Testimonial>
                ))}
              </TestimonialSlider>
            ) : (
              <p>No testimonials available.</p>
            )}
          </TextColumn>
        </Row>
      </ContentWithPaddingXl>
    </Container>
  );
};
