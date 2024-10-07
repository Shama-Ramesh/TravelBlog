import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Styled components definitions
const BannerContainer = styled.div`
  background: url("https://example.com/your-banner-image.jpg") no-repeat center
    center/cover; /* Replace with your image URL */
  color: #fff;
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  border-radius: 8px;
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 1;
`;

const BannerTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  font-weight: bold;
`;

const BannerSubtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 300;
`;

const BannerButton = styled.a`
  background-color: #f39c12; /* Orange color */
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #e67e22; /* Darker orange for hover effect */
    transform: scale(1.05);
  }
`;

// React component
const Banner = () => {
  return (
    <BannerContainer>
      <Overlay />
      <BannerContent>
        <BannerTitle>Discover Your Next Adventure</BannerTitle>
        <BannerSubtitle>
          Explore breathtaking destinations and create unforgettable memories
          with our travel guides and tips.
        </BannerSubtitle>
        <BannerButton href="#explore">
          <Link
            to="/user/blogs"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Explore Now
          </Link>
        </BannerButton>
      </BannerContent>
    </BannerContainer>
  );
};

export default Banner;
