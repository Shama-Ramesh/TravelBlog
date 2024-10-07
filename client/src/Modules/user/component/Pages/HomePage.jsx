import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import About from "../widgets/About";
import AboutUs from "../widgets/AboutUs";
import Banner from "../widgets/Banner";
import { Feedback } from "@mui/icons-material";
import FeedbackForm from "../widgets/Feedback";
import { Link } from "react-router-dom";

const Hero = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "80vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  textAlign: "center",
  overflow: "hidden",
  "& video": {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "translate(-50%, -50%)",
    zIndex: -1,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
    zIndex: 0,
  },
}));

const HeroText = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: "bold",
  zIndex: 1,
  [theme.breakpoints.up("md")]: {
    fontSize: "4rem",
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  marginTop: "20px",
  backgroundColor: "#f39c12",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#45a049",
  },
  zIndex: 1,
  animation: "bounce 2s infinite",
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateY(0)",
    },
    "40%": {
      transform: "translateY(-10px)",
    },
    "60%": {
      transform: "translateY(-5px)",
    },
  },
}));

const Testimonials = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: "#f5f5f5",
  textAlign: "center",
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: "0 auto",
}));

const HomePage = () => {
  const navigate = useNavigate();

  // Uncomment and adjust the path as needed
  // const handleStartYourJourneyClick = () => {
  //   navigate('/startyourjourney');
  // };

  return (
    <>
      <Hero>
        <video autoPlay muted loop>
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <div>
          <HeroText variant="h1">Welcome to Travel Blog</HeroText>
          <Typography variant="h5" sx={{ zIndex: 1 }}>
            Explore the world with us!
          </Typography>
          <CTAButton variant="contained">
            <Link
              to="/user/blogs"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Start Your Journey
            </Link>
          </CTAButton>
        </div>
      </Hero>

      <About />
      <Banner />

      <AboutUs />

      {/* Uncomment to use the testimonials section */}
      {/* <Testimonials>
        <Container>
          <Typography variant="h4" gutterBottom>
            What Our Readers Say
          </Typography>
          <Grid container spacing={4}>
            {[1, 2, 3].map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <TestimonialCard>
                  <CardContent>
                    <Avatar
                      sx={{ margin: "0 auto 20px", width: 60, height: 60 }}
                    >
                      A
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      John Doe
                    </Typography>
                    <Typography variant="body2">
                      "This blog has transformed the way I travel. Highly
                      recommended!"
                    </Typography>
                  </CardContent>
                </TestimonialCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Testimonials> */}
    </>
  );
};

export default HomePage;
