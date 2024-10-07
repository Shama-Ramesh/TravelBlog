import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import Axios from 'axios';
import config from '../config';

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const host = config.host;
  const [data, setData] = useState({});

  useEffect(() => {
    Axios.get(`${host}/api/category/getSingleCategory/${id}`)
      .then((res) => {
        if (res.data) {
          console.log('Fetched Data:', res.data);
          setData(res.data);
        }
      })
      .catch((err) => {
        console.log('Error fetching data:', err);
      });
  }, [id]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    Axios.put(`${host}/api/category/UpdateCategory/${id}`, data)
      .then((res) => {
        if (res.data) {
          alert('Updated Successfully');
          navigate('/MUI');
        }
      })
      .catch((err) => {
        console.log('Error updating data:', err);
      });
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: 'pink' }}
    >
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          Edit Category
        </Typography>
        <Box
          height={400}
          width={400}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={2}
          sx={{ backgroundColor: 'white', borderRadius: 1 }}
        >
          <TextField
            id="outlined-basic"
            label="Enter Name"
            name="username"
            variant="outlined"
            value={data.username}
            onChange={handleChange}
            sx={{ marginBottom: 2, width: '100%' }}
          />
          <TextField
            id="outlined-basic"
            label="Enter Email"
            name="email"
            variant="outlined"
            value={data.email}
            onChange={handleChange}
            sx={{ marginBottom: 2, width: '100%' }}
          />
          <TextField
            id="outlined-basic"
            label="Enter Phone"
            name="phone"
            variant="outlined"
            value={data.phone}
            onChange={handleChange}
            sx={{ marginBottom: 2, width: '100%' }}
          />
          <TextField
            id="outlined-basic"
            label="Enter Address"
            name="address"
            variant="outlined"
            value={data.address}
            onChange={handleChange}
            sx={{ marginBottom: 2, width: '100%' }}
          />
          <Button variant="contained" onClick={onSubmit}>
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
