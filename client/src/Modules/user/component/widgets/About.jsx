import React from "react";
import styled from "styled-components";
import paris from "../../image/paris.jpeg";
import tokiyo from "../../image/tokiyo.jpeg";
import { Link } from "react-router-dom";

// Styled components definitions
const Container = styled.div`
  background-color: #f9f9f9;
  padding: 40px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  font-size: 1.8rem;
  color: #34495e;
  margin-bottom: 30px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BlogSection = styled.section`
  margin-bottom: 60px;
`;

const BlogTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
`;

const BlogList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const BlogPost = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  text-align: left;
`;

const BlogImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const BlogTitleText = styled.h4`
  font-size: 1.2rem;
  color: #2980b9;
  margin: 10px 0;
`;

const BlogExcerpt = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const ReadMoreButton = styled.button`
  background-color: #f39c12; /* Orange color */
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e67e22; /* Darker orange for hover effect */
  }
`;

const BucketListSection = styled.section`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BucketListTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const BucketListItems = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const BucketListItem = styled.li`
  font-size: 1rem;
  color: #34495e;
  margin: 10px 0;
  position: relative;
  padding-left: 20px;

  &::before {
    content: "✔";
    position: absolute;
    left: 0;
    color: #27ae60;
    font-size: 1.2rem;
  }
`;

const About = () => {
  return (
    <Container>
      <Title>Travel Blog</Title>
      <Subtitle>Explore Our Latest Adventures</Subtitle>
      <Content>
        <BlogSection>
          <BlogTitle>Recent Posts</BlogTitle>
          <BlogList>
            <BlogPost>
              <BlogImage src={paris} alt="Destination 1" />
              <BlogTitleText>Exploring the Wonders of Paris</BlogTitleText>
              <BlogExcerpt>
                Discover the enchanting city of Paris with its stunning
                landmarks and rich history.
              </BlogExcerpt>
              <ReadMoreButton>
                <Link
                  to="/user/blogs"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Read More
                </Link>
              </ReadMoreButton>
            </BlogPost>
            <BlogPost>
              <BlogImage src={tokiyo} alt="Destination 2" />
              <BlogTitleText>
                A Journey Through the Streets of Tokyo
              </BlogTitleText>
              <BlogExcerpt>
                Experience the vibrant culture and modern marvels of Tokyo, a
                city like no other.
              </BlogExcerpt>
              <ReadMoreButton>
                <Link
                  to="/user/blogs"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Read More
                </Link>
              </ReadMoreButton>
            </BlogPost>
            <BlogPost>
              <BlogImage src={paris} alt="Destination 1" />
              <BlogTitleText>Exploring the Wonders of Paris</BlogTitleText>
              <BlogExcerpt>
                Discover the enchanting city of Paris with its stunning
                landmarks and rich history.
              </BlogExcerpt>
              <ReadMoreButton>
                <Link
                  to="/user/blogs"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Read More
                </Link>
              </ReadMoreButton>
            </BlogPost>

            {/* Add more blog posts as needed */}
          </BlogList>
        </BlogSection>
      </Content>
    </Container>
  );
};

export default About;
