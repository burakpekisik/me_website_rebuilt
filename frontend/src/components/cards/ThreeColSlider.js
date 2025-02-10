import axios from "axios"; // Axios import edildi
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons";
import { SectionHeading } from "components/misc/Headings";
import { ReactComponent as ChevronLeftIcon } from "feather-icons/dist/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "feather-icons/dist/icons/chevron-right.svg";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import styled from "styled-components";
import tw from "twin.macro";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-16 lg:py-20`;

const HeadingWithControl = tw.div`flex flex-col items-center sm:items-stretch sm:flex-row justify-between`;
const Heading = tw(SectionHeading)``;
const Controls = tw.div`flex items-center`;
const ControlButton = styled(PrimaryButtonBase)`
  ${tw`mt-4 sm:mt-0 first:ml-0 ml-6 rounded-full p-2`}
  svg {
    ${tw`w-6 h-6`}
  }
`;
const PrevButton = tw(ControlButton)``;
const NextButton = tw(ControlButton)``;

const CardSlider = styled(Slider)`
  ${tw`mt-16`}
  .slick-track {
    ${tw`flex`}
  }
  .slick-slide {
    ${tw`h-auto flex justify-center mb-1`}
  }
`;
const Card = tw.div`h-full flex! flex-col sm:border max-w-sm sm:rounded-tl-4xl sm:rounded-br-5xl relative focus:outline-none`;
const CardImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`w-full h-56 sm:h-64 bg-cover bg-center rounded sm:rounded-none sm:rounded-tl-4xl`,
]);

const TextInfo = tw.div`py-6 sm:px-10 sm:py-6`;
const TitleReviewContainer = tw.div`flex flex-col sm:flex-row sm:justify-between sm:items-center`;
const Title = tw.h5`text-2xl font-bold`;

const Description = tw.p`text-sm leading-loose mt-2 sm:mt-4`;

const SecondaryInfoContainer = tw.div`flex flex-col sm:flex-row mt-2 sm:mt-4`;
const IconWithText = tw.div`flex items-center mr-6 my-2 sm:my-0`;
const IconContainer = styled.div`
  ${tw`inline-block rounded-full p-2 bg-gray-700 text-gray-100`}
  svg {
    ${tw`w-3 h-3`}
  }
`;
const Text = tw.div`ml-2 text-sm font-semibold text-gray-800`;

const PrimaryButton = tw(
  PrimaryButtonBase
)`mt-auto sm:text-lg rounded-none w-full rounded sm:rounded-none sm:rounded-br-4xl py-3 sm:py-6`;

export default () => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [sliderRef, setSliderRef] = useState(null);
  const [blogs, setBlogs] = useState([]); // Blogları tutacak state

  const sliderSettings = {
    arrows: false,
    slidesToShow: Math.min(3, blogs.length), // Blog sayısına göre slider'ı düzenle
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(2, blogs.length),
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(1, blogs.length),
        },
      },
    ],
  };

  useEffect(() => {
    // Blogları çekme işlemi
    axios.get(`${BASE_URL}/blogs`).then((response) => {
      setBlogs(response.data); // Gelen blog verilerini state'e set ediyoruz
    });
  }, []);

  return (
    <Container>
      <Content>
        <HeadingWithControl>
          <Heading>Popular Blogs</Heading>
          <Controls>
            <PrevButton onClick={sliderRef?.slickPrev}>
              <ChevronLeftIcon />
            </PrevButton>
            <NextButton onClick={sliderRef?.slickNext}>
              <ChevronRightIcon />
            </NextButton>
          </Controls>
        </HeadingWithControl>
        <CardSlider ref={setSliderRef} {...sliderSettings}>
          {blogs.map((blog, index) => (
            <Card key={index}>
              <CardImage imageSrc={`${BASE_URL}/${blog.main_photo}`}  />
              <TextInfo>
                <TitleReviewContainer>
                  <Title>{blog.title}</Title>
                </TitleReviewContainer>
                <Description>
                  {blog.text.length > 50
                    ? `${blog.text.slice(0, 200)}...`
                    : blog.text}
                </Description>
              </TextInfo>
              <PrimaryButton href={`/blogs/${blog.id}`}>
                Blog'u Oku
              </PrimaryButton>
            </Card>
          ))}
        </CardSlider>
      </Content>
    </Container>
  );
};
