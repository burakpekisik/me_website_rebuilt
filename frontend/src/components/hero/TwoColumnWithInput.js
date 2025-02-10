import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Slider from "react-slick";
import { ReactTyped } from "react-typed"; // 'Typed' yerine 'ReactTyped' olarak düzeltiyoruz
//eslint-disable-next-line
import { css } from "styled-components/macro";
import { useNavigate } from "react-router-dom";

import Header from "../headers/light.js";

import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-1.svg";
import DesignIllustration from "../../images/design-illustration-2.svg";
import CustomersLogoStripImage from "../../images/customers-logo-strip.png";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col lg:flex-row lg:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-5/12 text-center max-w-lg mx-auto lg:max-w-none lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex-1 flex flex-col justify-center lg:self-end`;

const Heading = tw.h1`font-bold text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight`;
const Paragraph = tw.p`my-5 lg:my-8 text-base xl:text-lg`;

const Actions = styled.div`
  ${tw`relative max-w-md text-center mx-auto lg:mx-0`}
  input {
    ${tw`sm:pr-48 pl-8 py-4 sm:py-5 rounded-full border-2 w-full font-medium focus:outline-none transition duration-300  focus:border-primary-500 hover:border-gray-500`}
  }
  button {
    ${tw`w-full sm:absolute right-0 top-0 bottom-0 bg-primary-500 text-gray-100 font-bold mr-2 my-4 sm:my-2 rounded-full py-4 flex items-center justify-center sm:w-40 sm:leading-none focus:outline-none hover:bg-primary-900 transition duration-300`}
  }
`;

const IllustrationContainer = tw.div`flex justify-center lg:justify-end items-center`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none opacity-5 absolute left-0 bottom-0 h-64 w-64 transform -translate-x-2/3 -z-10`}
`;

const CustomersLogoStrip = styled.div`
  ${tw`mt-12 lg:mt-20`}
  p {
    ${tw`uppercase text-sm lg:text-xs tracking-wider font-bold text-gray-500`}
  }
  img {
    ${tw`mt-4 w-full lg:pr-16 xl:pr-32 opacity-50`}
  }
`;

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

export default ({ roundedHeaderButton }) => {
  const tokenExists = localStorage.getItem("token"); // Token kontrolü
  const [email, setEmail] = useState(""); // State to track email input
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Redirect to the signup page with email as a query parameter
      navigate(
        `/components/innerPages/SignupPage?email=${encodeURIComponent(email)}`
      );
    }
  };

  return (
    <>
      <Header roundedHeaderButton={roundedHeaderButton} />
      <Container>
        <Slider {...settings}>
          <div>
            <TwoColumn>
              <LeftColumn>
                <Heading>
                  <ReactTyped
                    strings={[
                      "Mektup Yazmanın Kolay Adresi!",
                      "Easy to Customize",
                      "Fully Modular Components",
                      "Just for you.",
                    ]}
                    typeSpeed={50}
                    backSpeed={30}
                    loop
                  />
                </Heading>
                <Paragraph>
                  Our templates are easy to setup, understand and customize.
                  Fully modular components with a variety of pages and
                  components.
                </Paragraph>
                {!tokenExists && (
                  <Actions>
                    <input
                      type="text"
                      placeholder="Your E-mail Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSubmit}>Get Started</button>
                  </Actions>
                )}
                <CustomersLogoStrip>
                  <p>Our TRUSTED Customers</p>
                  <img src={CustomersLogoStripImage} alt="Our Customers" />
                </CustomersLogoStrip>
              </LeftColumn>
              <RightColumn>
                <IllustrationContainer>
                  <img
                    tw="min-w-0 w-full max-w-lg xl:max-w-3xl"
                    src={DesignIllustration}
                    alt="Design Illustration"
                  />
                </IllustrationContainer>
              </RightColumn>
            </TwoColumn>
          </div>
          <div>
            <TwoColumn>
              <LeftColumn>
                <Heading>
                  Another Awesome <span tw="text-primary-500">Slide!</span>
                </Heading>
                <Paragraph>
                  Here is another slide with different content to showcase how
                  the carousel can work with static data.
                </Paragraph>
                {!tokenExists && (
                  <Actions>
                    <input
                      type="text"
                      placeholder="Your E-mail Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSubmit}>Get Started</button>
                  </Actions>
                )}
              </LeftColumn>
              <RightColumn>
                <IllustrationContainer>
                  <img
                    tw="min-w-0 w-full max-w-lg xl:max-w-3xl"
                    src={DesignIllustration}
                    alt="Slide Illustration"
                  />
                </IllustrationContainer>
              </RightColumn>
            </TwoColumn>
          </div>
        </Slider>
        <DecoratorBlob1 />
      </Container>
    </>
  );
};
