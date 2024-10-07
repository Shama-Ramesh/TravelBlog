import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import config from "../../../../config.js";

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

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #141852;
  background-color: #141852;
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
  left: -110%;
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

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Username must be at least 2 characters")
    .required("Username is required"),
  // age: Yup.number()
  //   .min(1, 'Age must be a positive number')
  //   .required('Age is required'),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  image: Yup.mixed().required("Image is required"),
});

function Register() {
  const navigate = useNavigate();
  const [signin, setsignin] = useState(true);

  const togglesignin = () => {
    navigate("/user/SliderLoginForm");
  };

  const host = config.host;

  const formik = useFormik({
    initialValues: {
      username: "",
      age: "",
      email: "",
      password: "",
      image: null,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("age", values.age);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("image", values.image);

      Axios.post(`${host}/api/user/userRegister`, formData)
        .then((res) => {
          if (res.data) {
            alert("Inserted Successfully");
            navigate("/user/SliderLoginForm");
          }
        })
        .catch((err) => {
          console.log("Error:" + err);
        });
    },
  });

  return (
    <Container>
      <SignUpContainer signin={false}>
        <Form onSubmit={formik.handleSubmit}>
          <Title>Create Account</Title>
          <Input
            type="text"
            placeholder="UserName"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <ErrorText>{formik.errors.username}</ErrorText>
          ) : null}
          <Input
            type="text"
            placeholder="Age"
            name="age"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.age}
          />
          {formik.touched.age && formik.errors.age ? (
            <ErrorText>{formik.errors.age}</ErrorText>
          ) : null}
          <Input
            type="email"
            placeholder="Email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <ErrorText>{formik.errors.email}</ErrorText>
          ) : null}
          <Input
            type="password"
            placeholder="Password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <ErrorText>{formik.errors.password}</ErrorText>
          ) : null}
          <label>Upload your Image</label>
          <Input
            type="file"
            placeholder="Upload your image"
            name="image"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
          />
          {formik.touched.image && formik.errors.image ? (
            <ErrorText>{formik.errors.image}</ErrorText>
          ) : null}
          <Button type="submit">Sign Up</Button>
        </Form>
      </SignUpContainer>

      <OverlayContainer signin={true}>
        <Overlay signin={false}>
          <LeftOverlayPanel signin={false}>
            <Title>Welcome Back!</Title>
            <Paragraph>
              To keep connected with us please login with your personal info
            </Paragraph>
            <GhostButton onClick={togglesignin}>Sign In</GhostButton>
          </LeftOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
}

export default Register;
