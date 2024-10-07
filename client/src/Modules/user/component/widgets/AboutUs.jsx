import React from "react";
import styled from "styled-components";
import bg from "../../image/bg.jpeg";
import FeedbackForm from "./Feedback";
import axios from "axios";
import config from "../../../../config";
import { useState, useEffect } from "react";
import defaultAvatar from "../../image/avatar.jpeg";

// Styled components definitions
const Container = styled.div`
  background-color: #f8f9fa;
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

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
`;

const OverviewText = styled.div`
  font-size: 1rem;
  color: #7f8c8d;
  line-height: 1.6;
  max-width: 600px;
  text-align: left;
  padding: 40px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TestimonialsSection = styled.section`
  margin-top: 60px;
`;

const TestimonialsTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const TestimonialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const Testimonial = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover;
  //   border: 2px solid #2980b9;
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 10px;
`;

const TestimonialAuthor = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  color: #2980b9;
`;

const ContactSection = styled.section`
  background-color: #000;
  color: #f39c12; /* Orange color */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 60px;
`;

const ContactTitle = styled.h3`
  font-size: 1.5rem;
  color: #f39c12; /* Orange color */
  margin-bottom: 20px;
`;

const ContactText = styled.p`
  font-size: 1rem;
  color: white; /* Orange color */
  line-height: 1.6;
`;

const ContactInfo = styled.div`
  font-size: 1rem;
  color: #f39c12; /* Orange color */
  margin-top: 10px;
`;

// React component
const AboutUs = () => {
  const host = config.host;

  const [feed, setFeed] = useState([]);

  useEffect(() => {
    axios
      .get(`${host}/api/report/all-feed`)
      .then((res) => {
        console.log(res.data, "res");
        setFeed(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [host]);

  // Extract the last 3 testimonials from the feed
  const latestTestimonials = feed.slice(-3);

  return (
    <Container>
      <Title>About Us</Title>
      <Subtitle>Who We Are</Subtitle>

      <Section>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "40px",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Image src={bg} alt="Travel Adventures" />
          <OverviewText>
            Welcome to our travel blog! We are passionate explorers who love
            sharing our adventures and experiences from around the world. Our
            mission is to inspire and guide fellow travelers by providing
            engaging content and practical travel tips. From exotic destinations
            to hidden gems in well-trodden cities, our blog covers a diverse
            range of travel experiences. We believe that travel is not just
            about visiting new places but about immersing oneself in the local
            culture, cuisine, and traditions. Whether you're looking for
            thrilling adventure travel, relaxing getaways, or unique cultural
            experiences, we've got you covered. Our team consists of avid
            travelers, photographers, and writers who are dedicated to bringing
            you authentic and up-to-date information. Each blog post is crafted
            with care, featuring beautiful photography, detailed itineraries,
            and useful tips to make your travels memorable and enjoyable. We
            also believe in responsible and sustainable travel.
          </OverviewText>
        </div>
      </Section>

      <TestimonialsSection>
        <TestimonialsTitle>What Our Readers Say</TestimonialsTitle>
        <TestimonialList>
          {latestTestimonials.map((testimonial, index) => {
            const avatarUrl =
              `${host}/api/user-image/${testimonial?.user_id?.image}`.replace(
                /\\/g,
                "/"
              );
            return (
              <Testimonial key={index}>
                <Avatar
                  src={avatarUrl}
                  alt={`${testimonial?.user_id?.image}'s avatar`}
                  onError={(e) => (e.target.src = defaultAvatar)} // Use default avatar if the image fails to load
                />
                <div>
                  <TestimonialText>{testimonial.message}</TestimonialText>
                  <TestimonialAuthor>{testimonial.name}</TestimonialAuthor>
                </div>
              </Testimonial>
            );
          })}
        </TestimonialList>
      </TestimonialsSection>

      <FeedbackForm />

      <ContactSection>
        <ContactTitle>Contact Us</ContactTitle>
        <ContactText>
          We would love to hear from you! If you have any questions,
          suggestions, or just want to say hello, feel free to reach out.
        </ContactText>
        <ContactInfo>
          Email: <a href="mailto:info@travelblog.com">info@travelblog.com</a>
          <br />
          Phone: +1 (123) 456-7890
        </ContactInfo>
      </ContactSection>
    </Container>
  );
};

export default AboutUs;
