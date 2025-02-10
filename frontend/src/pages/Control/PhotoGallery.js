import React, { useState } from "react";
import styled from "styled-components";

const GalleryContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 20px auto;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  ${(props) => (props.direction === "left" ? "left: 10px;" : "right: 10px;")}

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`;

const PhotoScrollContainer = styled.div`
  display: flex;
  overflow-x: hidden;
  gap: 15px;
  padding: 20px;
  background-color: #f7f9fc;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const PhotoWrapper = styled.div`
  position: relative;
  min-width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const PhotoGallery = ({ photos, onPhotoClick }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = React.useRef(null);

  const scrollAmount = 400; // Adjust based on your design

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
      setScrollPosition((prev) => Math.max(0, prev - scrollAmount));
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setScrollPosition((prev) => prev + scrollAmount);
    }
  };

  return (
    <GalleryContainer>
      {scrollPosition > 0 && (
        <NavigationButton direction="left" onClick={scrollLeft}>
          ←
        </NavigationButton>
      )}
      <PhotoScrollContainer ref={scrollRef}>
        {photos.map((photoUrl, index) => (
          <PhotoWrapper key={index} onClick={() => onPhotoClick(photoUrl)}>
            <PhotoImage
              src={photoUrl}
              alt={`Uploaded photo ${index + 1}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/placeholder-image.png";
              }}
            />
          </PhotoWrapper>
        ))}
      </PhotoScrollContainer>
      {scrollPosition + scrollRef.current?.clientWidth <
        scrollRef.current?.scrollWidth && (
        <NavigationButton direction="right" onClick={scrollRight}>
          →
        </NavigationButton>
      )}
    </GalleryContainer>
  );
};

export default PhotoGallery;
