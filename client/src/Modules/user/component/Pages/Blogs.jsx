import React, { useEffect, useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import Blog from "../widgets/Blog";
import axios from "axios";
import config from "../../../../config";
import Header from "../../component/widgets/Header";
import About from "../widgets/About";
import Card from "../../component/widgets/Card";

import styled from "styled-components";
import paris from "../../image/paris.jpeg";
import tokiyo from "../../image/tokiyo.jpeg";

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

const DropdownContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const Dropdown = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  color: #2c3e50;
  background-color: #fff;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #34495e;
  }
`;

const Blogs = () => {
  const host = config.host;
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    axios
      .get(`${host}/api/blog/getblog`)
      .then((res) => {
        setBlogs(res.data);
        const uniqueCategories = Array.from(
          new Set(res.data.map((blog) => blog.category))
        );
        const categoryData = uniqueCategories.map((category) => {
          const subcategories = Array.from(
            new Set(
              res.data
                .filter((blog) => blog.category === category)
                .map((blog) => blog.subcategory)
            )
          );
          return { name: category, subcategories };
        });
        setCategories(categoryData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [host]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    const category = categories.find((cat) => cat.name === event.target.value);
    setSubcategories(category ? category.subcategories : []);
    setSelectedSubcategory("");
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (selectedCategory && blog.category !== selectedCategory) return false;
    if (selectedSubcategory && blog.subcategory !== selectedSubcategory)
      return false;
    return true;
  });

  return (
    <>
      <Header />
      <Container>
        <Title>Travel Blog</Title>
        <Subtitle>Explore Our Latest Adventures</Subtitle>
        <Content>
          <DropdownContainer>
            <Dropdown value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Select Category - All</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Dropdown>
            {subcategories.length > 0 && (
              <Dropdown
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </Dropdown>
            )}
          </DropdownContainer>
          <BlogSection>
            <BlogTitle>Our Blogs</BlogTitle>
            <BlogList>
              {filteredBlogs.map((item) => (
                <Card key={item.id} data={item} />
              ))}
            </BlogList>
          </BlogSection>
        </Content>
      </Container>
    </>
  );
};

export default Blogs;
