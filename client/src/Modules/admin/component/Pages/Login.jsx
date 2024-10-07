import React, { useState } from "react";
import styled from "styled-components";
import Axios from "axios";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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
  min-height: 500px; /* Adjusted minimum height */
  margin: 50px 250px auto; /* Centering the container */
`;

const SignInContainer = styled.div.attrs((props) => ({
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
  border: ${(props) => (props.error ? "1px solid red" : "none")};
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
function AdminLogin() {
  const [signin, setsignin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const host = config.host;

  const validate = () => {
    let emailError = "";
    let passwordError = "";

    if (!email.includes("@")) {
      emailError = "Invalid email address";
      toast.error(emailError);
    }

    if (password.length < 6) {
      passwordError = "Password must be at least 6 characters long";
      toast.error(passwordError);
    }

    if (emailError || passwordError) {
      setEmailError(emailError);
      setPasswordError(passwordError);
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = validate();
    if (isValid) {
      Axios.post(`${host}/api/user/adminLogin`, { email, password })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            toast.success("Login Successful");
            // Optionally save the token in localStorage or any state management tool
            localStorage.setItem("adminToken", JSON.stringify(res.data.token));
            setTimeout(() => {
              navigate("/admin/");
            }, 1000);
            // Redirect to the admin dashboard or any other page
          } else {
            toast.error(res.data);
          }
        })
        .catch((err) => {
          console.log("Error:" + err);
          toast.error("An error occurred during login");
        });
    }
  };

  const toggleSignIn = () => {
    navigate("/admin/register");
  };

  return (
    <Container>
      <ToastContainer />
      <SignInContainer signin={signin}>
        <Form onSubmit={handleSubmit}>
          <Title>Admin Sign In</Title>
          <Input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError ? true : false}
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          <Input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError ? true : false}
          />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          <Button type="submit">Sign In</Button>
        </Form>
      </SignInContainer>

      <OverlayContainer signin={signin}>
        <Overlay signin={signin}>
          <RightOverlayPanel signin={signin}>
            <Title>Welcome, Admin!</Title>
            <Paragraph>
              Enter your personal details and start managing the platform with
              us.
            </Paragraph>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
}

export default AdminLogin;
