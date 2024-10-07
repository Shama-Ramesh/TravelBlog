import React, { useState } from "react";
import styled from "styled-components";
import Axios from "axios";
import config from "../../../../config.js";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled components definitions
const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 850px; /* Adjusted width */
  max-width: 100%; /* Ensure it doesn't exceed the screen width */
  min-height: 600px; /* Adjusted minimum height */
  margin: 50px auto; /* Centering the container */
`;

const SignUpContainer = styled.div.attrs((props) => ({
  style: {
    transform: props.signin ? "translateX(100%)" : "translateX(0)",
    opacity: props.signin ? 0 : 1,
    zIndex: props.signin ? 1 : 5,
  },
}))`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
`;

const SigninContainer = styled.div.attrs((props) => ({
  style: {
    transform: props.signin ? "translateX(0)" : "translateX(100%)",
  },
}))`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
`;

const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0;
`;

const Input = styled.input`
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #2b2f77;
  background-color: #2b2f77;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
`;

const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

const OverlayContainer = styled.div.attrs((props) => ({
  style: {
    transform: props.signin ? "translateX(0)" : "translateX(-100%)",
  },
}))`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
`;

const Overlay = styled.div.attrs((props) => ({
  style: {
    transform: props.signin ? "translateX(0)" : "translateX(50%)",
  },
}))`
  background: #141852; /* Changed background color */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -90%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

const LeftOverlayPanel = styled(OverlayPanel).attrs((props) => ({
  style: {
    transform: props.signin ? "translateX(-20%)" : "translateX(0)",
  },
}))``;

const RightOverlayPanel = styled(OverlayPanel).attrs((props) => ({
  style: {
    transform: props.signin ? "translateX(0)" : "translateX(20%)",
  },
}))`
  right: 0;
`;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
`;

// React Component
function SliderLoginForm() {
  const [signin, setsignin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const host = config.host;

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    // API Request
    Axios.post(`${host}/api/user/userLogin`, { email, password })
      .then((res) => {
        if (res.data.success) {
          toast.success("Login Successful");
          localStorage.setItem("userToken", JSON.stringify(res.data.token));
          navigate("/user"); // Redirect to the dashboard or any other page
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Error:" + err);
        toast.error("An error occurred. Please try again.");
      });
  };

  const togglesignin = () => {
    navigate("/user/register");
  };

  return (
    <Container>
      <SigninContainer signin={signin}>
        <Form onSubmit={handleSubmit}>
          <Title>Sign in</Title>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Anchor href="#">Forgot your password?</Anchor>
          <Button type="submit">Sign In</Button>
        </Form>
      </SigninContainer>

      <OverlayContainer signin={signin}>
        <Overlay signin={signin}>
          <RightOverlayPanel signin={signin}>
            <Title>Hello, Friend!</Title>
            <Paragraph>
              Enter your personal details and start your journey with us
            </Paragraph>
            <GhostButton onClick={togglesignin}>Sign Up</GhostButton>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>

      <ToastContainer />
    </Container>
  );
}

export default SliderLoginForm;
