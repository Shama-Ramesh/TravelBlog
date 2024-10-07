import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import feed from "../../image/feed1.jpeg";
import axios from "axios";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";

const FeedbackContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: "#fafafa",
  textAlign: "center",
}));

const FeedbackCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: "0 auto",
  padding: theme.spacing(3),
  borderRadius: "10px",
  boxShadow: theme.shadows[5],
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: "#f39c12",
  color: "#fff",
  borderRadius: "8px",
  padding: theme.spacing(1.5, 3),
  "&:hover": {
    backgroundColor: "#e67e22",
  },
  "&:focus": {
    outline: "none",
  },
}));

const ImageSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#ddd",
  height: "420px",
  "& img": {
    maxWidth: "100%",
    height: "auto",
  },
}));

const FeedbackForm = () => {
  const host = config.host;
  const nav = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let token = JSON.parse(localStorage.getItem("userToken"));
    if (!token) {
      nav("/user/SliderLoginForm");
    }
    await axios.post(`${host}/api/report/insert-feed`, formValues, {
      headers: {
        "auth-token": token,
      },
    });

    // Handle form submission logic here
    setSubmitted(true);
  };

  return (
    <FeedbackContainer>
      <Container>
        <Typography variant="h4" gutterBottom>
          We Value Your Feedback
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FeedbackCard>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <StyledTextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                  <StyledTextField
                    id="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={formValues.email}
                    onChange={handleChange}
                    required
                  />
                  <StyledTextField
                    id="message"
                    label="Message"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={formValues.message}
                    onChange={handleChange}
                    required
                  />
                  <Box sx={{ textAlign: "center" }}>
                    <SubmitButton type="submit" variant="contained">
                      Submit Feedback
                    </SubmitButton>
                  </Box>
                  {submitted && (
                    <Typography
                      variant="body1"
                      color="success.main"
                      sx={{ marginTop: 2 }}
                    >
                      Thank you for your feedback!
                    </Typography>
                  )}
                </form>
              </CardContent>
            </FeedbackCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <ImageSection>
              <img src={feed} alt="Feedback" sx={{ height: "400px" }} />
            </ImageSection>
          </Grid>
        </Grid>
      </Container>
    </FeedbackContainer>
  );
};

export default FeedbackForm;
